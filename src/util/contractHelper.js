import callContract from './web3/callContract'
import IdProxy from './api/identityProxy'

// eslint-disable-next-line consistent-return
const contractHelper = ((contractName, functionName, args, currentState) => {
  const { recordContract } = currentState.web3
  const { user } = currentState.auth
  switch (user.type) {
    case 'simple':
      return IdProxy.contractCall(contractName, functionName, args)
    case 'savvy':
      if (contractName === 'CodexRecord') {
        return callContract(recordContract[functionName], args)
      }
      break
    default:
      break
  }
})

export default contractHelper
