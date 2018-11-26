<template>
  <b-modal
    :ref="id"
    :id="id"
    :title="title"
    :ok-title="okTitle"
    :hide-footer="isFooterHidden"
    :cancel-variant="cancelVariant"
    :ok-disabled="isDisabled"
    :size="modalSize"
    v-model="modalVisible"
    @shown="shown"
    @hidden="onHide"
    @ok.prevent="nextStep"

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
      <p v-if="errors.length">
        <b-alert variant="danger" :show="errors.length !== 0">
          Please fix these error(s):
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </b-alert>
      </p>
      <slot></slot>
    </div>

    <div class="text-center" v-show="!shouldShowMainSlot">

      <div v-if="!isSimpleUser">
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
            Your transaction has been submitted to the blockchain!
          </p>
          <p>
            Confirming transactions securely on the blockchain can take anywhere from a few minutes to a few hours. Once confirmed, you'll receive a notification on this page.
          </p>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import BigNumber from 'bignumber.js'
import { mapState, mapGetters } from 'vuex'

import config from '../../util/config'

export default {
  name: 'MetaMaskNotificationModal',

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
    'validate',
  ],

  data() {
    const noOp = () => {}

    return {
      isFooterHidden: false,
      metamaskError: null,
      modalVisible: false,
      preventClose: false,
      currentStep: 0,
      errors: [],
      shown: this.onShown || noOp,
    }
  },

  computed: {
    ...mapState('auth', ['registryContractApproved', 'user']),
    ...mapGetters('auth', ['isSimpleUser']),

    isDisabled() {
      return this.willTransactionFail || this.okDisabled || false
    },

    modalSize() {
      return this.size || ''
    },

    // @TODO: instead of checking for a balance of 0, this should really check
    //  for a balance "gte" the cost of the transaction
    willTransactionFail() {
      return config.showFaucet && this.requiresTokens && (!this.registryContractApproved || new BigNumber(this.user.codxBalance).eq(0))
    },

    shouldShowMainSlot() {
      return this.currentStep === 0 && !this.willTransactionFail
    },
  },

  methods: {
    onHide() {
      Object.assign(this.$data, this.$options.data.apply(this))
      if (typeof this.onClear === 'function') this.onClear()
    },

    nextStep() {
      if (this.validate) {
        this.errors = this.validate()

        if (this.errors.length) {
          // rudimentary, but refocuses at the top if we need to scroll
          this.shown()

          return
        }
      }

      if (this.isSimpleUser) {
        this.goToStep(3)
      } else {
        this.goToStep(this.currentStep + 1)
      }
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
          if (this.isSimpleUser) {
            this.okMethod()
              .catch((error) => {
                this.metamaskError = (error.message || 'An unknown error occurred').replace(/.*Error:(.*)$/, '$1')
              })
          }
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
}
</script>

<style lang="stylus" scoped>
.icon
  width: 8rem
  margin-bottom: 2rem

.metamask-error
  color: white
  padding: 1em
  white-space: pre-wrap
  border-radius: .25rem
  overflow-wrap: break-word
  background-color: rgba(white, .1)

</style>
