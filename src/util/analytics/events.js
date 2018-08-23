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

  // @NOTE: Registering a new event below requires adding the event to `./eventNames.js`

  // Home
  registerEvent('events:viewer:view-home-page')
  registerEvent('events:click-home-login')
  registerEvent('events:click-about-codex')

  // Login
  registerEvent('events:viewer:view-login-page')
  registerEvent('events:click-login-button')
  registerEvent('events:click-install-metamask')
  registerEvent('events:click-check-metamask')
  registerEvent('events:login')
  registerEvent('events:click-logout-button')

  // Collection
  registerEvent('events:view-collection-page')

  // Record
  registerEvent('events:view-record-page')
  registerEvent('events:record-click-transfer')
  registerEvent('events:record-transfer')

  // Transfers
  registerEvent('events:view-transfers-page')
  registerEvent('events:click-accept-transfer')
  registerEvent('events:accept-transfer')
  registerEvent('events:click-cancel-transfer')
  registerEvent('events:cancel-transfer')

  // Settings
  registerEvent('events:view-settings-page')

  // Manage Tokens
  registerEvent('events:view-tokens-page')
  registerEvent('events:click-approve-contract')
  registerEvent('events:approve-contract')
  registerEvent('events:faucet-request')
  registerEvent('events:click-stake-tokens')
  registerEvent('events:stake-tokens')
  registerEvent('events:click-unstake-tokens')
  registerEvent('events:unstake-tokens')

  // Coming Soon
  registerEvent('events:view-coming-soon-page')
  registerEvent('events:click-partner-link')

  // Gallery
  registerEvent('events:view-gallery-page')

  // Faucet
  registerEvent('events:view-faucet-page')

  // Codex Quests
  registerEvent('events:view-codex-quests-page')

  // Unsupported Browsers/Devices
  registerEvent('events:unsupported-browser')
  registerEvent('events:unsupported-device')
}

export default events
