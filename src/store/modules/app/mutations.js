import debug from 'debug'

const logger = debug('app:store:app:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_VERIFIED_USERS(currentState, users) {
    logMutation('SET_VERIFIED_USERS', users)

    const newAddressNameMap = {}

    users.forEach((user) => {
      if (!user.name || !user.address) return
      newAddressNameMap[user.address.toLowerCase()] = user.name
    })

    currentState.verifiedUsers = newAddressNameMap

  },

  SET_PENDING_USER_CODE(currentState, pendingUserCode) {
    logMutation('SET_PENDING_USER_CODE', pendingUserCode)

    currentState.pendingUserCode = pendingUserCode
  },

  SET_EMAIL_ADDRESS_TO_CONFIRM(currentState, emailAddress) {
    logMutation('SET_EMAIL_ADDRESS_TO_CONFIRM', emailAddress)

    currentState.emailAddressToConfirm = emailAddress
  },

  SET_API_ERROR_CODE(currentState, code) {
    logMutation('SET_API_ERROR_CODE', code)

    currentState.apiErrorCode = code
  },

  SET_API_ERROR_MESSAGE(currentState, message) {
    logMutation('SET_API_ERROR_MESSAGE', message)

    currentState.apiErrorMessage = message
  },

  SET_IS_LOADED(currentState, isLoaded) {
    logMutation('SET_IS_LOADED', isLoaded)

    currentState.isLoaded = isLoaded
  },

  SET_POST_LOGIN_DESTINATION(currentState, destination) {
    logMutation('SET_POST_LOGIN_DESTINATION', destination)

    currentState.postLoginDestination = destination
  },

  SET_GIVEAWAY(currentState, giveaway) {
    logMutation('SET_GIVEAWAY', giveaway)

    currentState.giveaway = giveaway
  },

  SET_GALLERIES(currentState, galleries = []) {
    logMutation('SET_GALLERIES', galleries)

    currentState.galleries = galleries
  },

  SET_EVENT_EMAILS(currentState, eventEmails = []) {
    logMutation('SET_EVENT_EMAILS', eventEmails)

    currentState.eventEmails = eventEmails
  },

  SET_CODX_COSTS(currentState, codxCosts = {}) {
    logMutation('SET_CODX_COSTS', codxCosts)

    currentState.codxCosts = codxCosts
  },
}
