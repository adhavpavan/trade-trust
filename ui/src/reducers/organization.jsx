import { combineReducers } from 'redux';
import * as OrganizationActions from '../actions/organization';

const initialORGListState = {
    docs: [],
    totalPages: 0,
    totalDocs: 0
};

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
            if (action.error) {
                // Handle error state
                return state;
            }
            return {
                ...state,
                docs: action.payload.docs ?? [],
                totalPages: action.payload.totalPages,
                totalDocs: action.payload.totalDocs
            };
        default:
            return state;
    }
}

const Organization = combineReducers({
    orgList: getORGList,
    isLoading: getIsLoading
});

export default Organization;
