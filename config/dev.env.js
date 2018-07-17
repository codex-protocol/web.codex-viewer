const merge = require('webpack-merge')
const dotenv = require('dotenv')
const prodEnv = require('./prod.env')

const dotenvResult = dotenv.config({ path: `${__dirname}/../.env` })

if (dotenvResult.error) {
  throw dotenvResult.error
}

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  TARGET_ENV: '"development"',
  ANALYTICS_PROVIDER: '"log"',
  FRESHCHAT_API_TOKEN: `"${process.env.FRESHCHAT_API_TOKEN || ''}"`,
  MIXPANEL_TOKEN: `"${process.env.DEVELOPMENT_MIXPANEL_TOKEN || ''}"`,
  METADATA_PROVIDER_ID: `"${process.env.METADATA_PROVIDER_ID || ''}"`,
})
