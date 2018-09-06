import Web3 from 'web3'

import { ExpectedNetworkId, Web3Errors } from '../../util/constants/web3'

const registerWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Avoid race conditions with web3 injection
    window.addEventListener('load', () => {
      if (typeof window.web3 !== 'undefined') {
        resolve(new Web3(window.web3.currentProvider))
      } else {
        // @FIXME: Add env var for appropriate provider
        // Fallback to localhost if no web3 injection. We've configured this to
        // use the development console's port by default.
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
        resolve(new Web3(provider))
      }
    })
  })
    .then((web3) => {
      return web3.eth.net.getId()
        .then((networkId) => {
          const networkIdStr = String(networkId)
          if (networkIdStr !== ExpectedNetworkId) {
            throw Web3Errors.WrongNetwork
          }
          const returnValue = Object.assign({}, {
            web3,
            networkId,
          })
          return returnValue
        })
    })
    .then((state) => {
      return state.web3.eth.getAccounts()
        .then((accounts) => {
          const returnValue = Object.assign({}, state, { accounts })
          return returnValue
        })
        .catch((error) => {
          return Web3Errors.Unknown
        })
    })
}

export default registerWeb3
