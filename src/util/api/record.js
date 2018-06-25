import callApi from './callApi'

export default {
  getUserRecords: () => {
    const requestOptions = {
      method: 'get',
      url: '/user/records',
    }

    return callApi(requestOptions)
  },

  getRecord: (recordId) => {
    const requestOptions = {
      method: 'get',
      url: `/record/${recordId}`,
    }

    return callApi(requestOptions)
  },

  createMetadata: (metadata) => {
    const requestOptions = {
      method: 'post',
      url: '/users/record-metadata',
      data: metadata,
    }

    return callApi(requestOptions)
  },

  updateRecord: (recordId, recordData) => {
    const requestOptions = {
      method: 'put',
      url: `/users/records/${recordId}`,
      data: recordData,
    }

    return callApi(requestOptions)
  },

  updateMetadata: (recordId, metadata) => {
    const requestOptions = {
      method: 'put',
      url: `/users/records/${recordId}/metadata`,

      data: metadata,
    }

    return callApi(requestOptions)
  },
}
