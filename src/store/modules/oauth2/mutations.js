import debug from 'debug'

const logger = debug('app:store:oauth2:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_CLIENTS(currentState, { clients }) {
    logMutation('SET_CLIENTS', clients)

    const newClientNameMap = {}

    clients.forEach((oAuth2Client) => {
      newClientNameMap[oAuth2Client.user.address] = oAuth2Client.user.name
    })

    currentState.oAuth2Clients = clients
    currentState.clientNameMap = newClientNameMap
  },
}
