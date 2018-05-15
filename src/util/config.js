// TODO: Move to a common config location

const apiUrl = (() => {

  switch (process.env.TARGET_ENV) {
    case 'production':
      return 'https://codex-title-api.codexprotocol.com'

    case 'staging':
      return 'http://codex-title-api.codexprotocol-staging.com'

    default:
      return 'http://localhost:3001'
  }

})()

// this is the message that will be signed by MetaMask and checked against when
//  authenticating users
const typedDataToSign = [
  {
    type: 'string',
    name: 'Sign In',
    value: 'Sign in to Codex Title Viewer',
  },
]

export default {
  apiUrl,
  typedDataToSign,
}
