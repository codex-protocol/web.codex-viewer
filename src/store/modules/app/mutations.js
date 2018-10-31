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

  SET_API_ERROR(currentState, { code, message }) {
    logMutation('SET_API_ERROR', message)

    currentState.apiError = {
      code,
      message,
    }
  },

  SET_IS_LOADED(currentState, { isLoaded }) {
    logMutation('SET_IS_LOADED', isLoaded)

    currentState.isLoaded = isLoaded
  },
}
