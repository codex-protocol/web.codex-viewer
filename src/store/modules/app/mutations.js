import debug from 'debug'

const logger = debug('app:store:app:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_CONFIRM_EMAIL_ADDRESS(currentState, emailAddress) {
    logMutation('SET_CONFIRM_EMAIL_ADDRESS', emailAddress)

    currentState.confirmEmailAddress = emailAddress
  },
}
