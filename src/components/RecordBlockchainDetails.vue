<template>
  <div>
    <h4>Details</h4>
    <p>Current owner: {{ codexRecord.ownerAddress }}</p>
    <p>Approved owner: {{ codexRecord.approvedAddress }}</p>
    <!-- @FIXME: Hiding until we bring back Modify option
      <p>Last updated: {{ this.formatDate(codexRecord.updatedAt) }}</p>
    -->
    <h5>Metadata</h5>
    <p>Name hash: {{ codexRecord.nameHash }}</p>
    <p>Description hash: {{ codexRecord.descriptionHash }}</p>
    <p>ProviderId: {{ codexRecord.providerId }}</p>
  </div>
</template>

<script>
import { formatDate } from '../util/dateHelpers'

export default {
  name: 'record-blockchain-details',
  props: ['codexRecord'],
  methods: {
    formatDate(date) {
      return formatDate(date)
    },
  },
}
</script>
