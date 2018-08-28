import callApi from './callApi'

const defaultGasLimit = 300000
const defaultGasPrice = 21000000000 // 21 gwei

export default {

  contractCall: (contractName, methodName, args, gasPrice = defaultGasPrice, gasLimit = defaultGasLimit) => {
    const requestOptions = {
      method: 'post',
      url: `/user/web3/identity-proxy/${contractName}/${methodName}`,
      data: {
        gasPrice,
        gasLimit,
        arguments: args,
      },
    }

    return callApi(requestOptions)
  },

}
