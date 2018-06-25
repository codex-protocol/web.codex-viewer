import callApi from './callApi'

export default {
  getDripFromFaucet: () => {
    const requestOptions = {
      method: 'get',
      url: '/user/faucet',
    }

    return callApi(requestOptions)
  },
}
