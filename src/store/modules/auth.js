import axios from 'axios'
import BigNumber from 'bignumber.js'

import User from '../../util/api/user'
import EventBus from '../../util/eventBus'
import SocketService from '../../util/socket'

// If an auth token is present on page load, then add it to all future API requests
let cachedAuthToken = window.localStorage.getItem('authToken')

if (cachedAuthToken) {
  axios.defaults.headers.common.Authorization = cachedAuthToken
}

const initialState = () => {
  return {
    user: null,
    balance: new BigNumber(0),
    authToken: cachedAuthToken,
    totalStakedFor: new BigNumber(0),
    personalStakes: [],
    registryContractApproved: false,
    stakeContractApproved: false,
    hideSetup: !!window.localStorage.getItem('hideSetup'),
  }
}

const getters = {
  isAuthenticated: (currentState) => {
    return !!currentState.authToken
  },
}

const actions = {
  sendAuthRequest({ commit, dispatch }, data) {

    const requestOptions = {
      method: 'post',
      url: '/auth-token',
      data,
    }

    return axios(requestOptions)
      .then((response) => {
        const { result } = response.data
        dispatch('updateUserState', result.token, result.user)
      })
      .catch((error) => {
        EventBus.$emit('toast:error', `Could not log in: ${error.message}`)
        console.error('Could not log in:', error)
        commit('clearUserState')
      })
  },

  updateUserState({ commit, dispatch, rootState }, newAuthToken, newUser) {

    const { web3 } = rootState
    const { account } = web3
    const tokenContract = web3.tokenContractInstance()
    const registryContract = web3.recordContractInstance()
    const stakeContract = web3.stakeContainerContractInstance()


    // @TODO: Need to watch the CodexCoin contract and the CodexStakeContainer
    //  contract to get events on when balances/stakes change. (We can update it
    //  on the UI optimistically but that has its own set of challenges)

    dispatch('getTokenBalance', {
      account,
      tokenContract,
    })

    dispatch('getStakeBalances', {
      account,
      stakeContract,
    })

    dispatch('getApprovalStatus', {
      account,
      tokenContract,
      registryContractAddress: registryContract.address,
      stakeContractAddress: stakeContract.address,
    })

    if (newAuthToken) {
      commit('setAuthToken', newAuthToken)

      if (newUser) {
        commit('setUser', newUser)

      } else {
        User.getUser()
          .then((user) => {
            commit('setUser', user)
          })
          .catch((error) => {
            commit('clearUserState')
          })
      }

    }
  },

  getTokenBalance({ commit }, payload) {
    const {
      account,
      tokenContract,
    } = payload

    tokenContract.balanceOf(account).then((balance) => {
      commit('updateTokenBalance', balance)
    })
  },

  getStakeBalances({ commit }, payload) {
    const {
      account,
      stakeContract,
    } = payload

    stakeContract.getPersonalStakes(account).then((personalStakes) => {
      commit('updatePersonalStakes', personalStakes)
    })

    stakeContract.totalStakedFor(account).then((stake) => {
      commit('updateTotalStakedFor', stake)
    })
  },

  getApprovalStatus({ commit }, payload) {
    const {
      account,
      tokenContract,
      registryContractAddress,
      stakeContractAddress,
    } = payload

    tokenContract.allowance(account, registryContractAddress).then((allowance) => {
      commit('updateApprovalStatus', {
        allowance,
        stateProperty: 'registryContractApproved',
      })
    })

    tokenContract.allowance(account, stakeContractAddress).then((allowance) => {
      commit('updateApprovalStatus', {
        allowance,
        stateProperty: 'stakeContractApproved',
      })
    })
  },

  handleFaucetRequest({ commit }, optimisticBalance) {
    commit('updateTokenBalance', optimisticBalance)
    commit('updateUser', {
      canRequestFaucetTokens: false,
      faucetLastRequestedAt: (new Date()).toISOString(),
    })
  },

  hideSetup({ commit }) {
    commit('hideSetup')
  },

  // This is currently used for handling some Metamask state changes
  //  Changing the route this navigates to will require updating how we handle
  //  the state changes.
  logout({ commit }, router) {
    commit('clearUserState')

    // if this is an unauthenticated route, clear their auth token (i.e. log
    //  the user out), but do not redirect them to the homepage
    if (router.currentRoute.meta && router.currentRoute.meta.allowUnauthenticatedUsers) {
      return
    }

    router.replace('/')
  },
}

// @TODO: Only log for debug mode
const logMutation = (mutationName, payload) => {
  console.info(`${mutationName} mutation being executed`, payload)
}

const mutations = {
  setAuthToken(currentState, newAuthToken) {
    logMutation('setAuthToken', newAuthToken)

    currentState.authToken = newAuthToken
    axios.defaults.headers.common.Authorization = newAuthToken

    SocketService.updateSocket(newAuthToken)

    window.localStorage.setItem('authToken', newAuthToken)
  },

  setUser(currentState, newUser) {
    logMutation('setUser', newUser)
    currentState.user = newUser
  },

  updateUser(currentState, newProperties) {
    logMutation('updateUser', newProperties)

    Object.assign(currentState.user, newProperties)
  },

  clearUserState(currentState) {
    logMutation('clearUserState')

    cachedAuthToken = null
    SocketService.disconnect()
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('hideSetup')
    delete axios.defaults.headers.common.Authorization

    // Reset state to its initial values
    Object.assign(currentState, initialState())
  },

  updateTokenBalance(currentState, newBalance) {
    logMutation('updateTokenBalance', newBalance)

    currentState.balance = newBalance
  },

  updatePersonalStakes(currentState, newPersonalStakes) {
    logMutation('updatePersonalStakes', newPersonalStakes)

    currentState.personalStakes = newPersonalStakes
  },

  updateTotalStakedFor(currentState, newStake) {
    logMutation('updateTotalStakedFor', newStake)

    currentState.totalStakedFor = newStake
  },

  updateApprovalStatus(currentState, payload) {
    const {
      allowance,
      stateProperty,
    } = payload

    logMutation('updateApprovalStatus', payload)

    // The approval exposed in the UI is not a binary operation, but it does
    //  approve the contract's allowance to a high value (2^255).
    // Here we check to see if it's greater than 1 token, and if so assume that
    //  approval has taken place.
    // If somehow the user has used so many tokens that their allowance is now low,
    //  they'll need to re-approve the contract for more.
    currentState[stateProperty] = allowance.greaterThan(new BigNumber('10e18'))
  },

  hideSetup(currentState) {
    logMutation('hideSetup')

    currentState.hideSetup = true

    window.localStorage.setItem('hideSetup', true)
  },
}

export default {
  state: initialState(),
  getters,
  actions,
  mutations,
}
