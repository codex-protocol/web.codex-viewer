import Web3 from 'web3'

import config from '../../util/config'
import { Web3Errors } from '../../util/constants/web3'

const registerWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Avoid race conditions with web3 injection
    window.addEventListener('load', () => {
      if (typeof window.web3 !== 'undefined') {
        resolve({
          web3: new Web3(window.web3.currentProvider),
          hasWeb3Browser: true,
        })
      } else {
        resolve({
          web3: new Web3(process.env.VUE_APP_ETHEREUM_RPC_URL),
          hasWeb3Browser: false,
        })
      }
    })
  })
    .then(({ web3, hasWeb3Browser }) => {
      return web3.eth.net.getId()
        .then((networkId) => {
          const networkIdString = String(networkId)
          if (networkIdString !== config.expectedNetworkId) {
            throw Web3Errors.WrongNetwork
          }
          const returnValue = Object.assign({}, {
            web3,
            networkId,
            hasWeb3Browser,
          })
          // truffle-contract assumes web3@0.2.x which uses sendAsync.
          returnValue.web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send
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
