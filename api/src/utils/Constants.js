// @ts-check

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OTHER: 'other'
}

const USER_TYPE = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN:'super-admin'
}

const ORG_DEFAULT_USER = {
  ADMIN: 'admin'
}

const BLOCKCHAIN_DOC_TYPE = {
  AGREEMENT: 'agreement',
  APPROVAL: 'approval',
  DOCUMENT: 'document'
}

const FILTER_TYPE = {
  COMPLETED:'completed',
  EXPIRING_SOON: 'expiring-soon',
  INPROGRESS:'inprogress',
  ALL:'all',
  ACTIVE: 'active'
}

const NETWORK_ARTIFACTS_DEFAULT ={
  CHANNEL_NAME: 'mychannel',
  CHAINCODE_NAME: 'agreement',
  QSCC:'qscc'
}

const ORG_DEPARTMENT = {
  LEGAL: 'legal',
  FINANCIAL: 'financial'
}


const ORG_TYPE = {
  DTP: 'dtp',
  EXPORTER: 'exporter',
  TRANSPORTER: 'transporter',
  BANK:'bank',
  WHOLESALER:'wholesaler'
}


const CHAINCODE_METHODS = {
  CREATE_AGREEMENT: '',
  APPROVE_AGREEMENT:'',
  GET_ASSET_BY_ID: '',
  GET_ASSET_HISTORY:'',
  GET_APPROVALS:''
}

const AGREEMENT_STATUS = {
  ACTIVE: 'active',
  INPROGRESS:'inprogress',
  EXPIRED: 'expired',
  PENDING: 'pending',
  COMPLETED:'completed',
  OTHER: 'other'
}
const APPROVAL_STATUS = {
  APPROVED:'approved',
  REJECTED: 'rejected',
  OTHER: 'other'
}

module.exports = {
  USER_STATUS,
  USER_TYPE,
  ORG_DEPARTMENT,
  NETWORK_ARTIFACTS_DEFAULT,
  BLOCKCHAIN_DOC_TYPE,
  CHAINCODE_METHODS,
  AGREEMENT_STATUS,
  APPROVAL_STATUS,
  FILTER_TYPE,
  ORG_TYPE
}