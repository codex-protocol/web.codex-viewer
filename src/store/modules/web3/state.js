import { Web3Errors } from '../../../util/constants/web3'

export default () => {
  return {
    instance: null,
    network: null,
    account: null,
    error: Web3Errors.None,
    recordContract: null,
    tokenContract: null,
    stakeContract: null,
    isPolling: false,
  }
}
