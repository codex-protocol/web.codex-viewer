<template>
  <div>
    <app-header title="Settings &amp; Privacy" />
    <div class="title-list" v-if="titles.length">
      <b-container class="title-settings-row">
        <b-row>
          <b-col class="image">Image</b-col>
          <b-col class="name">Asset Name</b-col>
          <b-col class="toggle">Details Public</b-col>
        </b-row>
      </b-container>
      <title-privacy-settings-row-item v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
        :isPrivate="title.isPrivate"
      />
    </div>
    <div v-else>
      You have no items in your collection!
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import AppHeader from '../components/AppHeader'
import TitlePrivacySettingsRowItem from '../components/TitlePrivacySettingsRowItem'

export default {
  name: 'title-list',
  components: {
    AppHeader,
    TitlePrivacySettingsRowItem,
  },
  data() {
    return {
      titles: [],
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
  methods: {
    fetchData() {
      axios.get('/user/titles?include=metadata').then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error calling getTitles', error)
        } else {
          this.titles = result
        }
      }).catch((error) => {
        console.log('there was an error calling getTitles', error)
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
    word-break: break-word

  .spacer
    flex-grow: 1

.title-list
  display: flex
  flex-wrap: wrap
  flex-direction: row
  align-items: flex-start
  justify-content: space-between

  background-color: white

.title-settings-row
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
