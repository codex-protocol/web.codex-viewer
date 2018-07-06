// @TODO: Move all config to a common location using dotenv or some other config util.
//  Do a search for references to process.env in non-build directories to consolidate

const apiUrl = (() => {

  switch (process.env.TARGET_ENV) {
    case 'production':
      return 'https://codex-registry-api.codexprotocol.com'

    case 'staging':
      return 'http://codex-registry-api.codexprotocol-staging.com'

    default:
      return 'http://localhost:3001'
  }

})()

const etherScanUrl = (() => {
  switch (process.env.TARGET_ENV) {
    case 'production':
      // @TODO: change back to 'https://etherscan.io/' when out of beta and on mainnet
      return 'https://rinkeby.etherscan.io/'

    case 'staging':
      return 'https://ropsten.etherscan.io/'

    default:
      return 'https://rinkeby.etherscan.io/'
  }
})()

export default {
  showManageTokensPage: process.env.TARGET_ENV === 'development',

  showCreateGiveawayButton: process.env.TARGET_ENV !== 'production',

  showCodexQuestsMarketing: true,

  // @TODO: Navigation to this page is fine for now, but don't surface it in the side bar until the feature is ready
  showCodexGalleryInSideBar: process.env.TARGET_ENV !== 'production',

  apiUrl,
  etherScanUrl,
}
