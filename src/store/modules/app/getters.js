export default {
  getVerifiedNameFromAddress(currentState) {
    return (address = '', includeCheckmark = false) => {

      if (!currentState.verifiedUsers || !address) {
        return address
      }

      const name = currentState.verifiedUsers[address.toLowerCase()]

      if (!name) {
        return address
      }

      return `${includeCheckmark ? '✅ ' : ''}${currentState.verifiedUsers[address]}`

    }
  },
}
