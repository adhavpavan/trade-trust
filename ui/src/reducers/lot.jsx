import { combineReducers } from 'redux';
import * as LotActions from "../actions/lot";

const initialLotListState = {
    docs: [],
    totalPages: 0,
    totalDocs: 0
};
const initialCSVDataState = {
    vendor: '',
    deadlineDate: Date,
    orderingDate: Date,
    agreementType: '',
    product: '',
    qty: 0,
    price: '',
    confirmQty: 0,
    tax: 0,
    unitOfMeasure: '',
    shipperReference: '',

    //from request body
    exporterId: '',
    bankId: '',
    wholesalerId: '',
    transporterId: '',

    //for internal use only
    docType: '',
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

function getLotList(state = initialLotListState, action) {

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



function getCSVData(state = initialCSVDataState, action) {
    switch (action.type) {
        case LotActions.END_UPLOAD_CSV:
            if (action.error) {
                // Handle error state
                return state;
            }
            return {
                ...state,
                vendor: action.payload.vendor,
                deadlineDate: action.payload.deadlineDate,
                orderingDate: action.payload.orderingDate,
                agreementType: action.payload.agreementType,
                product: action.payload.product,
                qty: action.payload.qty,
                price: action.payload.price,
                confirmQty: action.payload.confirmQty,
                tax: action.payload.tax,
                unitOfMeasure: action.payload.unitOfMeasure,
                shipperReference: action.payload.shipperReference,

                //from request body
                exporterId: action.payload.exporterId,
                bankId: action.payload.bankId,
                wholesalerId: action.payload.wholesalerId,
                transporterId: action.payload.transporterId,

                //for internal use only
                docType: action.payload.docType,
            };
        default:
            return state;
    }
}



const LotData = combineReducers({
    lotList: getLotList,
    csvData: getCSVData,
    isLoading: getIsLoading
});

export default LotData;
