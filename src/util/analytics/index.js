import debug from 'debug'

import { googleTrack } from './google'
import events from './events'

const logger = debug('app:util:analytics')
const provider = process.env.VUE_APP_ANALYTICS_PROVIDER

const analytics = {
  track(category, action, label, value, self) {
    switch (provider) {
      case 'log':
        logger(`Tracking the event ${category}:${action}:${label}:${value}`)
        break
      case 'google':
        logger(`Sending Google the event: ${category}:${action}:${label}:${value}`)
        googleTrack(category, action, label, value, self)
        break
      default:
        break
    }
  },
}

events(analytics)

export default analytics
