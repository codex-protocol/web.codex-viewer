import axios from 'axios'
import debug from 'debug'

const logger = debug('app:store:app:actions')

export default {
  FETCH_VERIFIED_USERS_ADDRESS_NAME_MAP({ commit }) {
    logger('FETCH_VERIFIED_USERS_ADDRESS_NAME_MAP action being executed')

    const requestOptions = {
      url: '/verified-users',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        commit('SET_VERIFIED_USERS_ADDRESS_NAME_MAP', response.data.result)
      })
      .catch((error) => {
        logger('Error retrieving the Verified Users address map, ignoring.', error)
      })
  },
}
