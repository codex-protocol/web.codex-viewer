import axios from 'axios'
import BigNumber from 'bignumber.js'

// If an auth token is present on page load, then add it to all future API requests
const cachedAuthToken = window.localStorage.getItem('authToken')

if (cachedAuthToken) {
  axios.defaults.headers.common.Authorization = cachedAuthToken
}

export default () => {
  return {
    user: null,
    authToken: cachedAuthToken,
    creditBalance: new BigNumber(0),
    personalStakes: [],
    registryContractApproved: false,
    stakeContractApproved: false,
    hideSetup: !!window.localStorage.getItem('hideSetup'),
  }
}
