const dotenv = require('dotenv')

const dotenvResult = dotenv.config({ path: `${__dirname}/../.env` })
if (dotenvResult.error) {
  throw dotenvResult.error
}

module.exports = {
  NODE_ENV: '"production"',
  TARGET_ENV: '"staging"',
  ANALYTICS_PROVIDER: '"mixpanel"',
  MIXPANEL_TOKEN: `"${process.env.MIXPANEL_TOKEN}"`,
}
