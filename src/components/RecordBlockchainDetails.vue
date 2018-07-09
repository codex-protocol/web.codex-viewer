<template>
  <div>
    <h4>Details</h4>
    <p>Current owner:
      <span class="address-short">{{ formatData(codexRecord.ownerAddress, true) }}</span>
      <span class="address-large">{{ formatData(codexRecord.ownerAddress, false) }}</span>
    </p>
    <p>Approved owner:
      <span class="address-short">{{ formatData(codexRecord.approvedAddress, true) }}</span>
      <span class="address-large">{{ formatData(codexRecord.approvedAddress, false) }}</span>
    </p>
    <!-- @FIXME: Hiding until we bring back Modify option
      <p>Last updated: {{ this.formatDate(codexRecord.updatedAt) }}</p>
    -->
    <h5>Metadata</h5>
    <p>Name hash:
      <span class="address-short">{{ formatData(codexRecord.nameHash, true) }}</span>
      <span class="address-large">{{ formatData(codexRecord.nameHash, false) }}</span>
    </p>
    <p>Description hash:
      <span class="address-short">{{ formatData(codexRecord.descriptionHash, true) }}</span>
      <span class="address-large">{{ formatData(codexRecord.descriptionHash, false) }}</span>
    </p>
    <p>ProviderId:
      {{ codexRecord.providerId }}
    </p>
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
    // @TODO: de-duplicate this from formatAddress() in RecordProvenance.vue
    formatData(data, isShort = false) {
      if (!data) {
        return null
      }
      let formattedData = data
      if (isShort) {
        const beginning = data.substring(0, 6)
        const end = data.substring(data.length - 4)
        formattedData = `${beginning}…${end}`
      }
      return formattedData
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.address-short

  @media screen and (min-width: $breakpoint-xl)
    display: none

.address-large
  display: none

  @media screen and (min-width: $breakpoint-xl)
    display: inline-block

</style>
