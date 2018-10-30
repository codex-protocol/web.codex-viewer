import debug from 'debug'

const logger = debug('app:store:app:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_VERIFIED_USERS_ADDRESS_NAME_MAP(currentState, users) {
    logMutation('SET_VERIFIED_USERS_ADDRESS_NAME_MAP', users)

    const newAddressNameMap = {}

    users.forEach((user) => {
      if (!user.name || !user.address) return
      newAddressNameMap[user.address.toLowerCase()] = user.name
    })

    currentState.verifiedUsersAddressNameMap = newAddressNameMap

  },

  SET_CONFIRM_EMAIL_ADDRESS(currentState, emailAddress) {
    logMutation('SET_CONFIRM_EMAIL_ADDRESS', emailAddress)

    currentState.confirmEmailAddress = emailAddress
  },
}
