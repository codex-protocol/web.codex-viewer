<template>
  <div>
    <h4>Details</h4>
    <p>Current owner: {{ codexTitle.ownerAddress }}</p>
    <p>Approved owner: {{ codexTitle.approvedAddress }}</p>
    <!-- @FIXME: Hiding until we bring back Modify option
      <p>Last updated: {{ this.formatDate(codexTitle.updatedAt) }}</p>
    -->
    <h5>Metadata</h5>
    <p>Name hash: {{ codexTitle.nameHash }}</p>
    <p>Description hash: {{ codexTitle.descriptionHash }}</p>
    <p>ProviderId: {{ codexTitle.providerId }}</p>
  </div>
</template>

<script>
import { formatDate } from '../util/dateHelpers'

export default {
  name: 'title-blockchain-details',
  props: ['codexTitle'],
  methods: {
    formatDate(date) {
      return formatDate(date)
    },
  },
}
</script>
