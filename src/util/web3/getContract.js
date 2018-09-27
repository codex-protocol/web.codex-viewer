import truffleContract from 'truffle-contract'
import contractsByNetwork from '@codex-protocol/ethereum-service/dist/contracts-by-network.json'

import config from '../config'

const contracts = contractsByNetwork[config.expectedNetworkId]

if (contracts.CodexRecord && contracts.CodexRecordProxy) {
  contracts.CodexRecord.address = contracts.CodexRecordProxy.address
  delete contracts.CodexRecordProxy
}

const contractAbstractions = {
  stakeContract: null,
  codexRecord: null,
  codexCoin: null,
}

const getContract = (contractName, provider) => {
  if (!contractAbstractions[contractName]) {
    const contract = contracts[contractName]
    const contractAbstraction = truffleContract(contract)
    contractAbstraction.setProvider(provider)
    contractAbstractions[contractName] = contractAbstraction.at(contract.address)
  }

  return contractAbstractions[contractName]
}

const getCodexRecordContract = (provider) => {
  return getContract('CodexRecord', provider)
}

const getCodexCoinContract = (provider) => {
  return getContract('CodexCoin', provider)
}

const getStakeContract = (provider) => {
  return getContract('CodexStakeContract', provider)
}

export {
  getCodexRecordContract,
  getCodexCoinContract,
  getStakeContract,
}
