export default {
  getOAuth2ClientNameFromAddress(currentState) {
    return (address, includeCheckmark = false) => {
      if (!currentState.clientNameMap) {
        return address
      }

      const name = currentState.clientNameMap[address]
      if (!name) {
        return address
      }

      return `${includeCheckmark ? '✅ ' : ''}${currentState.clientNameMap[address]}`
    }
  },
}
