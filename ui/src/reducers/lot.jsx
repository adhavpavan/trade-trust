import { combineReducers } from 'redux';
import * as LotActions from '../actions/lot';

const initialLOTListState = {
    docs: [],
    totalPages: 0,
    totalDocs: 0
};

function getIsLoading(state = false, action) {
    switch (action.type) {
        case LotActions.START_LOADING:
            return true;
        case LotActions.END_LOADING:
            return false;
        default:
            return state;
    }
}

function getLOTList(state = initialLOTListState, action) {
    switch (action.type) {
        case LotActions.END_GET_LOTS:
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


const Lot = combineReducers({
    lotList: getLOTList,
    isLoading: getIsLoading
});

export default Lot;
