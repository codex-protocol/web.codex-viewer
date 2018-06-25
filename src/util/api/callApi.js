import axios from 'axios'

// @TODO: This needs to be a global flag to toggle console logging
const debug = true

const callApi = (requestOptions) => {
  if (debug) {
    console.log(`Calling ${requestOptions.method} ${requestOptions.url}`)
  }

  return axios(requestOptions)
    .then((response) => {
      return response.data.result
    })
    .catch((error) => {
      console.error(`Error when calling ${requestOptions.method} ${requestOptions.url}:`, error)

      throw error
    })
}

export default callApi
