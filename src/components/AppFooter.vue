<template>
  <div class="footer" :class="{ 'with-background': this.useBackground() }">
    <div class="row">
      <div class="col-md-3 offset-md-2">
          <p class="bug-bounty-notice" v-if="showBugBountyInfo">
            Bug Bounty Program Active
          </p>
          <p>
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
          </p>
      </div>
      <div class="col-6">
        <p v-if="showBugBountyInfo">Earn CDX tokens by spotting bugs and completing tasks within the Viewer</p>
        <p class="links">
          <a href="#" v-if="showBugBountyInfo">Bug Bounty</a>
          <a href="#" v-if="showBugBountyInfo">Earndrop</a>
          <a href="https://www.codexprotocol.com/Terms-of-Service.pdf">Terms Of Use</a>
          <a href="https://www.codexprotocol.com/privacy-policy.html">Privacy Policy</a>
          <a href="mailto:support@codexprotocol.com">Contact Us</a>
        </p>
      </div>
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
  props: ['useBackground'],
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
  margin-top: 2rem

  &.with-background
    background: url(../assets/images/pattern-dark.jpeg)

  .bug-bounty-notice
    font-weight: bold

  .links a
    margin-right: 2rem
    color: $color-light
    text-decoration: underline

.row
  width: 100%

a .icon
  fill: $color-light
  color: $color-light
  margin-right: 1rem
</style>
