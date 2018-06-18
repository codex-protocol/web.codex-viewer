<template>
  <div>
    <h1>Provenance</h1>
    <div v-if="provenance">
      <div class="flex mb-4 pb-1" v-for="row in provenance" :key="row.id">
        <div>{{ getEventDescription(row.type) }}</div>
        <div>{{ getEventAddress(row) }}</div>
        <div>{{ getTimeSince(row.createdAt) }}</div>
        <div class="action-buttons">
          <span v-if="row.type === 'modified' && row.codexRecordModifiedEvent.changedData">
            <b-button
              variant="link"
              class="show-modified-details"
              @click="showModifiedDetailsModal(row)"
            >
              <img src="../assets/icons/info.svg">
            </b-button>
          </span>
          <a :href="getTransactionUrl(row.transactionHash)" target="_blank">
            <img src="../assets/icons/share.svg">
          </a>
        </div>
      </div>
    </div>
    <div v-else>
      <p>You must be logged in to view provenance.</p>
    </div>
    <b-modal
      ok-only
      id="modifiedDetailsModal"
      title="Modification Details"
      v-model="modifiedDetailsModalVisible"
    >
      <div class="modified-details" v-if="modifiedDetails !== null">
        <!--
          @TODO: this layout could use a little love, bootstrap-vue's tables are
           kind of awful...

          @TODO: if the user is the owner or an approved viewer, show them the
           "details" for this view (i.e. show oldName vs newName if
           changedData.name === true) this may be overkill though.
        -->
        <b-table :items="modifiedDetails" outlined></b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { timeSince } from '../util/dateHelpers'
import getTxUrl from '../util/web3/getTxUrl'

export default {
  name: 'record-provenance',
  props: ['provenance'],
  data() {
    return {
      modifiedDetails: null,
      modifiedDetailsModalVisible: false,
    }
  },
  methods: {
    getTimeSince(createdAt) {
      return `${timeSince(new Date(createdAt))} ago`
    },
    // @NOTE: on 2018-06-15 all provenance event types were made past-tense to
    //  be consistent, since some were present-tense and some were past-tense
    //
    // @TODO: remove the "present-tense" versions of these events when mainnet
    //  launch happens (or when staging / beta DBs have thier records updated
    //  to use the past tense versions)
    getEventDescription(eventType) {
      switch (eventType) {
        case 'created':
          return 'Created by'

        case 'destroyed':
          return 'Destroyed by'

        case 'transferred':
          return 'Transferred to'

        case 'modified':
          return 'Modified by'

        default:
          return null
      }
    },
    getEventAddress(row) {
      switch (row.type) {
        case 'transferred':
          return row.newOwnerAddress

        case 'modified':
          return row.codexRecordModifiedEvent.modifierAddress

        default:
          return null
      }
    },
    getTransactionUrl(txHash) {
      return getTxUrl(txHash)
    },
    showModifiedDetailsModal(row) {
      this.modifiedDetailsModalVisible = true
      this.modifiedDetails = Object.keys(row.codexRecordModifiedEvent.changedData).map((fieldName) => {
        return {
          fieldName,
          changed: row.codexRecordModifiedEvent.changedData[fieldName] ? 'yes' : 'no',
        }
      })
    },
  },
}
</script>

<style lang="stylus" scoped>

.flex
  display: flex
  border-bottom: solid 1px rgba(white, .1)

.flex div
  flex: 1
  text-align: center

  &:nth-child(2)
    flex: 3

.show-modified-details
  padding: 0

.modified-details
  .table
    background-color: rgba(white, .1)

    &.border
      border: 1px solid rgba(white, .25) !important

</style>
