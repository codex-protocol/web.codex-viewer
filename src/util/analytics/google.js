// if there's no VUE_APP_GA_ID, just return a noop
const googleTrack = !process.env.VUE_APP_GA_ID ? Function.prototype : (category, action, label, self) => {
  self.$ga.event(category, action, label)
}

export { googleTrack } // eslint-disable-line import/prefer-default-export
