import { keccak256 } from 'js-sha3' // eslint-disable-line camelcase

export default (input) => {
  return `0x${keccak256(input)}`
}
