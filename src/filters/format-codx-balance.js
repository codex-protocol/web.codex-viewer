import Vue from 'vue'
import BigNumber from 'bignumber.js'

export default Vue.filter('formatCODXBalance', (value, numDecimals = 3, showCODXLabel = true) => {

  const reducedValue = new BigNumber(value || 0).div('1e18')
  const fixedValue = reducedValue.toFixed(numDecimals)

  // only show the toFixed() value if it's not all zeros after the decimal
  const codxAmount = /\.0*$/.test(fixedValue)
    ? reducedValue.toString()
    : fixedValue

  return showCODXLabel
    ? `${codxAmount} CODX`
    : codxAmount

})
