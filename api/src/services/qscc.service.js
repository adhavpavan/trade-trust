const { getContractObject } = require('../utils/blockchainUtils');
const { NETWORK_ARTIFACTS_DEFAULT } = require('../utils/Constants');
const { BlockDecoder } = require('fabric-common');

const getBlockByBlockNumber = async (blockNumber, user) => {
  let gateway;
  let client;
  try {
    let orgName = `org${user.orgId}`;

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.QSCC,
      gateway,
      client
    );
    let result = await contract.evaluateTransaction('GetBlockByNumber', NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME, blockNumber);
    result = BlockDecoder.decode(Buffer.from(result));
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const getTxByTxId = async (txId, user) => {
  let gateway;
  let client;
  try {
    let orgName = `org${user.orgId}`;

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.QSCC,
      gateway,
      client
    );
    let result = await contract.evaluateTransaction('GetTransactionByID', NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME, txId);
    result = BlockDecoder.decodeTransaction(Buffer.from(result));
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

module.exports = {
  getBlockByBlockNumber,
  getTxByTxId,
};
