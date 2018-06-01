import contract from 'truffle-contract'

let codexTitleJson
let codexTitleProxyJson
let codexCoinJson
let stakeContainerJson

/* eslint-disable global-require */
if (process.env.TARGET_ENV === 'production') {
  // codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexTitle.json') // eslint-disable-line import/no-unresolved
  // codexTitleProxyJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexTitleProxy.json') // eslint-disable-line import/no-unresolved
  // codexCoinJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexCoin.json') // eslint-disable-line import/no-unresolved
} else if (process.env.TARGET_ENV === 'staging') {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexTitle.json')
  codexTitleProxyJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexTitleProxy.json')
  codexCoinJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexCoin.json')
  // stakeContainerJson = require('@codex-protocol/ethereum-service/static/contracts/4/ERC900BasicStakeContainer.json')
} else {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexTitle.json')
  codexTitleProxyJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexTitleProxy.json')
  codexCoinJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexCoin.json')
  stakeContainerJson = require('@codex-protocol/ethereum-service/static/contracts/5777/ERC900BasicStakeContainer.json')
}
/* eslint-enable */

const contracts = {
  codexTitle: null,
  codexCoin: null,
  stakeContainer: null,
}

const getContract = (contractProperty, json, address, provider) => {
  if (!contracts[contractProperty]) {
    const contractAbstraction = contract(json)
    contractAbstraction.setProvider(provider)
    contracts[contractProperty] = contractAbstraction.at(address)
  }

  return contracts[contractProperty]
}

const getCodexTitleContract = (web3) => {
  return getContract(
    'codexTitle',
    codexTitleJson,
    codexTitleProxyJson.address,
    web3.currentProvider
  )
}

const getCodexCoinContract = (web3) => {
  return getContract(
    'codexCoin',
    codexCoinJson,
    codexCoinJson.address,
    web3.currentProvider
  )
}

const getStakeContainerContract = (web3) => {
  return getContract(
    'stakeContainer',
    stakeContainerJson,
    stakeContainerJson.address,
    web3.currentProvider
  )
}

export {
  getCodexTitleContract,
  getCodexCoinContract,
  getStakeContainerContract,
}
