<template>
  <div class="footer mt-3 mb-3">
    <div class="links mb-3">
      <a href="#" v-if="showBugBountyInfo">Bug Bounty</a>
      <a href="https://bitcointalk.org/index.php?topic=4508456.0">Earndrop</a>
      <a href="https://www.codexprotocol.com/Terms-of-Service.pdf">Terms of Use</a>
      <a href="https://www.codexprotocol.com/privacy-policy.html">Privacy Policy</a>
      <a href="mailto:support@codexprotocol.com">Contact Us</a>
    </div>
    <div>
      <a href="https://github.com/codex-protocol/">
        <icon-base iconName="github" width="24" height="24" class="icon">
          <icon-github />
        </icon-base>
      </a>
      <a href="https://twitter.com/codexprotocol">
        <icon-base iconName="twitter" width="24" height="24" class="icon">
          <icon-twitter />
        </icon-base>
      </a>
      <a href="http://t.me/codexprotocol">
        <icon-base iconName="telegram" width="24" height="24" class="icon">
          <icon-telegram />
        </icon-base>
      </a>
      <a href="https://medium.com/codexprotocol">
        <icon-base iconName="medium" width="24" height="24" class="icon">
          <icon-medium />
        </icon-base>
      </a>
    </div>
  </div>
</template>

<script>

import IconBase from './icons/IconBase'
import IconGithub from './icons/IconGithub'
import IconTwitter from './icons/IconTwitter'
import IconTelegram from './icons/IconTelegram'
import IconMedium from './icons/IconMedium'

import config from '../util/config'

export default {
  name: 'app-footer',
  components: {
    IconBase,
    IconGithub,
    IconTwitter,
    IconTelegram,
    IconMedium,
  },
  data() {
    return {
      showBugBountyInfo: config.showBugBountyMarketingCard,
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.footer
  display: flex
  align-items: center
  flex-direction: column

  .links a
    font-size: 80%
    margin-right: 2rem
    color: $color-light

a .icon
  fill: $color-light
  color: $color-light
  margin-right: 1rem
</style>
