import { logTrack } from './log'
import { mixpanelTrack } from './mixpanel'
import events from './events'

const provider = process.env.ANALYTICS_PROVIDER

const analytics = {
  track(event, params) {
    switch (provider) {
      case 'log':
        logTrack(event, params)
        break
      case 'mixpanel':
        mixpanelTrack(event, params)
        break
      default:
        break
    }
  },
}

events(analytics)

export default analytics
