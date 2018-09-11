import callApi from './callApi'

const defaultGasLimit = process.env.VUE_APP_DEFAULT_GAS_LIMIT
const defaultGasPrice = process.env.VUE_APP_DEFAULT_GAS_PRICE

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
