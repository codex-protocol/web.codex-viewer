<template>
  <div class="list-container">
    <b-container>
      <b-row class="list-header-row">
        <b-col>Send me an email when...</b-col>
      </b-row>
    </b-container>

    <b-container
      class="row-container"
      :event-email="eventEmail"
      :key="eventEmail.eventName"
      v-for="eventEmail in eventEmails"
    >
      <!-- make the whole row clickable -->
      <b-row @click.prevent="toggleBlacklist(eventEmail)">
        <b-col class="description">
          {{ eventEmail.description }}
        </b-col>
        <b-col class="toggle">
          <input
            type="checkbox"
            :disabled="isLoading"
            class="toggle-checkbox"
            :checked="!isBlacklisted(eventEmail)"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import EventBus from '../util/eventBus'

export default {
  name: 'EventEmailSettings',

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('app', ['eventEmails']),
  },

  data() {
    return {
      isLoading: false,
    }
  },

  methods: {
    isBlacklisted(eventEmail) {
      return this.user.eventEmailBlacklist.includes(eventEmail.eventName)
    },

    toggleBlacklist(eventEmail) {
      this.isLoading = true
      this.$store.dispatch('auth/TOGGLE_EVENT_EMAIL_BLACKLIST', eventEmail)
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update email subscription: ${error.message}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
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

.row-container
  max-width: 100%
  min-height: 3rem
  font-weight: 600
  color: $color-gray
  font-size: 0.875rem
  border-top: 1px solid $color-light-gray

  // since the whole row is clickable, make it appear so
  cursor: pointer

.row
  height: 100%
  display: flex
  padding: .5rem 0
  align-items: center

.description
  flex-grow: 1
  font-weight: 500

.toggle
  flex-grow: 0
  text-align: center

</style>
