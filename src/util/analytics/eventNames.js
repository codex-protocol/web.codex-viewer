// IMPORTANT: Do not change the values. These are used for analytics tracking and need
//  to stay consistent

const category = 'Codex Viewer'

const actionsLabels = {

  // Login
  'events:view-login-page': {
    action: 'View',
    label: 'Login Page',
  },
  'events:click-login-button': {
    action: 'Click',
    label: 'Login Button',
  },
  'events:click-install-metamask': {
    action: 'Click',
    label: 'Install Metamask',
  },
  'events:click-check-metamask': {
    action: 'Click',
    label: 'Check Metamask',
  },
  'events:login': {
    action: 'Web3',
    label: 'Login',
  },
  'events:click-logout-button': {
    action: 'Click',
    label: 'Logout Button',
  },

  // Confirmation Email
  'events:view-confirm-email-page': {
    action: 'View',
    label: 'Confirm Email Page',
  },
  'events:resend-confirmation-email-dialog': {
    action: 'Click',
    label: 'Resend Confirmation Email',
  },

  // Collection
  'events:view-collection-page': {
    action: 'View',
    label: 'Collection Page',
  },

  // Record
  'events:view-record-page': {
    action: 'View',
    label: 'Record Page',
  },
  'events:record-click-transfer': {
    action: 'Click',
    label: 'Record Transfer',
  },
  'events:record-transfer': {
    action: 'Web3',
    label: 'Record Transfer',
  },

  // Transfer
  'events:view-transfers-page': {
    action: 'View',
    label: 'Transfers Page',
  },
  'events:click-accept-transfer': {
    action: 'Click',
    label: 'Accept Transfer',
  },
  'events:accept-transfer': {
    action: 'Web3',
    label: 'Accept Transfer',
  },
  'events:click-cancel-transfer': {
    action: 'Click',
    label: 'Cancel Transfer',
  },
  'events:cancel-transfer': {
    action: 'Web3',
    label: 'Cancel Transfer',
  },

  // Settings
  'events:view-settings-page': {
    action: 'View',
    label: 'Settings Page',
  },

  // Manage Tokens
  'events:view-tokens-page': {
    action: 'View',
    label: 'Tokens Page',
  },
  'events:click-approve-contract': {
    action: 'Click',
    label: 'Approve Contract',
  },
  'events:approve-contract': {
    action: 'Web3',
    label: 'Approve Contract',
  },
  'events:faucet-request': {
    action: 'Web3',
    label: 'Faucet Request',
  },
  'events:click-stake-tokens': {
    action: 'Click',
    label: 'Stake Tokens',
  },
  'events:stake-tokens': {
    action: 'Web3',
    label: 'Stake Tokens',
  },
  'events:click-unstake-tokens': {
    action: 'Click',
    label: 'Unstake Tokens',
  },
  'events:unstake-tokens': {
    action: 'Web3',
    label: 'Unstake Tokens',
  },

  // Coming Soon
  'events:view-coming-soon-page': {
    action: 'View',
    label: 'Coming Soon Page',
  },
  'events:click-partner-link': {
    action: 'Click',
    label: 'Partner Link',
  },

  // Gallery
  'events:view-gallery-page': {
    action: 'View',
    label: 'Gallery Page',
  },

  // Faucet
  'events:view-faucet-page': {
    action: 'View',
    label: 'Faucet Page',
  },
  'events:view-codex-quests-page': {
    action: 'View',
    label: 'Codex Quests Page',
  },
}

export { category, actionsLabels }
