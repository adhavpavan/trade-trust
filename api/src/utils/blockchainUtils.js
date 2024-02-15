const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');

const ApiError = require('./ApiError');
const httpStatus = require('http-status');

const crypto = require('crypto');
const grpc = require('@grpc/grpc-js');
const { connect, Contract, Identity, Signer, signers } = require('@hyperledger/fabric-gateway');
const utf8Decoder = new TextDecoder();


const config = require('../config/config');
const catchAsync = require('./catchAsync');

const getCCP = async (orgName) => {
  let ccpPath = path.resolve(__dirname, '..', '..', 'connection-profiles', `connection-${orgName}.json`);
  if (!ccpPath) {
    throw new ApiError(httpStatus.NOT_EXTENDED, 'Invalid connection profile');
  }
  const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
  return JSON.parse(ccpJSON);
};

const getCaUrl = async (orgName, ccp) => {
  let caURL = ccp.certificateAuthorities[`ca.${orgName}.example.com`].url;
  if (!caURL) {
    throw new ApiError(httpStatus.NOT_EXTENDED, 'Invalid Certificate authority URL');
  }
  return caURL;
};

const getCaInfo = async (orgName, ccp) => {
  let caInfo = ccp.certificateAuthorities[`ca.${orgName}.example.com`];
  if (!caInfo) {
    throw new ApiError(httpStatus.NOT_EXTENDED, 'Invalid Certificate authority info');
  }
  return caInfo;
};

const getAffiliation = async (org) => {
  // Default in ca config file we have only two affiliations, if you want to use org3 ca, you have to update config file with third affiliation
  //  Here already two Affiliation are there
  return org == 'org1' ? 'org1.department1' : 'org2.department1';
};

const getWalletPath = async (orgName) => {
  let walletPath = path.resolve(__dirname, '../..', `wallets/${orgName}`); //path.join(process.cwd(), `${orgName}-wallet`);
  if (!walletPath) {
    throw new ApiError(httpStatus.NOT_EXTENDED, 'Invalid Wallet Path');
  }
  return walletPath;
};

const enrollAdmin = async (_ca, wallet, orgName, ccp) => {
  const caInfo = await getCaInfo(orgName, ccp);
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
  const enrollment = await ca.enroll({ enrollmentID: config.caAdminId, enrollmentSecret: config.caAdminSecret });

  let x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: `${orgName}MSP`,
    type: 'X.509',
  };
  await wallet.put(config.caAdminId, x509Identity);
  return true;
};

const registerUser = async (orgName, userName, department) => {
  const ccp = await getCCP(orgName);
  const caURL = await getCaUrl(orgName, ccp);
  const ca = new FabricCAServices(caURL);
  const walletPath = await getWalletPath(orgName);

  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const userIdentity = await wallet.get(userName);
  if (userIdentity) {
    let message = `An identity for the user ${userName} already exists in the wallet`;
    throw new ApiError(httpStatus.FORBIDDEN, message);
  }

  let adminIdentity = await wallet.get(config.caAdminId);
  if (!adminIdentity) {
    console.log('An identity for the admin user "admin" does not exist in the wallet');
    await enrollAdmin(ca, wallet, orgName, ccp);
    adminIdentity = await wallet.get(config.caAdminId);
    console.log('Admin Enrolled Successfully', adminIdentity);
  }

  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, 'admin');
  let secret;
  // Register the user, enroll the user, and import the new identity into the wallet.
  secret = await ca.register(
    {
      affiliation: await getAffiliation(orgName),
      enrollmentID: userName,
      role: 'client',
      attrs: [
        { name: 'department', value: department, ecert: true },
        { name: 'role', value: 'approver', ecert: true },
      ],
    },
    adminUser
  );
  // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: userName, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);

  console.log(`Secret for the user with userName: ${userName} -------> ${secret}`);

  const enrollment = await ca.enroll({
    enrollmentID: userName,
    enrollmentSecret: secret,
    attr_reqs: [
      { name: 'role', optional: false },
      { name: 'department', optional: false },
    ],
  });
  // const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: secret, attr_reqs: [{ name: 'role', optional: false }] });

  let x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: orgName.charAt(0).toUpperCase() + orgName.slice(1) + 'MSP',
    type: 'X.509',
  };
  await wallet.put(userName, x509Identity);
  console.log(`Successfully registered and enrolled user ${userName} and imported it into the wallet`);

  console.log(`Before returning the secrets`, secret);

  return secret;
};

const getSigner = (identity) => {
  const privateKeyPem = identity.credentials.privateKey;
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
};

const getIdentity = async (identity) => {
  return { mspId: identity.mspId, credentials: Buffer.from(identity.credentials.certificate) };
};

const getClient = async (ccp, orgName) => {

  const tlsCredentials = grpc.credentials.createSsl(Buffer.from(ccp.peers[`peer0.${orgName}.example.com`].tlsCACerts.pem));

  return new grpc.Client(ccp.peers[`peer0.${orgName}.example.com`].url, tlsCredentials, {
    'grpc.ssl_target_name_override': ccp.peers[`peer0.${orgName}.example.com`].grpcOptions.ssl_target_name_override,
  });
};

const getContractObject = async (orgName, user, channelName, contractName, gateway, client) => {

  const walletPath = await getWalletPath(orgName);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const ccp = await getCCP(orgName);
  let identity = await wallet.get(user);
  if (!identity) {
    let message = `An identity for the user ${user} does not exist in the wallet, please contact admin`;
    throw new ApiError(httpStatus.NOT_EXTENDED, message);
  }

  client =  await  getClient(ccp, orgName);
  gateway = connect({
    client,
    identity: await getIdentity(identity),
    signer: getSigner(identity)
});

  const network = await gateway.getNetwork(channelName);
  let contract = await network.getContract(contractName);
  return contract;
};

const getAgreementsWithPagination = async (queryString, pageSize, bookmark, orgName, user, channelName, contractName) => {
  let gateway;
  let client;
  try {

  
    const contract = await getContractObject(orgName, user, channelName, contractName, gateway, client);
     let  result = await contract.submitTransaction('getDataWithPagination', queryString, pageSize.toString(), bookmark);


    result = JSON.parse(utf8Decoder.decode(result));
    return result;
  } catch (error) {
    console.log( error)
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if(client){
      client.close()
    }
  }
};

module.exports = {
  getContractObject,
  getCCP,
  getCaUrl,
  getWalletPath,
  registerUser,
  getAgreementsWithPagination,
};
