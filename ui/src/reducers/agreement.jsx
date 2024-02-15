import { combineReducers } from 'redux';

import * as AgreementActions from '../actions/agreement'

const initialAgreementsState = []
const initialApprovalState = []


function getIsLoading(state = false, action) {
  switch (action.type) {
    case AgreementActions.START_LOADING:
      return true;
    case AgreementActions.END_LOADING:
      return false;
    default:
      return state;
  }
}


function getAgreements(state = initialAgreementsState, action) {
  switch (action.type) {
    case AgreementActions.END_GET_AGREEMENTS:
      console.log("===============reducer",action)
      return (action.payload && action.payload) || state;
    default:
      return state;
  }
}

function getApprovals(state = initialApprovalState, action){
  switch (action.type) {
    case AgreementActions.END_GET_APPROVALS:
      return action?.payload || state
  
    default:
      return state
  }
}


const Agreements = combineReducers({
  agreements: getAgreements,
  approvals: getApprovals,
  isLoading: getIsLoading
})

export default Agreements