<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="Settings &amp; Privacy" />
        <div class="record-list" v-if="records.length">
          <b-container class="record-settings-row">
            <b-row>
              <b-col class="image">Image</b-col>
              <b-col class="name">Asset Name</b-col>
              <b-col class="toggle" v-if="user && user.isGalleryEnabled">Include in Gallery</b-col>
              <b-col class="toggle">Details Public</b-col>
            </b-row>
          </b-container>
          <!-- TODO: Better handling of record w/ no metadata -->
          <record-privacy-settings-row-item v-for="record in records"
            v-if="record.metadata"
            :codex-record="record"
            :key="record.tokenId"
          />
        </div>
        <div v-else>
          You have no Records in your collection!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Record from '../util/api/record'
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
    // @TODO: add the same socket event handlers as the collection page here too?
    EventBus.$emit('events:view-settings-page', this)
    this.getRecords()
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    getRecords() {
      Record.getUserRecords()
        .then((records) => {
          this.records = records
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get collection: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

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
