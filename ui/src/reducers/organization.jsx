import { combineReducers } from 'redux';

import * as OrganizationActions from '../actions/organization'

const initialORGListState = []


function getIsLoading(state = false, action) {
    switch (action.type) {
        case OrganizationActions.START_LOADING:
            return true;
        case OrganizationActions.END_LOADING:
            return false;
        default:
            return state;
    }
}


function getORGList(state = initialORGListState, action) {
    switch (action.type) {
        case OrganizationActions.END_GET_ORGS:
            console.log("===============reducer==========================", action)
            if (action.error) {
                throw action.error
            }
            return action.payload.orgs || state;
        default:
            return state;
    }
}
const Organization = combineReducers({
    orgList: getORGList,
    isLoading: getIsLoading
})

export default Organization