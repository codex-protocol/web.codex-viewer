let googleId

switch (process.env.VUE_APP_TARGET_ENV) {
  case 'production':
    googleId = process.env.VUE_APP_PRODUCTION_GA_ID
    break

  case 'staging':
    googleId = process.env.VUE_APP_STAGING_GA_ID
    break

  default:
    googleId = false
    break
}

// if there's no VUE_APP_GA_ID, just return a noop
const googleTrack = !googleId ? Function.prototype : (category, action, label, value, self) => {
  self.$ga.event(category, action, label, value)
}

export { googleTrack } // eslint-disable-line import/prefer-default-export
