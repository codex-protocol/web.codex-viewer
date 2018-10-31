import Web3 from 'web3'
import debug from 'debug'
import contractsByNetwork from '@codex-protocol/ethereum-service/dist/contracts-by-network.json'

import config from '../../../util/config'
import { Web3Errors } from '../../../util/constants/web3'

const logger = debug('app:store:web3:actions')

const registerWalletProvider = () => {
  return new Promise((resolve, reject) => {
    // @TODO: Test this when the new custom build becomes stable
    if (window.ethereum) {
      window.ethereum.enable()
        .then(() => {
          resolve(new Web3(window.ethereum))
        })
        .catch((error) => {
          logger(error)

          reject(new Error(Web3Errors.UserDeniedSignature))
        })
    } else if (typeof window.web3 === 'undefined') {
      reject(new Error(Web3Errors.Missing))
    } else {
      resolve(new Web3(window.web3.currentProvider))
    }
  })
    .then((web3) => {
      return web3.eth.net.getId()
        .then((networkId) => {
          const networkIdString = String(networkId)
          if (networkIdString !== config.expectedNetworkId) {
            throw new Error(Web3Errors.WrongNetwork)
          }

          return web3.eth.getAccounts()
        })
        .then((accounts) => {
          if (!accounts.length) {
            throw new Error(Web3Errors.Locked)
          }

          return {
            web3,
            account: accounts[0],
          }
        })
    })
}

export default {
  REGISTER_INFURA_PROVIDER({ commit, dispatch }) {
    logger('REGISTER_INFURA_PROVIDER action being executed')

    commit('SET_WEB3', {
      web3: new Web3(process.env.VUE_APP_ETHEREUM_RPC_URL),
    })

    return dispatch('REGISTER_ALL_CONTRACTS')
  },

  REGISTER_WALLET_PROVIDER({ commit, dispatch, rootState }) {
    logger('REGISTER_WALLET_PROVIDER action being executed')

    return registerWalletProvider()
      .then(({ web3, account }) => {
        // If we reached this point, we know account is defined (since we would have thrown otherwise)
        if (rootState.auth.user && rootState.auth.user.address.toLowerCase() !== account.toLowerCase()) {
          throw new Error(Web3Errors.AccountChanged)
        }

        commit('SET_WEB3', {
          web3,
          account,
        })

        return dispatch('REGISTER_ALL_CONTRACTS')
      })
  },

  PROMPT_FOR_SIGNED_DATA({ state }) {
    logger('PROMPT_FOR_SIGNED_DATA action being executed')

    const personalMessageToSign = 'Please sign this message to authenticate with the Codex Registry.'
    const sendAsyncOptions = {
      method: 'personal_sign',
      params: [
        state.instance.utils.toHex(personalMessageToSign),
        state.providerAccount,
      ],
    }

    return new Promise((resolve, reject) => {
      state.instance.currentProvider.sendAsync(sendAsyncOptions, (error, result) => {
        if (error) {
          reject(new Error(Web3Errors.Unknown))
        } else if (result.error) {
          reject(new Error(Web3Errors.UserDeniedSignature))
        } else {
          resolve({
            userAddress: state.providerAccount,
            signedData: result.result.substr(2),
          })
        }
      })
    })
  },

  POLL_WEB3({ commit, dispatch, state }) {
    if (state.instance && state.isPolling) {
      registerWalletProvider()
        .then(({ account }) => {
          if (state.providerAccount !== account) {
            throw new Error(Web3Errors.AccountChanged)
          }
        })
        .catch((error) => {
          commit('SET_REGISTRATION_ERROR', {
            message: 'Error while polling',
            error,
          })

          commit('SET_IS_POLLING', {
            isPolling: false,
          })

          dispatch('auth/LOGOUT_USER', null, { root: true })
        })

      window.setTimeout(() => {
        dispatch('POLL_WEB3')
      }, 1000)
    }
  },

  REGISTER_ALL_CONTRACTS({ state, commit }) {
    const interfaces = contractsByNetwork[config.expectedNetworkId]

    const recordContract = new state.instance.eth.Contract(interfaces.CodexRecord.abi, interfaces.CodexRecord.address)
    commit('SET_CONTRACT', {
      propertyName: 'recordContract',
      contract: recordContract,
    })

    const tokenContract = new state.instance.eth.Contract(interfaces.CodexCoin.abi, interfaces.CodexCoin.address)
    commit('SET_CONTRACT', {
      propertyName: 'tokenContract',
      contract: tokenContract,
    })

    const stakeContract = new state.instance.eth.Contract(interfaces.CodexStakeContract.abi, interfaces.CodexStakeContract.address)
    commit('SET_CONTRACT', {
      propertyName: 'stakeContract',
      contract: stakeContract,
    })
  },
}
