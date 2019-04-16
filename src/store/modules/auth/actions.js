import debug from 'debug'

import router from '../../../router'
import User from '../../../util/api/user'

const logger = debug('app:store:auth:actions')

export default {

  SET_AUTH_TOKEN_AND_CLEAR_QUERY_PARAMS({ commit, dispatch }, authToken) {
    logger('SET_AUTH_TOKEN_AND_CLEAR_QUERY_PARAMS action being executed')

    commit('SET_AUTH_STATE', authToken)
    return dispatch('app/CLEAR_QUERY_PARAMS', null, { root: true })
  },

  LOGIN_FROM_EMAIL_AND_PASSWORD({ commit, dispatch }, { email, password, pendingUserCode }) {
    logger('LOGIN_FROM_EMAIL_AND_PASSWORD action being executed')

    return User.getAuthTokenFromEmailAndPassword({ email, password, pendingUserCode })
      .then((response) => {

        const { user, authToken } = response

        if (!user) {
          throw new Error('Invalid email and/or password specified.')
        }

        if (user.type !== 'savvy' && !user.isEmailConfirmed) {
          commit('app/SET_EMAIL_ADDRESS_TO_CONFIRM', user.email, { root: true })
          router.push({ name: 'confirm-email' })
          return null
        }

        // this shouldn't really ever happen, but we'll add a check for it
        //  here just to be safe...
        if (!authToken) {
          throw new Error('Invalid email and/or password specified.')
        }

        return dispatch('SET_AUTH_TOKEN_AND_CLEAR_QUERY_PARAMS', authToken)
          .then(() => {
            commit('SET_USER', { user })

            return dispatch('web3/REGISTER_INFURA_PROVIDER', null, { root: true })
              .then(() => {
                return dispatch('UPDATE_CONTRACT_STATE')
              })
          })

      })
      .catch((error) => {
        dispatch('LOGOUT_USER')
        throw error
      })

  },

  // Called from App.vue, ONLY IF there's an authToken in the query string or in local storage.
  //  This be either simple or savvy users--we find out which once we retrieve the user object
  //  from the API. If it's a simple user, we register Web3 using Infura. If it's a savvy user
  //  we attempt to register Web3 using their wallet provider. If there is no wallet provider,
  //  we kick them back to the login page with an error.
  LOGIN_FROM_CACHED_TOKEN({ commit, dispatch }) {
    logger('LOGIN_FROM_CACHED_TOKEN action being executed')

    return User.getUser()
      .then((user) => {
        commit('SET_USER', {
          user,
        })

        if (user.type !== 'savvy') {
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
            return dispatch('SET_AUTH_TOKEN_AND_CLEAR_QUERY_PARAMS', response.authToken)
              .then(() => {
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
      })
      .catch((error) => {
        dispatch('HANDLE_LOGIN_ERROR', error)
        throw error
      })
  },

  // @BUG: there's a bug here that makes 401 unauthorized errors (i.e. token
  //  expirations) show the default web3 error instead of the "api error code"
  //  message since there's no user set in that case... this error message logic
  //  is janky as fuck
  HANDLE_LOGIN_ERROR({ commit, dispatch, state }, error) {
    logger('HANDLE_LOGIN_ERROR action being executed', error)

    if (state.user && state.user.type !== 'savvy') {
      // @TODO: Right now we're just sending the entire error object
      //  Once the API has been updated to return specific error codes we can pass that along instead
      commit('app/SET_API_ERROR_CODE', error, { root: true })
    } else {
      commit('web3/SET_REGISTRATION_ERROR', error, { root: true })
    }

    dispatch('LOGOUT_USER')
  },

  UPDATE_CONTRACT_STATE({ dispatch, state }) {
    if (!state.user) {
      return null
    }

    logger('UPDATE_CONTRACT_STATE action being executed')

    return Promise.all([
      dispatch('FETCH_STAKE_BALANCES'),
      dispatch('FETCH_APPROVAL_STATUSES'),
    ])
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

  TOGGLE_EVENT_EMAIL_BLACKLIST({ commit, state }, eventEmail) {
    logger('TOGGLE_EVENT_EMAIL_BLACKLIST action being executed')

    // we can safely start by removing the email from the blacklist because:
    //  1. if it's already blacklisted, then we want to remove it as part of the
    //     toggle
    //  2. if it's NOT already blacklist, then it won't get removed by the
    //     filter here and it'll get added by the push below
    const eventEmailBlacklist = Array.from(state.user.eventEmailBlacklist)
      .filter((eventName) => {
        return eventName !== eventEmail.eventName
      })

    // if it's not already blacklisted, then blacklist it
    if (!state.user.eventEmailBlacklist.includes(eventEmail.eventName)) {
      eventEmailBlacklist.push(eventEmail.eventName)
    }

    return User.update({ eventEmailBlacklist })
      .then((user) => {
        return commit('SET_USER_PROPERTIES', {
          eventEmailBlacklist: user.eventEmailBlacklist,
        })
      })
  },

  UPDATE_REFERRAL_SURVEY({ commit, state }, { referralSurveyOptionId, details }) {
    logger('UPDATE_REFERRAL_ANSWER action being executed')

    return User.updateReferralSurvey({ referralSurveyOptionId, details })
      .then((hasAnsweredReferralSurvey) => {
        return commit('SET_USER_PROPERTIES', { hasAnsweredReferralSurvey })
      })
  },

  UPDATE_IS_ADMIN({ commit, state }, isAdmin) {

    if (process.env.VUE_APP_TARGET_ENV !== 'development') {
      return Promise.reject(new Error('ಠ_ಠ'))
    }

    logger('UPDATE_IS_ADMIN action being executed')

    return User.update({ isAdmin })
      .then((user) => {
        return commit('SET_USER_PROPERTIES', {
          isAdmin: user.isAdmin,
        })
      })
  },

  UPDATE_USER({ commit }, newUserData) {
    logger('UPDATE_USER action being executed')

    commit('SET_USER_PROPERTIES', newUserData)
  },

  HIDE_SETUP({ commit }) {
    logger('HIDE_SETUP action being executed')

    commit('SET_HIDE_SETUP')
  },

  // This is currently used for handling some Metamask state changes
  //  Changing the route this navigates to will require updating how we handle
  //  the state changes.
  LOGOUT_USER({ commit, dispatch }) {
    logger('LOGOUT_USER action being executed')

    commit('auth/RESET_STATE', null, { root: true })
    commit('records/RESET_STATE', null, { root: true })

    return dispatch('app/CLEAR_QUERY_PARAMS', null, { root: true })
      .then(() => {
        // if this is an unauthenticated route, clear their auth token (i.e. log
        //  the user out), but do not redirect them to the login page
        if (router.currentRoute.meta && router.currentRoute.meta.allowUnauthenticatedUsers) {
          return
        }

        router.replace('/')
      })

  },
}
