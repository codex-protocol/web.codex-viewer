import Mixpanel from 'mixpanel'

const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN, {
  protocol: 'https',
})

const mixpanelTrack = (event, params) => {
  if (params) {
    mixpanel.track(event, params)
  } else {
    mixpanel.track(event)
  }
}

export { mixpanelTrack } // eslint-disable-line import/prefer-default-export
