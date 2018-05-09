import contract from 'truffle-contract'

let codexTitleJson
let tokenProxyJson

/* eslint-disable global-require */
if (process.env.TARGET_ENV === 'production') {
  // codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexTitle.json') // eslint-disable-line import/no-unresolved
  // tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/1/TokenProxy.json') // eslint-disable-line import/no-unresolved
} else if (process.env.TARGET_ENV === 'staging') {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexTitle.json')
  tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/4/TokenProxy.json')
} else {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexTitle.json')
  tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/5777/TokenProxy.json')
}
/* eslint-enable */

const getContract = (web3) => {
  return new Promise((resolve, reject) => {

    const codexTitle = contract(codexTitleJson)

    codexTitle.setProvider(web3.currentProvider)

    resolve(codexTitle.at(tokenProxyJson.address))
  })
}

export default getContract
