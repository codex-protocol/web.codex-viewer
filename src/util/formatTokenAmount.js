export default (rawAmount) => {
  return rawAmount.div('1e18').toFixed(3)
}
