import contract from 'truffle-contract'

/* eslint-disable global-require, import/no-unresolved, import/no-dynamic-require */

// @NOTE: trying to import this from src/util/constants/web3.js doesn't seem to
//  work with the dynamic imports (probably a conflict in how webpack is
//  ordering the imports or something), so we'll just duplicate that logic here
const expectedNetworkId = (() => {
  switch (process.env.TARGET_ENV) {
    case 'production': return '4' // @TODO: change back to '1' when out of beta and on mainnet
    case 'staging': return '3'
    default: return '5777'
  }
})()

const codexCoinJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexCoin.json`)
const codexRecordJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexRecord.json`)
const codexRecordProxyJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexRecordProxy.json`)
// const stakeContainerJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexStakeContainer.json`)

/* eslint-enable global-require, import/no-unresolved, import/no-dynamic-require */

const contracts = {
  codexRecord: null,
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

const getCodexRecordContract = (web3) => {
  return getContract(
    'codexRecord',
    codexRecordJson,
    codexRecordProxyJson.address,
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

// const getStakeContainerContract = (web3) => {
//   return getContract(
//     'stakeContainer',
//     stakeContainerJson,
//     stakeContainerJson.address,
//     web3.currentProvider
//   )
// }

export {
  getCodexRecordContract,
  getCodexCoinContract,
  // getStakeContainerContract,
}
