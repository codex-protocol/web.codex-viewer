<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-5">
        <div class="logo"><b-link href="/#/"><img src="../assets/logos/codex/gold.svg" /></b-link></div>
        <h1>Codex Viewer (Beta)</h1>
        <div class="lead">Create and manage blockchain identities for your unique assets.</div>
        <div class="button-container mb-5">
          <b-button variant="primary" @click="login">Login</b-button>
          <b-button variant="outline-primary" @click="aboutCodex">About Codex</b-button>
        </div>
        <login-marketing-card v-if="showLoginMarketingCard" />
      </div>
      <div class="col-sm-7 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../util/config'
import EventBus from '../util/eventBus'

import LoginMarketingCard from '../components/LoginMarketingCard'

export default {
  name: 'home-view',
  components: {
    LoginMarketingCard,
  },
  data() {
    return {
      showLoginMarketingCard: config.showCodexQuestsMarketing,
    }
  },
  methods: {
    login() {
      EventBus.$emit('events:click-home-login')
      this.$router.push('login')
    },
    aboutCodex() {
      EventBus.$emit('events:click-about-codex')
      window.location = 'https://www.codexprotocol.com'
    },
  },
  created() {
    EventBus.$emit('events:viewer:view-home-page')
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .container
    height: 100%
    display: flex
    align-items: center

  .row
    width: 100%

  .secondary
    text-align: right
    align-self: center

  .logo
    max-width: 100px
    margin-bottom: 2.5rem
    margin-top: 2.5rem

  h1
    font-weight: bold
    font-family: $font-family-serif

  .lead
    margin-bottom: 3rem

  .btn-primary
    margin-right: 1rem

  .button-container
    display: flex
    flex-direction: row

    button
      width: 50%

  .login-art img
    width: 100%
</style>
