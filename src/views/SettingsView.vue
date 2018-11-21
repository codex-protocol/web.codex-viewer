<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Settings &amp; Privacy" />
        <b-tabs>
          <b-tab title="Profile">
            <div
              v-for="(item, index) in profileProperties"
              :key="index"
            >
              {{ item.text }}: {{ item.formatter ? item.formatter(user[item.property]) : user[item.property] }}
            </div>
          </b-tab>
          <b-tab title="Collection">
            <div
              class="list-container"
              v-if="userRecords.length > 0"
            >
              <b-container>
                <b-row class="list-header-row">
                  <b-col class="image">Image</b-col>
                  <b-col class="name">Asset Name</b-col>
                  <b-col class="toggle" v-if="user && user.isGalleryEnabled">Include in Gallery</b-col>
                  <b-col class="toggle">Details Public</b-col>
                </b-row>
              </b-container>
              <RecordPrivacySettingsRowItem
                v-for="record in userRecords"
                v-if="record.metadata"
                :codex-record="record"
                :key="record.tokenId"
              />
            </div>
            <div v-else>
              You have no Codex Records in your collection!
            </div>
          </b-tab>
          <b-tab title="Email Subscriptions" v-if="user && user.email && supportEmailAccounts">
            <EventEmailSettings />
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import config from '../util/config'
import { formatDate } from '../util/dateHelpers'
import AppHeader from '../components/core/AppHeader'
import EventEmailSettings from '../components/EventEmailSettings'
import RecordPrivacySettingsRowItem from '../components/RecordPrivacySettingsRowItem'

export default {
  name: 'SettingsView',

  components: {
    AppHeader,
    EventEmailSettings,
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
          property: 'email',
          text: 'Email address',
        },
      )
    }

    return {
      profileProperties,
      supportEmailAccounts: config.supportEmailAccounts,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('records', {
      userRecords: (state) => {
        return state.lists.userRecords
      },
    }),
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.list-container
  display: flex
  flex-wrap: wrap
  flex-direction: row
  align-items: flex-start
  justify-content: space-between

  background-color: white

.list-header-row
  display: flex
  align-items: center

  max-width: 100%
  min-height: 3rem
  font-weight: 600
  color: $color-gray
  font-size: 0.875rem

  .name
    flex-grow: 5

  .toggle
    text-align: center

.tab-pane
  margin-top: 1rem
</style>
