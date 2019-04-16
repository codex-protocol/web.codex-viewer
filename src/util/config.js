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

// are fees enabled for savvy users? this will toggle certain peices of the UI
//  related to getting CODX and approving contracts
//
// simple users will always have fees enabled, since their fees are paid to
//  the IdentityPlatform by their IdentityProxy (and not directly to the
//  CodexRecord contract)
const feesEnabled = (() => {
  switch (expectedNetworkName) {
    case 'ganache': return false
    case 'ropsten': return false
    case 'rinkeby': return false
    case 'mainnet': return false
    default: return false
  }
})()

const web3Options = (() => {
  switch (expectedNetworkName) {
    case 'ganache': return { transactionConfirmationBlocks: 1 }
    case 'ropsten': return { transactionConfirmationBlocks: 1 }
    case 'rinkeby': return { transactionConfirmationBlocks: 1 }
    case 'mainnet': return { transactionConfirmationBlocks: 2 }
    default: return false
  }
})()

const targetEnv = process.env.VUE_APP_TARGET_ENV

export default {
  showManageTokensPage: false,
  faucetDripEnabled: expectedNetworkId !== '1',

  showTestApp: expectedNetworkId !== '1',
  showManualConfirm: targetEnv === 'development',
  alwaysShowAdminSettingsTab: targetEnv === 'development',

  apiUrl,
  feesEnabled,
  etherScanUrl,
  web3Options,
  expectedNetworkId,
  expectedNetworkName,
}
