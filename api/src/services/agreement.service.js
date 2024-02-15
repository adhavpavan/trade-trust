const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { Gateway, Wallets } = require('fabric-network');
const { getContractObject, getWalletPath, getCCP, getAgreementsWithPagination } = require('../utils/blockchainUtils');
const {
  NETWORK_ARTIFACTS_DEFAULT,
  BLOCKCHAIN_DOC_TYPE,
  AGREEMENT_STATUS,
  FILTER_TYPE,
} = require('../utils/Constants');
const { getUUID } = require('../utils/uuid');
const { getSignedUrl } = require('../utils/fileUpload');
const THIRTY_DAYS = 2592000000;

// If we are sure that max records are limited, we can use any max number
const DEFAULT_MAX_RECORDS = 100
const utf8Decoder = new TextDecoder();


/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const createAgreement = async (agreementData, fileMetadata, user) => {
  let gateway;
  let client
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    agreementData = {
      fcn: 'CreateContract',
      data: {
        id: getUUID(),
        typeOfContract: agreementData.typeOfContract,
        title: agreementData.title,
        owner: orgName,
        contract: agreementData.contract,
        orgId: parseInt(user.orgId),
        department: user.department,
        firstParty: agreementData.firstParty,
        secondParty: agreementData.secondParty,
        status: AGREEMENT_STATUS.INPROGRESS,
        startDate:parseInt(agreementData.startDate),
        endDate: parseInt(agreementData.endDate),
        docType: BLOCKCHAIN_DOC_TYPE.AGREEMENT,
        comments: [agreementData.comment],
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        document: { ...fileMetadata, createBy: user.email, updatedBy: user.email, createAt: dateTime, updatedAt: dateTime },
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    await  contract.submitTransaction(agreementData.fcn, JSON.stringify(agreementData.data));
    return agreementData.data;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if(client){
      client.close()
    }
  }
};



/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const approveAgreement = async (approvalData, agreementId, user) => {

  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    approvalData = {
      fcn: 'CreateContract',
      data: {
        id: getUUID(),
        agreementId: agreementId,
        description: approvalData.description,
        docType: BLOCKCHAIN_DOC_TYPE.APPROVAL,
        status: approvalData.status,
        action: approvalData.action,
        comment: approvalData.comment,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    }

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(approvalData.fcn, JSON.stringify(approvalData.data));

      let agreement = await queryAgreementById(agreementId, user)
      if(agreement.status === AGREEMENT_STATUS.INPROGRESS){
        agreement.status = AGREEMENT_STATUS.ACTIVE
        await contract.submitTransaction(approvalData.fcn, JSON.stringify(agreement));
      }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error
  } finally {
    if (gateway) {
      gateway.close();
    }
    if(client){
      client.close()
    }
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAgreements = async (filter) => {
  try {
    
 
  let query;
  console.log("==========================filter type", filter)
  if (filter?.filterType) {
    switch (filter.filterType) {
      case FILTER_TYPE.ALL:
        query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}`;

        break;
      case FILTER_TYPE.ACTIVE:
        // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
        query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;

        break;
      case FILTER_TYPE.EXPIRING_SOON:
        // query = `{\"selector\":{{\"endDate\":{\"$lt\":${(+new Date())+THIRTY_DAYS}}}, \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
        query = `{\"selector\":{\"endDate\":{\"$lt\":${(+new Date())+THIRTY_DAYS}}, \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;

        break;
      case FILTER_TYPE.INPROGRESS:
        query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"status\":\"${filter.filterType}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"},  \"use_index\":[\"_design/status_doc_type_index\", \"status_doc_type_index\"]}`;
        console.log("-----------aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-------", query)
        break;

      default:
        query = `{\"selector\":{\"orgId\": ${filter.orgId},\"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
        break;
    }
  }else {
    query = `{\"selector\":{\"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
  }
  // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexOrgDoc\", \"indexDoc\"]}}`;
  //  query = `{\"selector\":{\"orgId\": \"${filter.orgId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
  //  query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}}}`;
  console.log('filters--------------', filter, query);
  let data = await getAgreementsWithPagination(
    query,
    filter.pageSize,
    filter.bookmark,
    filter.orgName,
    filter.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  );
  let tempData =[]
  for(let agreement of data?.data){
    if(agreement?.Record?.document?.id){
      let signedUrl = await getSignedUrl(agreement.Record.document.id, `org${agreement.Record.orgId}`)
      agreement.Record.document.url = signedUrl
    }
    tempData.push(agreement)
  }
  data.data = tempData
  return data;
} catch (error) {
  console.log('error--------------', error);
}
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryApprovalsByAgreementId = async (filter) => {
  console.log(filter);
  let query = `{\"selector\":{\"agreementId\":\"${filter.agreementId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.APPROVAL}\"},  \"use_index\":[\"_design/indexDocTypeAgreementId\", \"docType_agreementId_index\"]}}`;
  // let query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"agreementId\":\"${filter.agreementId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.APPROVAL}\"}}}`;
  let data = await getAgreementsWithPagination(
    query,
    filter.pageSize,
    filter.bookmark,
    filter.orgName,
    filter.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  );
  return data;
};

const validateApprovals = async (agreementId, user) => {
  let orgName = `org${user.orgId}`;
  let filters = {
    pageSize:DEFAULT_MAX_RECORDS,
    bookmark: '',
    orgName: orgName,
    email: user.email,
    agreementId
  }

  let approvals = await queryApprovalsByAgreementId(filters)
  if(approvals?.data?.length){
    let orgDepartmentApproval = approvals.data.filter(elm => elm?.Record?.department == user.department && elm?.Record?.orgId == user.orgId)
    if(orgDepartmentApproval?.length){
      throw new ApiError(httpStatus.FORBIDDEN, `Your department with name: ${user.department} has already approved this agreement`);
    }else if(approvals.data.length >= 3){
      return true
    }
  }
  return false
}

const queryHistoryById = async (id, user) => {
  let gateway;
  let client
  try {
    let orgName = `org${user.orgId}`;
    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction('getAssetHistory', id);
    // result = JSON.parse(result.toString());
    result = JSON.parse(utf8Decoder.decode(result));
    if(result){
      result = result?.map(elm => {
        return {txId: elm?.txId, IsDelete: elm.IsDelete, ...elm.Value, timeStamp: elm?.Timestamp?.seconds?.low*1000}
      })
    }
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if(client){
      client.close()
    }
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const queryAgreementById = async (id, user) => {
  let gateway;
  let client;
  try {
    let orgName = `org${user.orgId}`;

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction('getAssetByID', id);
    console.timeEnd('Test');
    result = JSON.parse(utf8Decoder.decode(result));
    if (result) {
      result.document.url = await getSignedUrl(result?.document?.id, orgName);
    }
    let filter = {
      pageSize: DEFAULT_MAX_RECORDS,
      bookmark: '',
      orgName,
      email: user.email,
      agreementId: id
    }

    let approvals = await queryApprovalsByAgreementId(filter)
    result.approvals = approvals?.data?.map(elm => elm.Record) || []
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if(client){
      client.close()
    }
  }
};

const getDocSignedURL = async (docId, user) => {
  let orgName = `org${user.orgId}`;
  return getSignedUrl(docId, orgName);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createAgreement,
  queryAgreements,
  queryAgreementById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  approveAgreement,
  queryApprovalsByAgreementId,
  getDocSignedURL,
  queryHistoryById,
};
