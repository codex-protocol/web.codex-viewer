<template>
  <div>
    <app-header title="Codex Gallery" />
    <p>The Codex Gallery is coming soon.</p>
    <p>Once live, you'll be able to browse a hand-curated gallery of Codex Records from participants in the Beta!</p>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'

import AppHeader from '../components/AppHeader'

export default {
  name: 'gallery-view',
  components: {
    AppHeader,
  },
  created() {
    EventBus.$emit('events:gallery-page')
  },
}
</script>

<style lang="stylus" scoped>

</style>
