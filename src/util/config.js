const expectedNetworkId = process.env.VUE_APP_ETHEREUM_NETWORK_ID || '5777'
const expectedNetworkName = (() => {
  switch (expectedNetworkId) {
    case '1': return 'mainnet'
    case '3': return 'ropsten'
    case '4': return 'rinkeby'
    case '5777': return 'ganache'
    default: throw new Error(`network with id ${process.env.VUE_APP_ETHEREUM_NETWORK_ID} is invalid, no network name defined in config`)
  }
})()

const apiUrl = (() => {
  switch (expectedNetworkName) {
    case 'ganache': return 'http://localhost:3001'
    case 'mainnet': return 'https://api.codexprotocol.com'
    case 'ropsten': return 'http://ropsten-api.codexprotocol.com'
    case 'rinkeby': return 'https://rinkeby-api.codexprotocol.com'
    default: return null // do nothing, as an error will be thrown above if network name is invalid
  }
})()

const etherScanUrl = (() => {
  switch (expectedNetworkName) {
    case 'mainnet': return 'https://etherscan.io'
    case 'ganache': return 'http://localhost:3001/test/etherscan'
    default: return `https://${expectedNetworkName}.etherscan.io`
  }
})()

const targetEnv = process.env.VUE_APP_TARGET_ENV
export default {
  showFaucet: false,
  showManageTokensPage: false,
  showCodexGalleryInSideBar: false,

  showManualConfirm: targetEnv === 'development',

  showTestApp: targetEnv !== 'production',
  supportEmailAccounts: expectedNetworkId !== '1',

  apiUrl,
  etherScanUrl,
  expectedNetworkId,
  expectedNetworkName,
}
