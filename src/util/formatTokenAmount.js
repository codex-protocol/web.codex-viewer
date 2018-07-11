import BigNumber from 'bignumber.js'

export default (rawAmount) => {
  return new BigNumber(rawAmount).div('1e18').toFixed(3)
}
