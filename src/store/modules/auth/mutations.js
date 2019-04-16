import axios from 'axios'
import debug from 'debug'
import BigNumber from 'bignumber.js'

import getInitialState from './state'
import SocketService from '../../../util/socket'

const logger = debug('app:store:auth:mutations')
const logMutation = (mutationName, payload) => {
  logger(`${mutationName} mutation being executed`, payload)
}

export default {
  SET_AUTH_STATE(currentState, authToken) {
    logMutation('SET_AUTH_STATE', authToken)

    axios.defaults.headers.common.Authorization = authToken
    window.localStorage.setItem('authToken', authToken)

    currentState.authToken = authToken
  },

  SET_USER(currentState, { user }) {
    logMutation('SET_USER', user)

    SocketService.updateSocket(currentState.authToken)

    currentState.user = user
  },

  SET_USER_PROPERTIES(currentState, newProperties) {
    logMutation('SET_USER_PROPERTIES', newProperties)

    // https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
    currentState.user = Object.assign({}, currentState.user, newProperties)
  },

  RESET_STATE(currentState) {
    logMutation('auth/RESET_STATE')

    SocketService.disconnect()
    window.localStorage.removeItem('authToken')
    window.localStorage.removeItem('hideSetup')
    delete axios.defaults.headers.common.Authorization

    // Reset state to its initial values
    Object.assign(currentState, getInitialState())

    currentState.authToken = null
  },

  SET_PERSONAL_STAKES(currentState, { personalStakes }) {
    logMutation('SET_PERSONAL_STAKES', personalStakes)

    currentState.personalStakes = personalStakes
  },

  SET_CREDIT_BALANCE(currentState, { balance }) {
    logMutation('SET_CREDIT_BALANCE', balance)

    currentState.creditBalance = new BigNumber(balance)
  },

  SET_APPROVAL_STATUS(currentState, { allowance, stateProperty }) {
    logMutation('SET_APPROVAL_STATUS', stateProperty)

    // The approval exposed in the UI is not a binary operation, but it does
    //  approve the contract's allowance to a high value (2^255).
    // Here we check to see if it's greater than 1 token, and if so assume that
    //  approval has taken place.
    // If somehow the user has used so many tokens that their allowance is now low,
    //  they'll need to re-approve the contract for more.
    currentState[stateProperty] = new BigNumber(allowance).gt(new BigNumber('10e18'))
  },

  SET_HIDE_SETUP(currentState) {
    logMutation('HIDE_SETUP')

    currentState.hideSetup = true

    window.localStorage.setItem('hideSetup', true)
  },

  SYNC_AVAILABLE_CODX_BALANCE(currentState, availableCODXBalance) {

    logMutation('SYNC_AVAILABLE_CODX_BALANCE', availableCODXBalance)

    if (currentState.user && typeof availableCODXBalance === 'number') {
      currentState.user = Object.assign({}, currentState.user, {
        availableCODXBalance,
      })
    }
  },
}
