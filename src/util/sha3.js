import { keccak256 } from 'js-sha3'

export default (input) => {
  return `0x${keccak256(input)}`
}
