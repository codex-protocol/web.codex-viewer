<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Settings &amp; Privacy" />
        <b-tabs>
          <b-tab title="Profile">
            <div>
              <div
                v-for="(item, index) in profileProperties"
                :key="index"
              >
                {{ item.text }}: {{ item.formatter ? item.formatter(user[item.property]) : user[item.property] }}
              </div>
            </div>
          </b-tab>
          <b-tab title="Collection">
            <div
              class="record-list"
              v-if="recordList.length"
            >
              <b-container class="record-settings-row">
                <b-row>
                  <b-col class="image">Image</b-col>
                  <b-col class="name">Asset Name</b-col>
                  <b-col class="toggle" v-if="user && user.isGalleryEnabled">Include in Gallery</b-col>
                  <b-col class="toggle">Details Public</b-col>
                </b-row>
              </b-container>
              <RecordPrivacySettingsRowItem
                v-for="record in recordList"
                :codex-record="record"
                :key="record.tokenId"
              />
            </div>
            <div v-else>
              You have no Codex Records in your collection!
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import config from '../util/config'
import Record from '../util/api/record'
import EventBus from '../util/eventBus'
import { formatDate } from '../util/dateHelpers'
import AppHeader from '../components/core/AppHeader'
import RecordPrivacySettingsRowItem from '../components/RecordPrivacySettingsRowItem'

export default {
  name: 'SettingsView',

  components: {
    AppHeader,
    RecordPrivacySettingsRowItem,
  },

  data() {
    const profileProperties = [
      {
        property: 'createdAt',
        text: 'Created at',
        formatter: formatDate,
      },

      {
        property: 'address',
        text: 'Ethereum address',
      },
    ]

    if (config.supportEmailAccounts) {
      profileProperties.push(
        {
          property: 'gasAllowanceLastResetAt',
          text: 'Last allowance reset',
          formatter: formatDate,
        },
        {
          property: 'gasAllowanceRemaining',
          text: 'Remaining gas',
        },
        {
          property: 'gasAllowance',
          text: 'Prepaid gas per month',
        },
        {
          property: 'email',
          text: 'Email address',
        },
      )
    }

    return {
      profileProperties,
      records: [],
    }
  },

  created() {
    // @TODO: add the same socket event handlers as the collection page here too?
    this.getRecords()
  },

  computed: {
    ...mapState('auth', ['user']),

    recordList() {
      return this.records.filter((record) => {
        return !!record.metadata
      })
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

.tab-pane > div
  margin-top: 1rem
</style>
