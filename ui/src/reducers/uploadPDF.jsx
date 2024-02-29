import { combineReducers } from 'redux';
import * as PDFActions from '../actions/uploadPDF';


const initialInvoiceDataState = {
    title: '',
    invoice: '',
};

const initialBillDataState = {
    shipperReference: '',
    carrierReference: '',
};
const initialProofDataState = {
    id: '',
};

function uplodInvoice(state = initialInvoiceDataState, action) {
    switch (action.type) {
        case PDFActions.END_UPLOAD_INVOICE:
            if (action.error) {
                // Handle error state
                return state;
            }
            return {
                ...state,
                title: action.payload.title,
                invoice: action.payload.invoice
            };
        default:
            return state;
    }
}

function getIsLoading(state = false, action) {
    switch (action.type) {
        case PDFActions.START_LOADING:
            return true;
        case PDFActions.END_LOADING:
            return false;
        default:
            return state;
    }
}

function uplodBill(state = initialBillDataState, action) {
    switch (action.type) {
        case PDFActions.END_UPLOAD_BILL:
            if (action.error) {
                // Handle error state
                return state;
            }
            return {
                ...state,
                shipperReference: action.payload.shipperReference,
                carrierReference: action.payload.carrierReference,
            };
        default:
            return state;
    }
}

function uplodDeliveryProof(state = initialProofDataState, action) {
    switch (action.type) {
        case PDFActions.END_UPLOAD_PROOF:
            if (action.error) {
                // Handle error state
                return state;
            }
            return {
                ...state,
                id: action.payload.id
            };
        default:
            return state;
    }
}


const PDFData = combineReducers({
    invoiceData: uplodInvoice,
    billData: uplodBill,
    proofData: uplodDeliveryProof,
    isLoading: getIsLoading
});

export default PDFData;
