import { Networks, Web3Errors } from '../../util/constants/web3'
import registerWeb3 from '../../util/web3/registerWeb3'
import pollWeb3 from '../../util/web3/pollWeb3'
import {
  getCodexRecordContract,
  getCodexCoinContract,
  // getStakeContainerContract,
} from '../../util/web3/getContract'

const state = {
  instance: null,
  network: null,
  account: null,
  error: Web3Errors.None,
  recordContractInstance: null,
  tokenContractInstance: null,
  // stakeContainerContractInstance: null,
}

const getters = {
}

const actions = {
  registerWeb3({ commit, dispatch }, router) {
    console.info('registerWeb3 action being executed')

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
          // dispatch('registerContract', {
          //   web3,
          //   registrationFunction: getStakeContainerContract,
          //   propertyName: 'stakeContainerContractInstance',
          // }),
        ])

      })
      .catch((error) => {
        commit('setWeb3Error', { message: 'Unable to register web3', error })
      })
  },

  pollWeb3({ commit }, payload) {
    console.info('pollWeb3 action being executed')
    commit('pollWeb3Instance', payload)
  },

  registerContract({ commit }, payload) {
    const {
      web3,
      registrationFunction,
      propertyName,
    } = payload

    console.info('registerContract action being executed for contract', registrationFunction.name)

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
  registerWeb3Instance(currentState, payload) {
    const { result, router } = payload
    console.info('registerWeb3instance mutation being executed', result)

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
    console.info('pollWeb3Instance mutation being executed', payload)

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

    console.info('registerContractInstance mutation being executed for contract', propertyName)

    currentState[propertyName] = () => {
      return contractInstance
    }
  },

  setWeb3Error(currentState, payload) {
    const { message, error } = payload

    console.error(message, error)

    currentState.error = error
    currentState.account = null
  },
}

export { Web3Errors }

export default {
  state,
  getters,
  actions,
  mutations,
}
