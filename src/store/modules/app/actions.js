import axios from 'axios'
import debug from 'debug'

import router from '../../../router'
import Giveaway from '../../../util/api/giveaway'

const logger = debug('app:store:app:actions')

const queryParamsToHandle = {
  email: {
    mutationName: 'SET_EMAIL_ADDRESS_TO_CONFIRM',
    clearUserState: true,
  },
  pendingUserCode: {
    mutationName: 'SET_PENDING_USER_CODE',
    clearUserState: true,
  },
  destination: {
    mutationName: 'SET_POST_LOGIN_DESTINATION',
  },

  // If there's a cached authToken in localstorage this will replace it with
  //  the one from the query string
  authToken: {
    mutationName: 'auth/SET_AUTH_STATE',
    mutationConfiguration: { root: true },
  },

  // API error handling
  errorCode: {
    mutationName: 'SET_API_ERROR_CODE',
  },
  error: {
    mutationName: 'SET_API_ERROR_MESSAGE',
  },
}

export default {
  HANDLE_QUERY_PARAMS({ commit, rootState }) {
    logger('HANDLE_QUERY_PARAMS action being executed')

    const { query } = rootState.route

    Object.keys(queryParamsToHandle).forEach((key) => {
      if (query[key]) {
        const param = queryParamsToHandle[key]

        commit(param.mutationName, query[key], param.mutationConfiguration)

        if (param.clearUserState) {
          commit('auth/CLEAR_USER_STATE', null, { root: true })
        }
      }
    })

    // Strip the query string by navigating to route.path (as opposed
    //  to route.fullPath, which preserves the query string)
    router.replace({ path: rootState.route.path })
  },

  FETCH_BOOTSTRAP_DATA({ commit }) {
    logger('FETCH_BOOTSTRAP_DATA action being executed')

    const requestOptions = {
      url: '/etc/bootstrap-data',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        const bootstrapData = response.data.result
        commit('SET_GALLERIES', bootstrapData.galleries)
        commit('SET_CODX_COSTS', bootstrapData.codxCosts)
        commit('SET_EVENT_EMAILS', bootstrapData.eventEmails)
        commit('SET_VERIFIED_USERS', bootstrapData.verifiedUsers)
      })
      .catch((error) => {
        logger('Error retrieving bootstrap data:', error)
      })

  },

  FETCH_ELIGIBLE_GIVEAWAY({ commit }) {
    logger('FETCH_ELIGIBLE_GIVEAWAY action being executed')

    Giveaway.getAllEligibleGiveaways()
      .then((giveaways) => {
        // For now, just select the first giveaway that is available
        commit('SET_GIVEAWAY', giveaways[0])
      })
  },
}
