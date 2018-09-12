import callApi from './callApi'

export default {

  contractCall: (contractName, functionName, args) => {
    const requestOptions = {
      method: 'post',
      url: `/user/web3/identity-proxy/${contractName}/${functionName}`,
      data: {
        arguments: args,
      },
    }

    return callApi(requestOptions)
  },

}
