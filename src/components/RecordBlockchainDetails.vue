<template>
  <div>
    <h4>Details</h4>
    <p>Current owner: <hash-formatter :data="codexRecord.ownerAddress" /></p>
    <p>Approved owner: <hash-formatter :data="codexRecord.approvedAddress" /></p>
    <!-- @FIXME: Hiding until we bring back Modify option
      <p>Last updated: {{ this.formatDate(codexRecord.updatedAt) }}</p>
    -->
    <h5>Metadata</h5>
    <p>Name hash: <hash-formatter :data="codexRecord.nameHash" /></p>
    <p>Description hash: <hash-formatter :data="codexRecord.descriptionHash" /></p>
    <p>ProviderId:
      {{ codexRecord.providerId }}
    </p>
  </div>
</template>

<script>
import HashFormatter from './HashFormatter'
import { formatDate } from '../util/dateHelpers'

export default {
  name: 'record-blockchain-details',
  props: ['codexRecord'],
  components: {
    HashFormatter,
  },
  methods: {
    formatDate(date) {
      return formatDate(date)
    },
  },
}
</script>
