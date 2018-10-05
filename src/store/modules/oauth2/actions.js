import axios from 'axios'
import debug from 'debug'
import Raven from 'raven-js'

const logger = debug('app:store:oauth2:actions')

export default {
  FETCH_CLIENTS({ commit }) {
    logger('FETCH_CLIENTS action being executed')

    const requestOptions = {
      url: '/oauth2/clients',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        commit('SET_CLIENTS', {
          clients: response.data.result,
        })
      })
      .catch((error) => {
        Raven.captureException(error)
      })
  },
}
