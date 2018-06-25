<template>
  <div>
    <app-header title="Codex Quests" />
    <h2>Earn CODX by completing Codex Quests</h2>
    <div class="content">
      <p>
        Codex Quests are designed to provide opportunities for our community to receive CODX tokens in reward for completing specific tasks related to Codex Viewer on a given day.
        On each quest day, the team will be around on social media to listen to your feedback so that we can incorporate your ideas into building a better product.
      </p>

      <p>
        For more details on how to participate and claim your CODX rewards, <a href="https://medium.com/@johnhforrest/announcing-codex-quests-our-bug-bounty-program-b034678014b3" target="_blank">check out the original announcement on Medium</a>.
      </p>

      <p>The schedule of the quests is as follows:</p>

      <div class="schedule">
        <h2>June 26th - Contest</h2>
        <p>
          Share the "Digital Assembly" edition you claimed from your collection on Twitter and tag Codex Protocol (be sure to make your Codex Record public before sharing!).
        </p>

        <h2>June 29th - Transfers</h2>
        <p>
          Tweet us your Rinkeby ETH address to receive a Codex Record from the team. Accept this transfer on the incoming transfers tab.
        </p>

        <h2>July 3rd - Modifications</h2>
        <p>
          Add a "behind the scenes" picture to the Digital Assembly edition you've claimed. For example, take a picture of your monitor displaying the Codex Record.
        </p>

        <h2>July 9th - Tokens</h2>
        <p>
          Grab some CODX from the faucet and stake some tokens to receive a discount on any protocol operations after fees are turned on later this week.
        </p>

        <h2>July 11th - Gallery</h2>
        <p><b>Fees for the registry will now be turned on, so make sure you have CODX from the faucet!</b><p>

        <p>
          Create a Codex Record (receive a bonus of $5 in CODX for sharing your own artwork) and transfer it to address <a href="https://rinkeby.etherscan.io/address/0x61E69543d7858AFE535241A6e1DdD22A11ae47B4">0x61E69543d7858AFE535241A6e1DdD22A11ae47B4</a>.
        </p>
        <p>
          Address 0x61E69543d7858AFE535241A6e1DdD22A11ae47B4 is going to be our first Codex Gallery. Any Codex Records owned by this account will be made public, and shared at <b-link to="/gallery">The Codex Gallery</b-link>.
        </p>
        <p>
          This means that by the end of our Beta period, we'll have a unique gallery composed of all the artists &amp; collectors in our community.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'

import AppHeader from '../components/AppHeader'

export default {
  name: 'codex-quests-view',
  components: {
    AppHeader,
  },
  created() {
    EventBus.$emit('events:codex-quests-page')
  },
}
</script>

<style lang="stylus" scoped>

.content
  width: 45%

.schedule
  h2
    margin-top: 2rem

h2
  font-size: 1.5rem

</style>
