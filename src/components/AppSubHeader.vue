<template>
    <div class="sub-heading">
      <span :class="{ 'active': transferDirection === 'incoming' }">
        <b-link
          to="/transfers/incoming"
          v-if="transferDirection !== 'incoming'"
          @click="fetchData('incoming')">
          Incoming
        </b-link>
        <span v-else>Incoming</span>
      </span>
      <span :class="{ 'active': transferDirection === 'outgoing' }">
        <b-link
          to="/transfers/outgoing"
          v-if="transferDirection !== 'outgoing'"
          @click="fetchData('outgoing')">
          Outgoing
        </b-link>
        <span v-else>Outgoing</span>
      </span>
      <!--
        // @TODO: Add at a later point.
        <span><b-link to="/transfers/completed">Completed</b-link></span>
      -->
    </div>
</template>

<script>
export default {
  name: 'app-sub-header',
  props: ['transferDirection', 'fetchData'],
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.sub-heading
  font-weight: 600
  margin-bottom: 1rem

  span
  a
    display: inline-block

  .active
  a:hover
    color: $color-secondary-accent
    font-weight: 600
    border-bottom: 3px solid $color-secondary-accent
    text-decoration: none

  a:hover
    cursor: pointer
</style>
