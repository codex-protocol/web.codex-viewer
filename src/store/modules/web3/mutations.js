import debug from 'debug'
import Raven from 'raven-js'

import { Networks, Web3Errors } from '../../../util/constants/web3'

const logger = debug('app:store:web3:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_INITIAL_STATE(currentState, { result }) {
    logMutation('SET_INITIAL_STATE', result)

    currentState.network = Networks[result.networkId]

    // We call Object.freeze here to prevent any errors from being thrown when
    //  Vue walks over the object's properties to make them observable
    // If a new web3 instance is ever needed, a full page refresh has to occur
    currentState.instance = Object.freeze(result.web3)

    if (!result.accounts.length) {
      currentState.error = Web3Errors.Locked
    } else {
      currentState.account = result.accounts[0]
      currentState.error = Web3Errors.None
    }
  },

  // @NOTE: If MetaMask stops refreshing the page when the network changes
  //  we'll have to start polling for networkId in addition to account.
  // i.e., basically just dupe the registerWeb3 functionality into the polling mechanism.
  SET_POLL_RESULT(currentState, { account }) {
    logMutation('SET_POLL_RESULT', account)

    currentState.error = Web3Errors.None
    currentState.account = account
  },

  SET_CONTRACT(currentState, { propertyName, contract }) {
    logMutation('SET_CONTRACT', propertyName)

    currentState[propertyName] = Object.freeze(contract)
  },

  SET_ERROR(currentState, { message, error, ignoreInSentry }) {
    logMutation('SET_ERROR', message, error, ignoreInSentry)

    if (!ignoreInSentry) {
      Raven.captureException(error)
    }

    currentState.error = error
    currentState.account = null
  },

  SET_IS_POLLING(currentState, { isPolling }) {
    logMutation('SET_IS_POLLING')

    currentState.isPolling = isPolling
  },
}
