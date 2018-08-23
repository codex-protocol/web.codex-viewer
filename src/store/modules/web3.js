import debug from 'debug'
import Raven from 'raven-js'

import { Networks, Web3Errors } from '../../util/constants/web3'
import registerWeb3 from '../../util/web3/registerWeb3'
import pollWeb3 from '../../util/web3/pollWeb3'
import {
  getCodexRecordContract,
  getCodexCoinContract,
  getStakeContract,
} from '../../util/web3/getContract'

const logger = debug('app:store:web3')

const getInitialState = () => {
  return {
    instance: null,
    network: null,
    account: null,
    isLoaded: false,
    error: Web3Errors.None,
    recordContractInstance: null,
    tokenContractInstance: null,
    stakeContractInstance: null,
  }
}

const getters = {
}

const actions = {
  registerWeb3({ commit, dispatch, state }, router) {

    // prevent web3 & contracts from being loaded multiple times, since this is
    //  really just a bootstrapping method
    if (state.isLoaded) {
      return null
    }

    logger('registerWeb3 action being executed')

    return registerWeb3()
      .then((result) => {
        commit('registerWeb3Instance', { result, router })

        const web3 = result.web3()

        return Promise.all([
          dispatch('registerContract', {
            web3,
            registrationFunction: getCodexRecordContract,
            propertyName: 'recordContractInstance',
          }),
          dispatch('registerContract', {
            web3,
            registrationFunction: getCodexCoinContract,
            propertyName: 'tokenContractInstance',
          }),
          dispatch('registerContract', {
            web3,
            registrationFunction: getStakeContract,
            propertyName: 'stakeContractInstance',
          }),
        ])

      })
      .then(() => {
        commit('setIsLoaded', true)
      })
      .catch((error) => {
        commit('setWeb3Error', { message: 'Unable to register web3', error })
      })
  },

  pollWeb3({ commit }, payload) {
    logger('pollWeb3 action being executed')
    commit('pollWeb3Instance', payload)
  },

  registerContract({ commit }, payload) {
    const {
      web3,
      registrationFunction,
      propertyName,
    } = payload

    logger('registerContract action being executed for contract', registrationFunction.name)

    return registrationFunction(web3)
      .then((result) => {
        commit('registerContractInstance', {
          propertyName,
          contractInstance: result,
        })
      })
      .catch((error) => {
        commit('setWeb3Error', { message: 'Unable to register the contract', error })
      })
  },
}

const mutations = {
  setIsLoaded(currentState, newIsLoaded) {
    currentState.isLoaded = newIsLoaded
  },
  registerWeb3Instance(currentState, payload) {
    const { result, router } = payload
    logger('registerWeb3instance mutation being executed', result)

    currentState.network = Networks[result.networkId]
    currentState.instance = result.web3

    if (!result.accounts.length) {
      currentState.error = Web3Errors.Locked
    } else {
      currentState.account = result.accounts[0]
      currentState.error = Web3Errors.None
    }

    pollWeb3(router)
  },

  pollWeb3Instance(currentState, payload) {
    logger('pollWeb3Instance mutation being executed', payload)

    // @NOTE: We don't change the network here because changing the network
    //  in MetaMask triggers a full page reload so registerWeb3Instance will
    //  fire again.

    currentState.error = Web3Errors.None
    currentState.account = payload.account
  },

  registerContractInstance(currentState, payload) {
    const {
      propertyName,
      contractInstance,
    } = payload

    logger('registerContractInstance mutation being executed for contract', propertyName)

    currentState[propertyName] = () => {
      return contractInstance
    }
  },

  setWeb3Error(currentState, payload) {
    const { message, error } = payload

    logger(message, error)
    Raven.captureException(error)

    currentState.error = error
    currentState.account = null
  },
}

export { Web3Errors }

export default {
  getters,
  actions,
  mutations,
  state: getInitialState(),
}
