import callApi from './callApi'

export default {
  getUser: () => {
    const requestOptions = {
      method: 'get',
      url: '/user',
    }

    return callApi(requestOptions)
  },
}
