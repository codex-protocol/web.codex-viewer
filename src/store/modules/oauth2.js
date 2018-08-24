import axios from 'axios'
import Raven from 'raven-js'

const getInitialState = () => {
  return {
    clients: null,
    clientNameMap: null,
  }
}

const getters = {
  getOAuth2ClientNameFromAddress(currentState) {
    return (address, includeCheckmark = false) => {
      const name = currentState.clientNameMap[address]

      if (!name) {
        return address
      }

      return `${includeCheckmark ? '✅ ' : ''}${currentState.clientNameMap[address]}`

    }
  },
}

const actions = {
  updateOAuth2Clients({ commit }) {

    const requestOptions = {
      url: '/oauth2/clients',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        commit('setOAuth2Clients', response.data.result)
      })
      .catch((error) => {
        Raven.captureException(error)
      })
  },

}

const mutations = {
  setOAuth2Clients(currentState, newOAuth2Clients) {

    const newClientNameMap = {}

    newOAuth2Clients.forEach((oAuth2Client) => {
      newClientNameMap[oAuth2Client.user.address] = oAuth2Client.user.name
    })

    currentState.oAuth2Clients = newOAuth2Clients
    currentState.clientNameMap = newClientNameMap
  },
}

export default {
  getters,
  actions,
  mutations,
  state: getInitialState(),
}
