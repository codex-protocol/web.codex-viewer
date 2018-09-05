<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo">
          <b-link href="/" replace>
            <img src="../assets/logos/codex/gold.svg" />
          </b-link>
        </div>
        <h1>Codex Viewer</h1>
        <div class="lead">Create and manage blockchain identities for your unique assets.</div>
        <div class="mb-5">
          <b-button variant="primary" @click="login">Get Started</b-button>
          <b-button variant="outline-primary" @click="aboutCodex">About Codex</b-button>
        </div>
        <login-marketing-card v-if="showLoginMarketingCard" />
      </div>
      <div class="col-12 col-md-6 secondary">
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
      EventBus.$emit('events:click-home-login', this)
      this.$router.push({ name: 'login' })
    },
    aboutCodex() {
      EventBus.$emit('events:click-about-codex', this)
      window.location = 'https://www.codexprotocol.com'
    },
  },
  created() {
    EventBus.$emit('events:viewer:view-home-page', this)
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .container
    height: 100%
    display: flex
    align-items: center

  .primary
    margin-bottom: 2rem

    @media screen and (min-width: $breakpoint-md)
      margin-bottom: 0

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

  .btn
    margin-bottom: 1rem

    @media screen and (min-width: $breakpoint-md)
      margin-bottom: 0

  .login-art img
    width: 100%
    margin-top: 3rem

    @media screen and (max-width: $breakpoint-md)
      margin-top: 0

</style>
