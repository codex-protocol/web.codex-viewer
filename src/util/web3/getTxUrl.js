import config from '../config'

const getTxUrl = txHash => `${config.etherScanUrl}tx/${txHash}`

export default getTxUrl
