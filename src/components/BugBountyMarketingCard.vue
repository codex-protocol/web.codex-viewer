<template>
  <div class="bounty-container">
    <h1>Earn ETH &amp; CODX by participating!</h1>
    <ul>
      <li>Earn ETH by submitting vulnerabilities you find in the Codex Protocol smart contracts.</li>
      <li>Earn CODX by completing tasks in the Beta and providing feedback to our team.</li>
    </ul>
    <div>
      Follow the links below to find out more:
      <ul>
        <li><a href="#">How to participate in the Bug Bounty</a></li>
        <li><a href="#">Current Beta tasks eligible for CODX</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bug-bounty-marketing-card',
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.bounty-container
  border: 1px solid $color-primary
  padding: 3rem

h1
  font-size: 1rem
  font-weight: bold
</style>
