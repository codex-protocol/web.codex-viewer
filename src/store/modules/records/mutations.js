import Vue from 'vue'
import debug from 'debug'

import getInitialState from './state'

const logger = debug('app:store:records:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {

  RESET_STATE(currentState) {
    logMutation('records/RESET_STATE')
    Object.assign(currentState, getInitialState())
  },

  SET_RECORDS(currentState, { listName, records }) {
    logMutation('SET_RECORDS', listName, records)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    currentState.lists[listName] = records.filter((record) => {
      return !!record.metadata
    })
  },

  ADD_RECORD_TO_LIST(currentState, { listName, record }) {
    logMutation('ADD_RECORD_TO_LIST', listName, record)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    if (!record.metadata) {
      return
    }

    const exists = currentState.lists[listName].find((existingRecord) => {
      return existingRecord.tokenId === record.tokenId
    })

    if (!exists) {
      currentState.lists[listName].push(record)
    }
  },

  REMOVE_RECORD_FROM_LIST(currentState, { listName, record }) {
    logMutation('REMOVE_RECORD_FROM_LIST', listName, record)

    currentState.lists[listName] = currentState.lists[listName].filter((codexRecord) => {
      return codexRecord.tokenId !== record.tokenId
    })
  },

  SET_ACTIVE_RECORD(currentState, record) {
    logMutation('SET_ACTIVE_RECORD_INDEX', record)

    currentState.activeRecord = record
  },

  SET_SELECTED_RECORD_TO_TRANSFER(currentState, { codexRecord, callback }) {
    logMutation('SET_SELECTED_RECORD_TO_TRANSFER', codexRecord)

    currentState.selectedRecordToTransfer = codexRecord
    currentState.onTransferCallback = callback
  },

  UPDATE_RECORD_IN_LISTS(currentState, record) {
    logMutation('UPDATE_RECORD_IN_LISTS', record)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    if (!record.metadata) {
      return
    }

    // Update the record in each list that we've cached
    Object.keys(currentState.lists).forEach((listName) => {
      const listRecords = currentState.lists[listName]
      const index = listRecords.findIndex((listRecord) => {
        return listRecord.tokenId === record.tokenId
      })

      if (index !== -1) {
        Vue.set(listRecords, index, record)
      }
    })

    // Also update the active record if it's what the user is currently looking at
    if (currentState.activeRecord && currentState.activeRecord.tokenId === record.tokenId) {
      currentState.activeRecord = record
    }
  },
}
