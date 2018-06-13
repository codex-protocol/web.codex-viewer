<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-7">
        <div class="logo"><b-link href="/#/"><img src="../assets/logos/codex/gold.svg" /></b-link></div>
        <h1>Codex Viewer</h1>
        <div class="lead">Decentralized application for viewing The Codex Registry</div>
        <b-button variant="primary" @click="login">Login</b-button>
        <b-button variant="outline-primary" @click="aboutCodex">About Codex</b-button>
      </div>
      <div class="col-sm-5 secondary">
        <div class="bust"><img src="../assets/images/bust.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'

export default {
  name: 'home-view',
  methods: {
    login() {
      EventBus.$emit('events:click-home-login')
      window.location = '/#/login'
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

  .container
    display: flex
    align-items: center
    height: 100%

  .row
    width: 100%

  .secondary
    text-align: right

  .logo
    max-width: 100px
    margin-bottom: 2.5rem

  h1
    font-family: $font-family-serif
    font-weight: bold
    font-size: 3rem

  .lead
    font-weight: 400
    font-size: 1.25rem
    margin-bottom: 3.125rem

  .btn-primary
    margin-right: 1rem

</style>
