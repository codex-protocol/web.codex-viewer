import store from '../../store/'
import { Web3Errors } from '../../store/modules/web3'

const pollWeb3 = (router) => {
  const web3 = store.state.web3.instance

  setInterval(() => {
    if (web3) {
      web3().eth.getAccounts((error, accounts) => {
        if (error) {
          store.commit('setWeb3Error', {
            message: 'Error while polling web3',
            error: Web3Errors.Unknown,
          })
        } else if (!accounts.length) {
          store.commit('setWeb3Error', {
            message: 'MetaMask is locked',
            error: Web3Errors.Locked,
          })
        } else if (store.state.web3.account !== accounts[0]) {
          store.dispatch('logoutInPlace', router, {
            root: true,
          })

          store.dispatch('pollWeb3', {
            account: accounts[0],
          })
        }
      })
    }
  }, 1000)
}

export default pollWeb3
