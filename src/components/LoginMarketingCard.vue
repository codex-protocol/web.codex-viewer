<template>
  <div class="marketing-container">
    <h1>Earn CODX</h1>
    <p>Codex Quests are live! Earn CODX tokens by completing quests and providing feedback to our team.</p>
    <p>
      <b-link to="/codex-quests">Find out more here</b-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'login-marketing-card',
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.marketing-container
  border: 1px solid $color-primary
  padding: 2rem
  background-color: $color-dark

h1
  font-size: 1.5rem
  font-weight: bold

</style>
