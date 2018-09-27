import config from '../config'

export default {
  getTxUrl: (txHash) => {
    return `${config.etherScanUrl}/tx/${txHash}`
  },
  getAddressUrl: (address) => {
    return `${config.etherScanUrl}/address/${address}`
  },
}
