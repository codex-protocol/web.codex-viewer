import callApi from './callApi'

// @TODO: use config values
const defaultGasLimit = 300000
const defaultGasPrice = 21000000000 // 21 gwei

export default {

  contractCall: (contractName, functionName, args, gasPrice = defaultGasPrice, gasLimit = defaultGasLimit) => {
    const requestOptions = {
      method: 'post',
      url: `/user/web3/identity-proxy/${contractName}/${functionName}`,
      data: {
        gasPrice,
        gasLimit,
        arguments: args,
      },
    }

    return callApi(requestOptions)
  },

}
