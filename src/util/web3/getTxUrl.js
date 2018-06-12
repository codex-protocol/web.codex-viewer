import { etherScanUrl } from '../config'

const getTxUrl = (txHash) => {
  return `${etherScanUrl}tx/${txHash}`
}

export default getTxUrl
