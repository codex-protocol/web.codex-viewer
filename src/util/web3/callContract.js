import debug from 'debug'

import store from '../../store'

const logger = debug('app:util:call-contract')

// Adding some buffer, because the estimation is not perfect when using CodexRecordProxy
// @TODO: This needs to be more finely tuned. For some actions only 10k buffer is needed, and for others 50k+ is needed
const gasBuffer = 100000

// String or BigNumber required for `toWei`
const recommendedGasPriceInGwei = '10'

function callContract(method) {

  const {
    providerAccount,
    instance,
  } = store.state.web3

  return method.estimateGas({
    from: providerAccount,
  })
    .then((estimatedGas) => {

      logger(estimatedGas)

      return method.send({
        from: providerAccount,
        gas: estimatedGas + gasBuffer,
        gasPrice: instance.utils.toWei(recommendedGasPriceInGwei, 'gwei'),
      })
    })
    .catch((error) => {
      logger(error)
      throw error
    })
}

export default callContract
