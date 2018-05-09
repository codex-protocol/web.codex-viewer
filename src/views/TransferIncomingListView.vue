<template>
  <div>
    <app-header title="Transfers" />
    <div class="sub-heading">
      <span class="active">Incoming</span>
      <!--
        // @TODO: Add at a later point.
        <span><b-link to="/transfers/outgoing">Outgoing</b-link></span>
        <span><b-link to="/transfers/completed">Completed</b-link></span>
      -->
    </div>
    <b-card-group deck class="title-list" v-if="titles.length">
      <title-transfer-list-item v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
      />
    </b-card-group>
    <div v-else>
      You have no incoming transfers.
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import AppHeader from '../components/AppHeader'
import TitleTransferListItem from '../components/TitleTransferListItem'

export default {
  name: 'title-list',
  components: {
    AppHeader,
    TitleTransferListItem,
  },
  data() {
    return {
      titles: [],
      columnNames: ['Preview', 'Piece title', 'Created at'],
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
      axios.get('/user/transfers/incoming?include=metadata').then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error fetching incoming transfers', error)
        } else {
          this.titles = result
        }
      }).catch((error) => {
        console.log('there was an error fetching incoming transfers', error)
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

.sub-heading
  font-weight: 300
  margin-bottom: 1rem

  span
    display: inline-block
    padding: 0 .25rem

  .active
    color: $color-secondary-accent
    font-weight: 600
    border-bottom: 3px solid $color-secondary-accent

h1, h2
  display: inline

.title-list
  display: flex
  flex-wrap: wrap

</style>
