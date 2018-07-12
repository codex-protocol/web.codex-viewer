<template>
<div />
<!-- <script
  v-if="isProduction"
  type="text/javascript"
  id="hs-script-loader"
  async defer :src="scriptSource">
</script> -->
</template>

<script>
export default {
  name: 'hubspot-tracking',
  props: ['hubspotId'],
  data() {
    return {
      isProduction: process.env.TARGET_ENV === 'production',
    }
  },
  computed: {
    scriptSource() {
      return `//js.hs-scripts.com/${this.hubspotId}.js`
    },
  },
}
</script>
