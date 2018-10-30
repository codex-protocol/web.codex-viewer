export default {
  getVerifiedNameFromAddress(currentState) {
    return (address = '', includeCheckmark = false) => {

      if (!currentState.verifiedUsersAddressNameMap || !address) {
        return address
      }

      const name = currentState.verifiedUsersAddressNameMap[address.toLowerCase()]

      if (!name) {
        return address
      }

      return `${includeCheckmark ? '✅ ' : ''}${currentState.verifiedUsersAddressNameMap[address]}`

    }
  },
}
