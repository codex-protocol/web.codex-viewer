<script>
/* eslint-disable consistent-return */

import store from '../store'
import callContract from '../util/web3/callContract'
import IdProxy from '../util/api/idProxy'

export default {
  name: 'web3-helper',

  methods: {
    callContract: (contractName, functionName, args) => {
      const { recordContract } = store.state.web3
      const { user } = store.state.auth
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
    },
  },
  render: (h) => {
    return h()
  },
}
</script>
