import EventBus from '../eventBus'
import { category, actionsLabels } from './eventNames'

const events = (analytics) => {

  const registerEvent = (event) => {
    EventBus.$on(event, (self, value) => {
      analytics.track(
        category,
        actionsLabels[event].action,
        actionsLabels[event].label,
        value || '',
        self
      )
    })
  }

  Object.keys(actionsLabels).forEach((actionsLabel) => {
    console.log('actionsLabel', actionsLabel)
    registerEvent(actionsLabel)
  })

}

export default events
