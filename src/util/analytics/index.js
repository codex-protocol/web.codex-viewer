import { logTrack } from './log'
import { googleTrack } from './google'
import events from './events'

const provider = process.env.ANALYTICS_PROVIDER

const analytics = {
  track(category, action, label, self) {
    switch (provider) {
      case 'log':
        logTrack(`Event:${category}:${action}:${label}`)
        break
      case 'google':
        googleTrack(category, action, label, self)
        break
      default:
        break
    }
  },
}

events(analytics)

export default analytics
