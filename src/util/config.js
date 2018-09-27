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
    case 'mainnet': return 'https://codex-registry-api.codexprotocol.com'
    case 'rinkeby': return 'https://rinkeby-codex-registry-api.codexprotocol.com'
    case 'ropsten': return 'http://ropsten-codex-registry-api.codexprotocol.com'
    case 'ganache': return 'http://localhost:3001'
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

export default {

  showFaucet: process.env.VUE_APP_TARGET_ENV !== 'production',
  showManageTokensPage: process.env.VUE_APP_TARGET_ENV !== 'production',
  showTestAppInSideBar: process.env.VUE_APP_TARGET_ENV !== 'production',
  showCreateGiveawayButton: process.env.VUE_APP_TARGET_ENV !== 'production',
  showCodexGalleryInSideBar: process.env.VUE_APP_TARGET_ENV !== 'production',

  apiUrl,
  etherScanUrl,
  expectedNetworkId,
  expectedNetworkName,
}
