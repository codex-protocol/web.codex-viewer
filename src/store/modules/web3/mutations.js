import debug from 'debug'

import { Web3Errors } from '../../../util/constants/web3'

const logger = debug('app:store:web3:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_WEB3(currentState, { web3, account }) {
    logMutation('SET_WEB3', web3)

    // We call Object.freeze here to prevent any errors from being thrown when
    //  Vue walks over the object's properties to make them observable
    // If a new web3 instance is ever needed, a full page refresh has to occur
    currentState.instance = Object.freeze(web3)
    currentState.providerAccount = account
    currentState.registrationError = null
  },

  // @NOTE: If MetaMask stops refreshing the page when the network changes
  //  we'll have to start polling for networkId in addition to account.
  // i.e., basically just dupe the registerWeb3 functionality into the polling mechanism.
  SET_POLL_RESULT(currentState, { account }) {
    logMutation('SET_POLL_RESULT', account)

    currentState.registrationError = Web3Errors.None
    currentState.providerAccount = account
  },

  SET_CONTRACT(currentState, { propertyName, contract }) {
    logMutation('SET_CONTRACT', propertyName)

    currentState[propertyName] = Object.freeze(contract)
  },

  SET_REGISTRATION_ERROR(currentState, error) {
    logMutation('SET_REGISTRATION_ERROR', error)

    currentState.registrationError = error

    // Reset web3 state
    currentState.instance = null
    currentState.isPolling = false
    currentState.tokenContract = null
    currentState.stakeContract = null
    currentState.recordContract = null
    currentState.providerAccount = null
  },

  SET_IS_POLLING(currentState, { isPolling }) {
    logMutation('SET_IS_POLLING')

    currentState.isPolling = isPolling
  },
}
