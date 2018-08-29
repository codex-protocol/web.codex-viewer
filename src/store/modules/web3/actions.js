import debug from 'debug'

import { Web3Errors } from '../../../util/constants/web3'
import registerWeb3 from '../../../util/web3/registerWeb3'
import {
  getCodexRecordContract,
  getCodexCoinContract,
  getStakeContract,
} from '../../../util/web3/getContract'

const logger = debug('app:store:web3:actions')

export default {
  REGISTER({ commit, dispatch, state }, router) {
    logger('REGISTER action being executed')

    return registerWeb3()
      .then((result) => {
        commit('SET_INITIAL_STATE', { result, router })
        return dispatch('REGISTER_ALL_CONTRACTS')
      })
      .then(() => {
        if (!state.isPolling) {
          commit('SET_IS_POLLING', { isPolling: true })
          dispatch('POLL_WEB3')
        }
      })
      .catch((error) => {
        commit('SET_ERROR', {
          message: 'Unable to register',
          error,
        })
      })
  },

  REGISTER_ALL_CONTRACTS({ dispatch }) {
    return Promise.all([
      dispatch('REGISTER_CONTRACT', {
        registrationFunction: getCodexRecordContract,
        propertyName: 'recordContract',
      }),
      dispatch('REGISTER_CONTRACT', {
        registrationFunction: getCodexCoinContract,
        propertyName: 'tokenContract',
      }),
      dispatch('REGISTER_CONTRACT', {
        registrationFunction: getStakeContract,
        propertyName: 'stakeContract',
      }),
    ])
  },

  REGISTER_CONTRACT({ commit, state }, { registrationFunction, propertyName }) {
    logger('REGISTER_CONTRACT action being executed for contract', registrationFunction.name)

    return registrationFunction(state.instance.currentProvider)
      .then((contract) => {
        commit('SET_CONTRACT', {
          propertyName,
          contract,
        })
      })
      .catch((error) => {
        commit('SET_ERROR', { message: 'Unable to register the contract', error })
      })
  },

  POLL_WEB3({ commit, dispatch, state, rootGetters }) {
    if (state.instance) {
      state.instance.eth.getAccounts((error, accounts) => {
        if (error) {
          commit('SET_ERROR', {
            message: 'Error while polling',
            error: Web3Errors.Unknown,
            ignoreInSentry: true,
          })
        } else if (!accounts.length) {
          if (rootGetters['auth/isAuthenticated']) {
            dispatch('auth/LOGOUT_USER', null, { root: true })
          }

          commit('SET_ERROR', {
            message: 'MetaMask is locked',
            error: Web3Errors.Locked,
            ignoreInSentry: true,
          })
        } else if (state.account !== accounts[0]) {
          dispatch('auth/LOGOUT_USER', null, { root: true })

          commit('SET_POLL_RESULT', {
            account: accounts[0],
          })
        }
      })
    }

    window.setTimeout(() => {
      dispatch('POLL_WEB3')
    }, 1000)
  },
}
