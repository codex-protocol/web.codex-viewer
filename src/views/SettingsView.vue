<template>
  <div>
    <app-header title="Settings &amp; Privacy" />
    <div class="record-list" v-if="records.length">
      <b-container class="record-settings-row">
        <b-row>
          <b-col class="image">Image</b-col>
          <b-col class="name">Asset Name</b-col>
          <b-col class="toggle">Details Public</b-col>
        </b-row>
      </b-container>
      <record-privacy-settings-row-item v-for="record in records"
        :codex-record="record"
        :key="record.tokenId"
        :isPrivate="record.isPrivate"
      />
    </div>
    <div v-else>
      You have no Records in your collection!
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import EventBus from '../util/eventBus'
import AppHeader from '../components/AppHeader'
import RecordPrivacySettingsRowItem from '../components/RecordPrivacySettingsRowItem'

export default {
  name: 'record-list',
  components: {
    AppHeader,
    RecordPrivacySettingsRowItem,
  },
  data() {
    return {
      records: [],
    }
  },
  created() {
    EventBus.$emit('events:view-settings-page')
    this.getRecords()
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
  methods: {
    getRecords() {
      axios.get('/user/records')
        .then((response) => {
          this.records = response.data.result
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get collection: ${error.message}`)
          console.error('Could not get collection:', error)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.header
  height: 2.5rem
  font-size: 2.5rem
  margin-bottom: 2rem
  color: $color-primary

  display: flex
  align-items: center

  h1
    font-size: 1em
    font-weight: bold
    line-height: 1em
    font-family: $font-family-serif

    margin: 0 .5em 0 0
    padding-right: .5em
    border-right: 1px solid $color-primary

  .network-details
    font-size: .4em
    word-wrap: break-word

  .spacer
    flex-grow: 1

.record-list
  display: flex
  flex-wrap: wrap
  flex-direction: row
  align-items: flex-start
  justify-content: space-between

  background-color: white

.record-settings-row
  height: 3.5rem
  max-width: 100%
  font-weight: 600
  color: $color-gray
  font-size: 0.875rem

  .row
    display: flex
    height: 3.5rem
    align-items: center

  .name
    flex-grow: 5

  .toggle
    text-align: center
</style>
