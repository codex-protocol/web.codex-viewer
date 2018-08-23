import contract from 'truffle-contract'

/* eslint-disable global-require, import/no-unresolved, import/no-dynamic-require */

// @NOTE: trying to import this from src/util/constants/web3.js doesn't seem to
//  work with the dynamic imports (probably a conflict in how webpack is
//  ordering the imports or something), so we'll just duplicate that logic here
const expectedNetworkId = (() => {
  switch (process.env.VUE_APP_TARGET_ENV) {
    case 'production': return '1'
    case 'staging': return '3'
    default: return '5777'
  }
})()

const codexCoinJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexCoin.json`)
const codexRecordJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexRecord.json`)
const codexRecordProxyJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexRecordProxy.json`)
const stakeContractJson = require(`@codex-protocol/ethereum-service/static/contracts/${expectedNetworkId}/CodexStakeContract.json`)

/* eslint-enable global-require, import/no-unresolved, import/no-dynamic-require */

const contracts = {
  codexRecord: null,
  codexCoin: null,
  stakeContract: null,
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

const getStakeContract = (web3) => {
  return getContract(
    'stakeContract',
    stakeContractJson,
    stakeContractJson.address,
    web3.currentProvider
  )
}

export {
  getCodexRecordContract,
  getCodexCoinContract,
  getStakeContract,
}
