<template>
  <b-modal
    :ref="id"
    :id="id"
    :title="title"
    :ok-title="buttonTitle"
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

    <div v-if="shouldShowMainSlot">
      <p v-if="errors.length">
        <b-alert variant="danger" :show="errors.length !== 0">
          Please fix these error(s):
          <ul class="mb-0">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </b-alert>
      </p>
      <slot></slot>
    </div>

    <div class="text-center" v-else>

      <div v-if="!isNotSavvyUser">
        <img class="icon" src="../../assets/images/metamask.png" />
      </div>

      <div v-if="metamaskError">
        <p>
          There was a problem sending your transaction:
        </p>
        <pre class="metamask-error">{{ metamaskError }}</pre>
      </div>

      <div v-else-if="willTransactionFail">
        <p>
          You haven't finished setting up your account so the transaction will fail.
        </p>
        <p>
          Make sure to <b-link :to="{ name: 'get-codx' }">get CODX and approve the registry contract.</b-link>
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
          <CODXCheckoutControl
            :cost="checkoutCost"
            :action="checkoutAction"
            :newBalance="newBalance"
            :quantity="checkoutQuantity"
            :insufficientCODX="insufficientCODX"
          >
            <slot name="checkout"></slot>
          </CODXCheckoutControl>
        </div>

        <div v-else-if="currentStep === 4">
          <p>
            Your transaction has been submitted to the blockchain!
          </p>
          <p>
            Confirming transactions securely on the blockchain can take anywhere
            from a few minutes to a few hours. Once confirmed, you'll receive an
            email and a notification on this page.
          </p>
          <b-button
            variant="primary"
            @click="modalVisible = false"
          >
            Go Back to the Viewer
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import config from '../../util/config'

import CODXCheckoutControl from '../CODXCheckoutControl'

export default {

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
    'checkoutAction',
    'checkoutCost',
    'checkoutQuantity',
  ],

  components: {
    CODXCheckoutControl,
  },

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
      disableButton: false,
    }
  },

  computed: {
    ...mapState('auth', ['registryContractApproved', 'user']),
    ...mapGetters('auth', ['isNotSavvyUser']),

    totalCheckoutCost() {
      return this.checkoutCost * (this.checkoutQuantity || 1)
    },

    newBalance() {
      return this.totalCheckoutCost
        ? this.user.availableCODXBalance - this.totalCheckoutCost
        : 0
    },

    insufficientCODX() {
      return this.newBalance < 0
    },

    isDisabled() {
      return this.willTransactionFail || this.okDisabled || this.disableButton
    },

    modalSize() {
      return this.size || ''
    },

    // @TODO: instead of checking for a balance of 0, this should really check
    //  for a balance "gte" the cost of the transaction
    willTransactionFail() {
      return (
        !this.isNotSavvyUser &&
        config.feesEnabled &&
        this.requiresTokens &&
        (!this.registryContractApproved || this.user.availableCODXBalance === 0)
      )
    },

    shouldShowMainSlot() {
      return this.currentStep === 0 && !this.willTransactionFail
    },

    buttonTitle() {
      if (this.isNotSavvyUser && this.currentStep === 0 && this.requiresTokens) {
        return 'Proceed to Checkout'
      }

      return this.okTitle
    },
  },

  methods: {
    onHide() {
      Object.assign(this.$data, this.$options.data.apply(this))
      if (typeof this.onClear === 'function') this.onClear()
    },

    scrollToTop() {
      // annoyingly enough, the element that Vue Bootstrap attaches the b-modal
      //  $ref to isn't the actual body of the modal, but the container that
      //  holds the backdrop and everything else so we need to look up the child
      //  element we really want to scroll
      this.$refs[this.id].$el.querySelector(`#${this.id}`).scrollTop = 0
    },

    nextStep() {

      // always scroll back up to the top when navigating through steps, because
      //  there could be new content up there
      this.scrollToTop()

      if (this.validate) {
        this.errors = this.validate()

        if (this.errors.length !== 0) {
          return
        }
      }

      if (this.isNotSavvyUser) {
        if (this.currentStep === 0) {
          if (this.requiresTokens && this.totalCheckoutCost) {
            this.goToStep(3)
          } else {
            this.goToStep(4)
          }
        } else {
          this.goToStep(this.currentStep + 1)
        }
      } else if (this.currentStep === 2) {
        this.goToStep(4)
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
              this.nextStep()
            })
            .catch((error) => {
              this.metamaskError = (error.message || 'An unknown error occurred').replace(/.*Error: ?(.*?)("})?$/, '$1')
              this.goToStep(this.currentStep - 1)
            })

          break

        // @TODO: validate this with savvy users
        // checkout flow
        case 3:
          if (this.insufficientCODX) {
            this.disableButton = true
          }

          this.preventClose = false
          this.isFooterHidden = false
          break

        // transaction submitted, waiting for mine
        case 4:
          if (this.isNotSavvyUser) {
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
