// @TODO: Move all config to a common location using dotenv or some other config util.
//  Do a search for references to process.env in non-build directories to consolidate

const apiUrl = (() => {

  switch (process.env.VUE_APP_TARGET_ENV) {
    case 'production':
      return 'https://codex-registry-api-mainnet.codexprotocol.com'

    case 'staging':
      return 'http://codex-registry-api.codexprotocol-staging.com'

    default:
      return 'http://localhost:3001'
  }

})()

const etherScanUrl = (() => {
  switch (process.env.VUE_APP_TARGET_ENV) {
    case 'production':
      return 'https://etherscan.io/'

    case 'staging':
      return 'https://ropsten.etherscan.io/'

    default:
      return 'https://rinkeby.etherscan.io/'
  }
})()

export default {

  showManageTokensPage: process.env.VUE_APP_TARGET_ENV !== 'production',
  showFaucet: process.env.VUE_APP_TARGET_ENV !== 'production',
  showCreateGiveawayButton: process.env.VUE_APP_TARGET_ENV !== 'production',
  showCodexGalleryInSideBar: process.env.VUE_APP_TARGET_ENV !== 'production',

  apiUrl,
  etherScanUrl,
}
