// eslint-disable-next-line import/no-mutable-exports
let ExpectedNetworkId

// @NOTE: if you change the ExpectedNetworkId values here, be sure to update
//  src/util/web3/getContract.js as well
if (process.env.TARGET_ENV === 'production') {
  ExpectedNetworkId = '4' // @TODO: change back to '1' when out of beta and on mainnet
} else if (process.env.TARGET_ENV === 'staging') {
  ExpectedNetworkId = '4'
} else {
  ExpectedNetworkId = '5777'
}

const Networks = {
  1: 'Main Net',
  2: 'Deprecated Morden test network',
  3: 'Ropsten test network',
  4: 'Rinkeby test network',
  42: 'Kovan test network',
  4447: 'Truffle Develop Network',
  5777: 'Ganache Blockchain',
}

const Web3Errors = {
  None: 0,
  Missing: 1,
  Locked: 2,
  Unknown: 3,
  WrongNetwork: 4,
}

const ZeroAddress = '0x0000000000000000000000000000000000000000'

export {
  ExpectedNetworkId,
  Networks,
  Web3Errors,
  ZeroAddress,
}
