<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
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
            <h2>June 26th - Sharing</h2>
            <p>
              Share the "Full Assembly" edition you claimed from your collection on Twitter and tag Codex Protocol (be sure to make your Codex Record public before sharing!).
            </p>

            <h2>June 29th - Transfers</h2>
            <p>
              Tweet us your Rinkeby ETH address to receive a Codex Record from the team. Accept this transfer on the incoming transfers tab.
            </p>

            <h2>July 3rd - Modifications</h2>
            <p>
              Add a "behind the scenes" picture (e.g. a picture of your monitor displaying the artwork) to the "Full Assembly" edition you've claimed.
            </p>
            <p>
              To do this, click the "Manage" button on the details page of the your edition of "Full Assembly". (This button will only show up for Codex Records you own.)
            </p>
            <p><img src="../assets/images/codex-quests/modifications-1.png"></p>
            <p>
              After clicking the "Manage" button, a modal dialog will pop up that allows you to edit metadata and attach additional photos.
            </p>
            <p><img src="../assets/images/codex-quests/modifications-2.png"></p>
            <p>
              After adding your “behind the scenes” photo, click on “Save” to submit the updates to the blockchain and send a link to your updated Codex Record to codex-quests@codexprotocol.com.
            </p>

            <h2>July 9th - Tokens</h2>
            <p>
              Grab some CODX from the faucet so that you are prepared for when protocol fees are turned on later this week.
              After you have some tokens, send a screenshot of your non-zero balance to codex-quests@codexprotocol.com as evidence of you completing the quest.
            </p>

            <h2>July 11th - Gallery</h2>
            <p><b>Fees for the registry will now be turned on, so make sure you have CODX from the faucet!</b><p>

            <p>
              Create a Codex Record (receive a bonus of $5 in CODX for sharing your own artwork) and transfer it to address <a href="https://rinkeby.etherscan.io/address/0x61E69543d7858AFE535241A6e1DdD22A11ae47B4" target="_blank">0x61E69543d7858AFE535241A6e1DdD22A11ae47B4</a>.
            </p>
            <p>
              Address 0x61E69543d7858AFE535241A6e1DdD22A11ae47B4 is going to be our first Codex Gallery. Any Codex Records owned by this account will be made public, and shared at <b-link to="/galleries/codex">The Codex Gallery</b-link>.
            </p>
            <p>
              This means that by the end of our Beta period, we'll have a unique gallery composed of all the artists &amp; collectors in our community.
            </p>
          </div>
        </div>
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

@import "../assets/variables.styl"

.content

  @media screen and (min-width: $breakpoint-lg)
    max-width: 50%

.schedule
  word-wrap: break-word

  h2
    margin-top: 2rem

h2
  font-size: 1.5rem

img
  width: 100%
  border-radius: .25rem
  border: .5rem solid rgba(white, .25)
  box-shadow: 0 1rem 1rem -1rem rgba(black, .5)

</style>
