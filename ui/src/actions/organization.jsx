import { headers, routes } from '../helper/config';
import { createAction } from '../helper/utils';
import Api from '../utils/Api';
import { DEFAULT_PAGE_NUMBER, RECORDS_PER_PAGE } from '../utils/Constants';

export const START_GET_ORGS = `START_GET_ORGS`;
export const END_GET_ORGS = `END_GET_ORGS`;

export const START_ADD_ORGS = `START_ADD_ORGS`;
export const END_ADD_ORGS = `END_ADD_ORGS`;

export const START_DELETE_ORGS = `START_DELETE_ORGS`;
export const END_DELETE_ORGS = `END_DELETE_ORGS`;

export const START_LOADING = `START_LOADING`;
export const END_LOADING = `END_LOADING`;


export const START_ADD_STREAM = `START_ADD_STREAM`;
export const END_ADD_STREAM = `END_ADD_STREAM`;

export const startLoading = () => createAction(START_LOADING)
export const endLoading = () => createAction(END_LOADING)

export function getORGList(data) {
    return dispatch => {
        dispatch(createAction(START_GET_ORGS));
        return Api.get(`/organizations`, headers())
            .then(response => {
                console.log(`Orgs fetched successfully`)
                console.log("000000000000000000000000000000000000000000000000000000000000000000000000", response.data.payload)
                dispatch(createAction(END_GET_ORGS, response.data.payload));
                return response.data.data
            }).catch(err => {
                dispatch(createAction(END_GET_ORGS));
                console.log("Error occurred", null, err)
                return null
            })

    }
}

export function addORG(data) {
    return dispatch => {

        dispatch(createAction(START_ADD_ORGS));
        return Api.post(`/organizations`, data, headers())
            .then(resp => {
                dispatch(createAction(END_LOADING))
                console.log("action : getting response ======================resp==================", resp)
                if (resp && resp.data) {
                    dispatch(createAction(END_ADD_ORGS, resp.data))
                }
            }).catch(err => {
                dispatch(createAction(END_LOADING))

                if (err.response) {
                    console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
                    dispatch(createAction(END_ADD_ORGS, null, err.response.data))
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

export function addORGStream(data) {
    return dispatch => {
        dispatch(createAction(START_ADD_STREAM));
        ///organizations/streams
        return Api.post(`/organizations/streams`, data, headers())
            .then(resp => {
                dispatch(createAction(END_LOADING))
                console.log("action : getting response ======================resp==================", resp)
                if (resp && resp.data) {
                    dispatch(createAction(END_ADD_STREAM, resp.data))
                }
            }).catch(err => {
                dispatch(createAction(END_LOADING))

                if (err.response) {
                    console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
                    dispatch(createAction(END_ADD_STREAM, null, err.response.data))
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