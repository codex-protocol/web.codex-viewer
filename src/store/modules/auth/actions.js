import debug from 'debug'

import router from '../../../router'
import User from '../../../util/api/user'

const logger = debug('app:store:auth:actions')

export default {
  // Called from App.vue, ONLY IF there's an authToken in the query string or in local storage.
  //  This be either simple or savvy users--we find out which once we retrieve the user object
  //  from the API. If it's a simple user, we register Web3 using Infura. If it's a savvy user
  //  we attempt to register Web3 using their wallet provider. If there is no wallet provider,
  //  we kick them back to the login page with an error.
  LOGIN_FROM_CACHED_TOKEN({ commit, dispatch, state }, authToken) {
    logger('LOGIN_FROM_CACHED_TOKEN action being executed')

    commit('SET_AUTH_STATE', {
      authToken,
    })

    return User.getUser()
      .then((user) => {
        commit('SET_USER', {
          user,
        })

        if (user.type === 'simple') {
          return dispatch('web3/REGISTER_INFURA_PROVIDER', null, { root: true })
        }

        return dispatch('web3/REGISTER_WALLET_PROVIDER', null, { root: true })
          .then(() => {
            commit('web3/SET_IS_POLLING', {
              isPolling: true,
            }, {
              root: true,
            })

            // No need to block on the promise resolution of polling
            dispatch('web3/POLL_WEB3', null, { root: true })
          })
      })
      .then(() => {
        return dispatch('UPDATE_CONTRACT_STATE')
      })
      .catch((error) => {
        dispatch('HANDLE_LOGIN_ERROR', error)
        throw error
      })
  },

  // Called from Login.vue.
  //  This is where savvy users sign a string prompted to them by their wallet, proving that
  //  they own a particular Ethereum address. This registers Web3 using the user's wallet provider.
  //  Then, it prompts the user to sign a string to prove they own the Ethereum address they are
  //  trying to authenticate with.
  LOGIN_FROM_SIGNED_DATA({ commit, dispatch }) {
    logger('LOGIN_FROM_SIGNED_DATA action being executed')

    return dispatch('web3/REGISTER_WALLET_PROVIDER', null, { root: true })
      .then(() => {
        return dispatch('web3/PROMPT_FOR_SIGNED_DATA', null, { root: true })
      })
      .then(({ userAddress, signedData }) => {
        return User.getAuthTokenFromSignedData({
          userAddress,
          signedData,
        })
          .then((response) => {
            commit('SET_AUTH_STATE', {
              authToken: response.token,
            })

            commit('SET_USER', {
              user: response.user,
            })

            commit('web3/SET_IS_POLLING', {
              isPolling: true,
            }, {
              root: true,
            })

            // No need to block on the promise resolution of polling
            dispatch('web3/POLL_WEB3', null, { root: true })

            return dispatch('UPDATE_CONTRACT_STATE')
          })
      })
      .catch((error) => {
        dispatch('HANDLE_LOGIN_ERROR', error)
        throw error
      })
  },

  HANDLE_LOGIN_ERROR({ commit, dispatch, state }, error) {
    logger('HANDLE_LOGIN_ERROR action being executed')

    if (state.user && state.user.type === 'simple') {
      commit('app/SET_API_ERROR', error, { root: true })
    } else {
      commit('web3/SET_REGISTRATION_ERROR', {
        message: 'Error while registering Web3',
        error,
      }, {
        root: true,
      })
    }

    dispatch('LOGOUT_USER')
  },

  UPDATE_CONTRACT_STATE({ dispatch, state }) {
    if (!state.user) {
      return null
    }

    logger('UPDATE_CONTRACT_STATE action being executed')

    return Promise.all([
      dispatch('FETCH_TOKEN_BALANCE'),
      dispatch('FETCH_STAKE_BALANCES'),
      dispatch('FETCH_APPROVAL_STATUSES'),
    ])
  },

  FETCH_TOKEN_BALANCE({ commit, rootState, state }) {
    logger('FETCH_TOKEN_BALANCE action being executed')

    const { tokenContract } = rootState.web3
    const { address } = state.user

    return tokenContract.methods.balanceOf(address)
      .call()
      .then((balance) => {
        commit('SET_TOKEN_BALANCE', { balance })
      })
  },

  FETCH_STAKE_BALANCES({ commit, rootState, state }) {
    logger('FETCH_STAKE_BALANCES action being executed')

    const { stakeContract } = rootState.web3
    const { address } = state.user

    return Promise.all([
      stakeContract.methods.getPersonalStakes(address)
        .call()
        .then((personalStakes) => {
          commit('SET_PERSONAL_STAKES', { personalStakes })
        }),
      stakeContract.methods.creditBalanceOf(address)
        .call()
        .then((balance) => {
          commit('SET_CREDIT_BALANCE', { balance })
        }),
    ])
  },

  FETCH_APPROVAL_STATUSES({ commit, rootState }) {
    logger('FETCH_APPROVAL_STATUSES action being executed')

    const {
      recordContract,
      tokenContract,
      stakeContract,
    } = rootState.web3
    const { address } = rootState.auth.user

    return Promise.all([
      tokenContract.methods.allowance(address, recordContract.address)
        .call()
        .then((allowance) => {
          commit('SET_APPROVAL_STATUS', {
            allowance,
            stateProperty: 'registryContractApproved',
          })
        }),
      tokenContract.methods.allowance(address, stakeContract.address)
        .call()
        .then((allowance) => {
          commit('SET_APPROVAL_STATUS', {
            allowance,
            stateProperty: 'stakeContractApproved',
          })
        }),
    ])
  },

  HIDE_SETUP({ commit }) {
    logger('HIDE_SETUP action being executed')

    commit('SET_HIDE_SETUP')
  },

  // This is currently used for handling some Metamask state changes
  //  Changing the route this navigates to will require updating how we handle
  //  the state changes.
  LOGOUT_USER({ commit }) {
    logger('LOGOUT_USER action being executed')

    commit('CLEAR_USER_STATE')

    // if this is an unauthenticated route, clear their auth token (i.e. log
    //  the user out), but do not redirect them to the login page
    if (router.currentRoute.meta && router.currentRoute.meta.allowUnauthenticatedUsers) {
      return
    }

    router.replace('/')
  },
}
