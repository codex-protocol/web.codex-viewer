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
})
