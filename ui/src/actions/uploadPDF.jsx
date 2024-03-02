import { headers, routes } from '../helper/config';
import { createAction } from '../helper/utils';
import Api from '../utils/Api';
import { DEFAULT_PAGE_NUMBER, RECORDS_PER_PAGE } from '../utils/Constants';

export const START_UPLOAD_BILL = `START_UPLOAD_BILL`;
export const END_UPLOAD_BILL = `END_UPLOAD_BILL`;

export const START_UPLOAD_INVOICE = `START_UPLOAD_INVOICE`;
export const END_UPLOAD_INVOICE = `END_UPLOAD_INVOICE`;

export const START_UPLOAD_PROOF = `START_UPLOAD_PROOF`;
export const END_UPLOAD_PROOF = `END_UPLOAD_PROOF`;

export const START_ADD_LOTS = `START_ADD_LOTS`;
export const END_ADD_LOTS = `END_ADD_LOTS`;

export const START_LOADING = `START_LOADING`;
export const END_LOADING = `END_LOADING`;


// export const START_ADD_STREAM = `START_ADD_STREAM`;
// export const END_ADD_STREAM = `END_ADD_STREAM`;

export const startLoading = () => createAction(START_LOADING)
export const endLoading = () => createAction(END_LOADING)



export function uploadBill(data) {
    return async dispatch => {

        dispatch(createAction(START_UPLOAD_BILL));
        return Api.post(`/v1/pdf/extract/house_bill`, data, headers())
            .then(resp => {
                dispatch(createAction(END_LOADING))
                console.log("action : getting response Upload csv ======================resp==================", resp)
                if (resp && resp.data) {
                    dispatch(createAction(END_UPLOAD_BILL, resp.data))
                }
            }).catch(err => {
                dispatch(createAction(END_LOADING))

                if (err.response) {
                    console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
                    dispatch(createAction(END_UPLOAD_BILL, null, err.response.data))
                    throw err.response.data.message.toString()

                } else if (err.request) {
                    // The request was made but no response was received
                    console.log(err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', err.message);
                }
            })
    }
}


export function uploadInvoice(data) {
    return async dispatch => {

        dispatch(createAction(START_UPLOAD_INVOICE));
        return Api.post(`/v1/pdf/extract/invoice`, data, headers())
            .then(resp => {
                dispatch(createAction(END_LOADING))
                console.log("action : getting response Upload csv ======================resp==================", resp)
                if (resp && resp.data) {
                    dispatch(createAction(END_UPLOAD_INVOICE, resp.data))
                }
            }).catch(err => {
                dispatch(createAction(END_LOADING))

                if (err.response) {
                    console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
                    dispatch(createAction(END_UPLOAD_INVOICE, null, err.response.data))
                    throw err.response.data.message.toString()

                } else if (err.request) {
                    // The request was made but no response was received
                    console.log(err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', err.message);
                }
            })
    }
}


export function uploadDeliveryProof(data) {
    return async dispatch => {

        dispatch(createAction(START_UPLOAD_PROOF));
        return Api.post(`/v1/pdf/extract/delivery_proof`, data, headers())
            .then(resp => {
                dispatch(createAction(END_LOADING))
                console.log("action : getting response Upload csv ======================resp==================", resp)
                if (resp && resp.data) {
                    dispatch(createAction(END_UPLOAD_PROOF, resp.data))
                }
            }).catch(err => {
                dispatch(createAction(END_LOADING))

                if (err.response) {
                    console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
                    dispatch(createAction(END_UPLOAD_PROOF, null, err.response.data))
                    throw err.response.data.message.toString()

                } else if (err.request) {
                    // The request was made but no response was received
                    console.log(err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', err.message);
                }
            })
    }
}