<template>
  <div class="card-container">
    <b-card
      text-variant="dark"
      header="Unsupported Device"
      class="unsupported-device-card"
    >
      <p class="card-text">
        Your device is not yet supported by the Codex Viewer, but we're working on it!
      </p>
      <p class="card-text">
        To use the Codex Viewer in the meantime, please use a desktop computer with Google Chrome or Mozilla Firefox.
      </p>
    </b-card>
  </div>
</template>

<script>

import is from 'is_js'

import EventBus from '../util/eventBus'

export default {
  name: 'unsupported-device-view',
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

    EventBus.$emit('events:unsupported-device', this)

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

.unsupported-device-card
  max-width: 40rem
  text-align: center
  border-radius: .25rem

</style>
