import { headers, routes } from '../helper/config';
import { createAction } from '../helper/utils';
import { DEFAULT_PAGE_NUMBER, RECORDS_PER_PAGE } from '../utils/Constants';




export const START_GET_USERS = `START_GET_USERS`;
export const END_GET_USERS = `END_GET_USERS`;

export const START_ADD_USERS = `START_ADD_USERS`;
export const END_ADD_USERS = `END_ADD_USERS`;

export const START_USERS_UPDATE = `START_USERS_UPDATE`;
export const END_USERS_UPDATE = `END_USERS_UPDATE`;

export const START_REGISTER_USERS = `START_REGISTER_USERS`;
export const END_REGISTER_USERS = `END_REGISTER_USERS`;


export const START_USER_LOGIN = 'START_USER_LOGIN';
export const END_USER_LOGIN = 'END_USER_LOGIN';

export const START_DELETE_USERS = `START_DELETE_USERS`;
export const END_DELETE_USERS = `END_DELETE_USERS`;

export const START_LOADING = `START_LOADING`;
export const END_LOADING = `END_LOADING`;

export const startLoading = () => createAction(START_LOADING)
export const endLoading = () => createAction(END_LOADING)

const axios = require('axios')


export function getUserList(data) {
  return dispatch => {
    let queryParams;
    console.log("==========paginatiion------------===========", data)
    if (data) {
      data.page = data.pagination.selectedPage || DEFAULT_PAGE_NUMBER
      data.size = data.take || RECORDS_PER_PAGE
      if (data.page >= 0) {
        queryParams = `page=${data.page}`
      }
      if (data.size) {
        queryParams = `${queryParams}&size=${data.size}`
      }
    } else {
      queryParams = `page=${DEFAULT_PAGE_NUMBER}&size=${RECORDS_PER_PAGE}`

    }
    console.log("printing query params", queryParams);
    dispatch(createAction(START_GET_USERS));
    let s = headers()

    // let header = headers()
    let config = {
      method: 'get',
      url: `${routes.getUserList}?${queryParams}`,
      headers: s.headers
    };

    return axios(config)
      .then(response => {
        console.log(`Contract fetched successfully`)
        console.log("000000000000000000000000000000000000000000000000000000000000000000000000", response.data.payload)
        dispatch(createAction(END_GET_USERS, response.data.payload));
        return response.data.data
      }).catch(err => {
        dispatch(createAction(END_GET_USERS));
        console.log("Error occurred", null, err)
        return null
      })

  }
}

export function login(data) {
  return dispatch => {
    dispatch(createAction(START_USER_LOGIN));
    console.log("============routes.login==============", routes.login)
    return axios.post(routes.login, data)
      .then(resp => {
        dispatch(createAction(END_LOADING))
        if (resp && resp.data) {
          localStorage.setItem('token', resp.data.payload.access.token)
          dispatch(createAction(END_USER_LOGIN, resp.data.payload))
        }
      }).catch(err => {
        dispatch(createAction(END_LOADING))
        if (err.response) {
          console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
          dispatch(createAction(END_USER_LOGIN, null, err.response.data))
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

export function updateUserStatus(data) {
  return dispatch => {
    let url = 'http://localhost:3004/users'
    dispatch(createAction(START_USERS_UPDATE));
    dispatch(createAction(START_LOADING))
    let h = headers()
    return axios.put(`${routes.updateUserStatus}${data.id}`, data.body, h)
      .then(resp => {
        console.log("action : getting response ======================resp==================", resp)
        if (resp && resp.data) {
          dispatch(createAction(END_ADD_USERS, resp.data))
        }
      }).catch(err => {
        if (err.response) {
          console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
          dispatch(createAction(END_ADD_USERS, null, err.response.data))
          throw err.response.data.message.toString()

        } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', err.message);
        }
      }).finally(() => {
        dispatch(createAction(END_LOADING))
        dispatch(createAction(END_USERS_UPDATE));
      })
  }
}

export function addUser(data) {
  return dispatch => {
    let url = 'http://localhost:3004/users'
    dispatch(createAction(START_ADD_USERS));
    return axios.post(url, data, headers())
      .then(resp => {
        dispatch(createAction(END_LOADING))
        console.log("action : getting response ======================resp==================", resp)
        if (resp && resp.data) {
          dispatch(createAction(END_ADD_USERS, resp.data))
        }
      }).catch(err => {
        dispatch(createAction(END_LOADING))

        if (err.response) {
          console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
          dispatch(createAction(END_ADD_USERS, null, err.response.data))
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

export function registerUser(data) {
  return dispatch => {
    let url = 'http://localhost:3004/users'
    dispatch(createAction(START_REGISTER_USERS));
    return axios.post(routes.registerUser, data, headers())
      .then(resp => {
        dispatch(createAction(END_LOADING))
        console.log("action : getting response ======================resp==================", resp)
        if (resp && resp.data) {
          // dispatch(createAction(END_ADD_USERS, resp.data))
          return resp.data
        }
      }).catch(err => {
        dispatch(createAction(END_LOADING))

        if (err.response) {
          console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
          // dispatch(createAction(END_REGISTER_USERS, null, err.response.data))
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

export function deleteUser(id) {
  return dispatch => {
    let url = `http://localhost:3004/users/${id}`
    dispatch(createAction(START_DELETE_USERS));
    return axios.delete(url, headers())
      .then(resp => {
        dispatch(createAction(END_LOADING))
        console.log("action : getting response ======================resp==================", resp)
        if (resp && resp.data) {
          dispatch(createAction(END_DELETE_USERS, resp.data))
        }
      }).catch(err => {
        dispatch(createAction(END_LOADING))

        if (err.response) {
          console.log("action ======================error-------------------------------------==================", JSON.stringify(err.response))
          dispatch(createAction(END_DELETE_USERS, null, err.response.data))
          throw err.response.data.message.toString()

        } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
          throw err.request
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', err.message);
          throw err.message
        }
      })
  }
}

