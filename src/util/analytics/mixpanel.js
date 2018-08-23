import Mixpanel from 'mixpanel'

let mixpanel
let mixpanelToken

switch (process.env.VUE_APP_TARGET_ENV) {
  case 'production':
    mixpanelToken = process.env.VUE_APP_PRODUCTION_MIXPANEL_TOKEN
    break

  case 'beta':
    mixpanelToken = process.env.VUE_APP_BETA_MIXPANEL_TOKEN
    break

  case 'staging':
    mixpanelToken = process.env.VUE_APP_STAGING_MIXPANEL_TOKEN
    break

  default:
    mixpanelToken = ''
    break
}

if (mixpanelToken) {
  mixpanel = Mixpanel.init(mixpanelToken, {
    protocol: 'https',
  })
}

// if there's no token, just return a noop
const mixpanelTrack = !mixpanelToken ? Function.prototype : (event, params) => {
  if (params) {
    mixpanel.track(event, params)
  } else {
    mixpanel.track(event)
  }
}

export { mixpanelTrack } // eslint-disable-line import/prefer-default-export
