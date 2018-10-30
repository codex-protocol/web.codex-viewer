import axios from 'axios'
import BigNumber from 'bignumber.js'

// If an auth token is present on page load, then add it to all future API requests
const cachedAuthToken = window.localStorage.getItem('authToken')

if (cachedAuthToken) {
  axios.defaults.headers.common.Authorization = cachedAuthToken
}

if (process.env.VUE_APP_FRESHCHAT_API_TOKEN && window.fcWidget) {
  window.fcWidget.init({
    token: process.env.VUE_APP_FRESHCHAT_API_TOKEN,
    host: 'https://wchat.freshchat.com',
  })
}


export default () => {
  return {
    user: null,
    balance: new BigNumber(0),
    authToken: cachedAuthToken,
    creditBalance: new BigNumber(0),
    personalStakes: [],
    registryContractApproved: false,
    stakeContractApproved: false,
    hideSetup: !!window.localStorage.getItem('hideSetup'),
  }
}
