import { headers, routes } from '../helper/config';
import { createAction } from '../helper/utils';
import Api from '../utils/Api';

export const START_GET_LOTS = `START_GET_LOTS`;
export const END_GET_LOTS = `END_GET_LOTS`;

export const START_UPLOAD_CSV = `START_UPLOAD_CSV`;
export const END_UPLOAD_CSV = `END_UPLOAD_CSV`;

export const START_ADD_LOTS = `START_ADD_LOTS`;
export const END_ADD_LOTS = `END_ADD_LOTS`;

export const START_DELETE_LOTS = `START_DELETE_LOTS`;
export const END_DELETE_LOTS = `END_DELETE_LOTS`;

export const START_LOADING = `START_LOADING`;
export const END_LOADING = `END_LOADING`;

export const startLoading = () => createAction(START_LOADING)
export const endLoading = () => createAction(END_LOADING)

export function getLotList(data) {
    return async dispatch => {
        dispatch(createAction(START_GET_LOTS));
        try {
            const { pagination, size } = data;
            const response = await Api.get(`/v1/lots?page=${pagination}&size=${size}`,
                headers());
            console.log(`lots fetched successfully`);
           
            console.log("1010101010101010101010", response.data.payload);
           

            dispatch(createAction(END_GET_LOTS, response.data.payload));


            return response.data.payload;
        } catch (err) {
            dispatch(createAction(END_GET_LOTS));
            console.log("Error occurred", null, err);
            return null;
        }

    }
}


export function uplodCSV(data) {
    return dispatch => {

        dispatch(createAction(START_UPLOAD_CSV));
        return Api.post(`/v1/lots`, data, headers())
            .then(resp => {
                dispatch(createAction(END_LOADING))
                console.log("action : getting response Upload csv ======================resp==================", resp)
                if (resp && resp.data) {
                    dispatch(createAction(END_UPLOAD_CSV, resp.data))
                }
            }).catch(err => {
                dispatch(createAction(END_LOADING))

                if (err.response) {
                    console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
                    dispatch(createAction(END_UPLOAD_CSV, null, err.response.data))
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


// export function addLOTStream(data) {
//     return dispatch => {
//         dispatch(createAction(START_ADD_STREAM));
//         ///organizations/streams
//         return Api.post(`/organizations/streams`, data, headers())
//             .then(resp => {
//                 dispatch(createAction(END_LOADING))
//                 console.log("action : getting response ======================resp==================", resp)
//                 if (resp && resp.data) {
//                     dispatch(createAction(END_ADD_STREAM, resp.data))
//                 }
//             }).catch(err => {
//                 dispatch(createAction(END_LOADING))

//                 if (err.response) {
//                     console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
//                     dispatch(createAction(END_ADD_STREAM, null, err.response.data))
//                     throw err.response.data.message.toString()

//                 } else if (err.request) {
//                     // The request was made but no response was received
//                     console.log(err.request);
//                 } else {
//                     // Something happened in setting up the request that triggered an Error
//                     console.log('Error', err.message);
//                 }
//             })
//     }

// }