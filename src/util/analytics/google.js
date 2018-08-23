// if there's no GA_ID, just return a noop
const googleTrack = !process.env.GA_ID ? Function.prototype : (category, action, label, self) => {
  self.$ga.event(category, action, label)
}

export { googleTrack } // eslint-disable-line import/prefer-default-export
