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
    <slot v-if="currentStep === 0"></slot>

    <div v-else>

      <div class="text-center">
        <img class="icon" src="../../assets/images/metamask.png" />
      </div>

      <div v-if="metamaskError">
        <p class="text-center">
          There was a problem sending your transaction:
        </p>
        <pre class="text-center metamask-error">{{metamaskError}}</pre>
      </div>

      <div v-else>
        <div v-if="currentStep === 1">
          <p class="text-center">
            When you click "{{ okTitle }}" we will pop up a Metamask dialog.
          </p>
          <p class="text-center">
            This dialog will ask you to confirm the transaction, including a small ETH cost.
          </p>
          <p class="text-center">
            The transaction is set with a default gas limit and price. It&rsquo;s fine to keep these defaults.
          </p>
        </div>

        <div v-else-if="currentStep === 2">
          <p class="text-center">
            Please wait while your transaction is sent by MetaMask...
          </p>
        </div>

        <div v-else-if="currentStep === 3">
          <p class="text-center">
            Your transaction has been submitted!
          </p>
          <p class="text-center">
            It will take a few minutes for your transaction to be mined, but you may now close this dialog.
          </p>
        </div>
      </div>

    </div>

  </b-modal>
</template>

<script>
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
      return this.okDisabled || false
    },
    modalSize() {
      return this.size || ''
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
