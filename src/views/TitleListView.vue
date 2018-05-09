<template>
  <div>
    <app-header title="Collection">
      <b-button variant="primary" v-b-modal.createTitleModal>Add New Asset</b-button>
    </app-header>
    <b-card-group deck class="title-list" v-if="titles.length">
      <title-list-item v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
      />
    </b-card-group>
    <div v-else>
      You have no items in your collection!
    </div>
    <create-title-modal />
  </div>
</template>

<script>
import axios from 'axios'

import AppHeader from '../components/AppHeader'
import TitleListItem from '../components/TitleListItem'
import CreateTitleModal from '../components/modals/CreateTitleModal'

export default {
  name: 'title-list',
  components: {
    AppHeader,
    TitleListItem,
    CreateTitleModal,
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
    authToken() {
      return this.$store.state.auth.token
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
.title-list
  display: flex
  flex-wrap: wrap
</style>
