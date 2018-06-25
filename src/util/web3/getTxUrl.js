import config from '../config'

const getTxUrl = (txHash) => {
  return `${config.etherScanUrl}tx/${txHash}`
}

export default getTxUrl
