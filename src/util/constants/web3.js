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
const NullDescriptionHash = `0x${new Array(64).fill(0).join('')}`

export {
  Networks,
  Web3Errors,
  ZeroAddress,
  NullDescriptionHash,
}
