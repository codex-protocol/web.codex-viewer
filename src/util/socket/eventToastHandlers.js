import router from '../../router'
import EventBus from '../eventBus'
import formatCODXBalance from '../../filters/format-codx-balance'

// this is here as a wrapper / convenience method so we don't have to repeat a
//  bunch of stuff in the handlers below
const showToast = (text, route) => {
  const toastOptions = {
    text,
    type: 'info',
    timeout: 15000,
  }

  if (route) {
    toastOptions.clickHandler = (toast) => {
      router.push(route)
      toast.close()
    }
  }

  EventBus.$emit('toast', toastOptions)
}

export default {
  'codex-record:created': (codexRecord) => {
    showToast(
      `The Codex Record "${codexRecord.metadata.name}" has been successfully created.\n\nClick this notification to view the Record.`,
      `/record/${codexRecord.tokenId}`
    )
  },

  'codex-record:modified': (codexRecord) => {
    showToast(
      `The Codex Record "${codexRecord.metadata.name}" has been successfully updated.\n\nClick this notification to view the Record.`,
      `/record/${codexRecord.tokenId}`
    )
  },

  'codex-record:transferred:new-owner': (codexRecord) => {
    showToast(
      `The Codex Record "${codexRecord.metadata.name}" has been successfully transferred to you.\n\nClick this notification to view the Record.`,
      `/record/${codexRecord.tokenId}`
    )
  },

  'codex-record:transferred:old-owner': (codexRecord) => {
    showToast(`The Codex Record "${codexRecord.metadata.name}" has been successfully transferred to ${codexRecord.ownerAddress}.`)
  },

  'codex-record:destroyed': (codexRecord) => {
    showToast(`The Codex Record "${codexRecord.metadata.name}" has been successfully destroyed.`)
  },

  'codex-record:address-approved:owner': (codexRecord) => {
    showToast(
      `The Codex Record "${codexRecord.metadata.name}" has been successfully approved for transfer to ${codexRecord.approvedAddress}.\n\nClick this notification to view your outgoing transfers.`,
      '/transfers/outgoing'
    )
  },

  'codex-record:address-approved:cancel': (codexRecord) => {
    showToast(`The transfer of Codex Record "${codexRecord.metadata.name}" has been successfully cancelled.`)
  },

  'codex-record:address-approved:approved': (codexRecord) => {
    showToast(
      `You have been approved to transfer the Codex Record "${codexRecord.metadata.name}" by the address ${codexRecord.ownerAddress}.\n\nClick this notification to view your incoming transfers.`,
      '/transfers/incoming'
    )
  },

  'codex-record:address-whitelisted': (codexRecord) => {
    showToast(
      `You have been approved to view the Codex Record "${codexRecord.metadata.name}".\n\nClick this notification to view the Record.`,
      `/record/${codexRecord.tokenId}`
    )
  },

  'codex-coin:transferred': (value) => {
    showToast(`You have successfully recieved ${formatCODXBalance(value)} CODX from the faucet.`)
  },

  'codex-coin:registry-contract-approved': (value) => {
    showToast('The registry contract has been successfully approved to spend CODX on your behalf.')
  },
}
