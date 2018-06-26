<template>
  <div class="card-container">
    <b-card
      text-variant="dark"
      header="Unsupported Browser"
      class="unsupported-browser-card"
    >
      <p class="card-text">
        Your browser is not currently supported by MetaMask, the wallet provider used by the Codex Viewer.
        Please download a MetaMask-compatible browser to use this application.
      </p>
      <p class="card-text">
        Support for other browsers &amp; wallet providers is coming soon!
      </p>
      <div class="browser-links">
        <b-button href="https://brave.com/" target="_blank">
          <!--
            @NOTE: I couldn't get the IconBase component to load this
            Illustrator-exported svg correctly, so I'm just falling back to a
            good ol' fashioned <img> tag
          -->
          <img class="icon" src="../assets/icons/brave.svg">
          Get Brave
        </b-button>
        <b-button href="https://www.opera.com/" target="_blank">
          <icon-base iconName="opera" width="24" height="24" class="icon">
            <icon-opera />
          </icon-base>
          Get Opera
        </b-button>
        <b-button href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">
          <icon-base iconName="firefox" width="24" height="24" class="icon">
            <icon-firefox />
          </icon-base>
          Get Firefox
        </b-button>
        <b-button href="https://www.google.com/chrome/" target="_blank">
          <icon-base iconName="chrome" width="24" height="24" class="icon">
            <icon-chrome />
          </icon-base>
          Get Chrome
        </b-button>
        <b-button href="https://metamask.io/" target="_blank">
          <!--
            @NOTE: I couldn't get the IconBase component to load this
            Illustrator-exported svg correctly, so I'm just falling back to a
            good ol' fashioned <img> tag
          -->
          <img class="icon" src="../assets/icons/metamask.svg">
          Get Metamask
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>

import is from 'is_js'

import EventBus from '../util/eventBus'

import IconBase from '../components/icons/IconBase'
import IconOpera from '../components/icons/IconOpera'
import IconChrome from '../components/icons/IconChrome'
import IconFirefox from '../components/icons/IconFirefox'

export default {
  name: 'unsupported-browser-view',
  components: {
    IconBase,
    IconOpera,
    IconChrome,
    IconFirefox,
  },
  created() {

    const deviceDetails = {
      ie: is.ie(),
      edge: is.edge(),
      chrome: is.chrome(),
      firefox: is.firefox(),
      opera: is.opera(),
      safari: is.safari(),
      ios: is.ios(),
      iphone: is.iphone(),
      ipad: is.ipad(),
      ipod: is.ipod(),
      android: is.android(),
      androidPhone: is.androidPhone(),
      androidTablet: is.androidTablet(),
      blackberry: is.blackberry(),
      windowsPhone: is.windowsPhone(),
      windowsTablet: is.windowsTablet(),
      windows: is.windows(),
      mac: is.mac(),
      linux: is.linux(),
      desktop: is.desktop(),
      mobile: is.mobile(),
      tablet: is.tablet(),
      touchDevice: is.touchDevice(),
    }

    Object.keys(deviceDetails).forEach((key) => {
      if (deviceDetails[key] === false) delete deviceDetails[key]
    })

    EventBus.$emit('events:unsupported-browser', deviceDetails)

  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card-container
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center

.unsupported-browser-card
  max-width: 40rem
  text-align: center
  border-radius: .25rem

.browser-links
  display: flex
  align-items: center
  flex-direction: column

  .btn
    height: 2.5em
    min-width: 40%
    max-width: 100%
    overflow: hidden
    font-size: inherit
    vertical-align: middle
    text-overflow: ellipsis

    &+.btn
      margin-top: .5em

    @media(max-width: 600px)
      min-width: 100%

    .icon
      width: 1.25em
      height: 1.25em
      margin-right: .25em
      vertical-align: middle

</style>
