// if there's no VUE_APP_GOOGLE_ANALYTICS_ID, just return a noop
const googleTrack = !process.env.VUE_APP_GOOGLE_ANALYTICS_ID ? Function.prototype : (category, action, label, value, self) => {
  self.$ga.event(category, action, label, value)
}

export { googleTrack } // eslint-disable-line import/prefer-default-export
