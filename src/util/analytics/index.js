import debug from 'debug'

import { googleTrack } from './google'
import events from './events'

const logger = debug('app:util:analytics')
const provider = process.env.VUE_APP_ANALYTICS_PROVIDER

const analytics = {
  track(category, action, label, self) {
    switch (provider) {
      case 'log':
        logger(`Tracking the event ${category}:${action}:${label}`)
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
