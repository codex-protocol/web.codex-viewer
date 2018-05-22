// Adding some buffer, because the estimation is not perfect when using CodexTitleProxy
// TODO: This needs to be more finely tuned. For some actions only 10k buffer is needed, and for others 50k+ is needed
const gasBuffer = 100000
const recommendedGasPriceInGwei = 5

function callContract(func, args, web3) {
  return func.estimateGas(
    ...args,
    { from: web3.account }
  ).then((estimatedGas) => {
    return func(
      ...args,
      { from: web3.account,
        gas: estimatedGas + gasBuffer,
        gasPrice: web3.instance().toWei(recommendedGasPriceInGwei, 'gwei') }
    )
  })
}

export default callContract
