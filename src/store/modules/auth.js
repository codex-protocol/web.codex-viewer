import axios from 'axios'
import BigNumber from 'bignumber.js'

// If a token is present on page load, then add it to all future API requests
let token = window.localStorage.getItem('authToken')
if (token) {
  axios.defaults.headers.common.Authorization = token
}

const initialState = () => {
  return {
    token: token || null,
    balance: new BigNumber(0),
    totalStakedFor: new BigNumber(0),
    personalStakeAmount: new BigNumber(0),
    personalStakeFor: null,
    registryContractApproved: false,
    stakeContractApproved: false,
  }
}

const getters = {
  isAuthenticated: (currentState) => {
    return !!currentState.token
  },
}

const actions = {
  sendAuthRequest({ commit, dispatch }, payload) {
    return axios.post('auth-token', payload).then((response) => {
      const { result, error } = response.data
      if (response.data.error) {
        throw new Error(error)
      }

      dispatch('updateUserState', result.token)
    }).catch((error) => {
      console.log(error)
      commit('clearUserState')
    })
  },

  updateUserState({ commit, dispatch, rootState }, authToken) {
    const { web3 } = rootState
    const { account } = web3
    const tokenContract = web3.tokenContractInstance()
    const registryContract = web3.titleContractInstance()
    const stakeContract = web3.stakeContainerContractInstance()


    // @TODO: Need to watch the CodexCoin contract and the ERC900BasicStakeContainer contract
    //  to get events on when balances/stakes change. (We can update it on the UI optimistically
    //  but that has its own set of challenges)

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

    if (authToken) {
      commit('setAuthToken', authToken)
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

    stakeContract.getPersonalStakeAmount(account).then((amount) => {
      commit('updatePersonalStakeAmount', amount)
    })

    stakeContract.getPersonalStakeFor(account).then((stakeFor) => {
      commit('updatePersonalStakeFor', stakeFor)
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

  logout({ commit }, router) {
    commit('clearUserState')

    router.replace('/login')
  },
}

// @TODO: Only log for debug mode
const logMutation = (mutationName, payload) => {
  console.log(`${mutationName} mutation being executed`, payload)
}

const mutations = {
  setAuthToken(currentState, authToken) {
    logMutation('setAuthToken', authToken)

    currentState.token = authToken
    axios.defaults.headers.common.Authorization = authToken

    window.localStorage.setItem('authToken', authToken)
  },

  clearUserState(currentState) {
    logMutation('clearUserState')

    token = null
    delete axios.defaults.headers.common.Authorization
    window.localStorage.removeItem('authToken')

    // Reset state to its initial values
    const originalState = initialState()
    Object.keys(originalState).forEach((key) => {
      currentState[key] = originalState[key]
    })
  },

  updateTokenBalance(currentState, newBalance) {
    logMutation('updateTokenBalance', newBalance)

    currentState.balance = newBalance
  },

  updatePersonalStakeAmount(currentState, newAmount) {
    logMutation('updatePersonalStakeAmount', newAmount)

    currentState.personalStakeAmount = newAmount
  },

  updatePersonalStakeFor(currentState, newStakeFor) {
    logMutation('updatePersonalStakeFor', newStakeFor)

    currentState.personalStakeFor = newStakeFor
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
}

export default {
  state: initialState(),
  getters,
  actions,
  mutations,
}
