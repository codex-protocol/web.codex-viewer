export default {
  isAuthenticated: (currentState) => {
    return !!currentState.authToken
  },
  isSimpleUser: (currentState) => {
    return currentState.user && currentState.user.type === 'simple'
  },
}
