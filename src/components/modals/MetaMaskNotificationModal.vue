<template>
  <b-modal
    :ref="id"
    :id="id"
    :title="title"
    @hidden="onHide"
    :ok-title="okTitle"
    :hide-footer="isFooterHidden"
    :cancel-variant="cancelVariant"
    :ok-disabled="isDisabled"
    :size="modalSize"
    v-model="modalVisible"
    v-on:shown="shown"
    v-on:ok.prevent="goToStep(currentStep + 1)"

    :no-close-on-esc="preventClose"
    :hide-header-close="preventClose"
    :no-close-on-backdrop="preventClose"
  >

    <!--
      @NOTE: we use v-show here instead of v-if so that scoped styles from
      parent components will still be applied

      since there are some calculations to be done before showing the slot, the
      time it takes to do so prevents webpack from being able to apply the
      scoped styles if you use a v-if
    -->
    <div v-show="shouldShowMainSlot">
      <slot></slot>
    </div>

    <div class="text-center" v-show="!shouldShowMainSlot">

      <div>
        <img class="icon" src="../../assets/images/metamask.png" />
      </div>

      <div v-if="metamaskError">
        <p>
          There was a problem sending your transaction:
        </p>
        <pre class="metamask-error">{{metamaskError}}</pre>
      </div>

      <div v-else-if="willTransactionFail">
        <p>
          You haven't finished setting up your account so the transaction will fail.
        </p>
        <p>
          Make sure to <b-link :to="{ name: 'faucet' }">get CODX from the faucet and approve the registry contract.</b-link>
        </p>
      </div>

      <div v-else>
        <div v-if="currentStep === 1">
          <p>
            When you click "{{ okTitle }}" we will pop up a Metamask dialog.
          </p>
          <p>
            This dialog will ask you to confirm the transaction, including a small ETH cost.
          </p>
          <p>
            The transaction is set with a default gas limit and price. It&rsquo;s fine to keep these defaults.
          </p>
        </div>

        <div v-else-if="currentStep === 2">
          <p>
            Please wait while your transaction is sent by MetaMask...
          </p>
        </div>

        <div v-else-if="currentStep === 3">
          <p>
            Your transaction has been submitted!
          </p>
          <p>
            It will take a few minutes for your transaction to be mined, but you may now close this dialog.
          </p>
        </div>
      </div>

    </div>

  </b-modal>
</template>

<script>
import Raven from 'raven-js'

import config from '../../util/config'

export default {
  name: 'meta-mask-notification-modal',
  props: [
    'id',
    'title',
    'okTitle',
    'cancelVariant',
    'okDisabled',
    'okMethod',
    'size',
    'onShown',
    'onClear',
    'requiresTokens',
  ],
  data() {
    return {
      isFooterHidden: false,
      metamaskError: null,
      modalVisible: false,
      preventClose: false,
      currentStep: 0,
    }
  },
  methods: {
    onHide() {
      Object.assign(this.$data, this.$options.data.apply(this))
      if (typeof this.onClear === 'function') this.onClear()
    },
    goToStep(newCurrentStep) {

      switch (newCurrentStep) {

        case 0: // the slot contents
        case 1: // you're about to use MM
          this.preventClose = false
          this.isFooterHidden = false
          break

        // please wait
        case 2:
          this.preventClose = true
          this.metamaskError = false
          this.isFooterHidden = true

          this.okMethod()
            .then(() => {
              this.goToStep(this.currentStep + 1)
            })
            .catch((error) => {
              Raven.captureException(error)

              this.metamaskError = (error.message || 'An unknown error occurred').replace(/.*Error:(.*)$/, '$1')
              this.goToStep(this.currentStep - 1)
            })

          break

        // transaction submitted, waiting for mine
        case 3:
          this.preventClose = false
          this.isFooterHidden = true
          break

        // done
        default:
          this.modalVisible = false
      }

      this.currentStep = newCurrentStep

    },
  },
  computed: {
    shown() {
      return this.onShown || this.noop
    },
    noop() {
      return () => {}
    },
    isDisabled() {
      return this.willTransactionFail || this.okDisabled || false
    },
    modalSize() {
      return this.size || ''
    },
    willTransactionFail() {
      const {
        balance,
        registryContractApproved,
      } = this.$store.state.auth

      return config.showFaucet && this.requiresTokens && (!registryContractApproved || balance.eq(0))
    },
    shouldShowMainSlot() {
      return this.currentStep === 0 && !this.willTransactionFail
    },
  },
}
</script>

<style lang="stylus" scoped>
.icon
  width: 8rem
  margin-bottom: 2rem

.metamask-error
  color: white
  padding: 1em
  word-wrap: break-word
  white-space: pre-wrap
  border-radius: .25rem
  background-color: rgba(white, .1)

</style>
