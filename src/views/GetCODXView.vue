<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Get CODX" />

        <div class="content">

          <!-- @TODO: make sure we can call CODX a digital currency -->
          <p>CodexCoin (CODX) is the ERC-20 digital currency used to interact with The Codex Protocol. You must have CODX to create, edit, and transfer Codex Records.</p>

          <section class="request-faucet-drip" v-if="showFaucetDripForm">
            <p>
              On testnets such as {{ expectedNetworkName }}, you can request CODX for free from the "CODX Facuet".
              After requesting a drip from the faucet, CODX will be sent to your account and you will recieve a notification upon success.
              You can request 1 drip every 24 hours.
            </p>
            <b-button
              class="mb-3"
              variant="primary"
              v-b-modal.faucetDripModal
              :disabled="!user.canRequestFaucetDrip"
            >
              Request CODX from Faucet
            </b-button>

            <p v-if="!user.canRequestFaucetDrip">
              <strong>You'll be able to request more CODX in {{ nextRequestIn }}</strong>
            </p>

            <FaucetDripModal />

          </section>

          <section class="buy-on-exchange" v-if="!isSimpleUser && !faucetDripEnabled">
            <!--  @TODO: add info here about where savvy users can purchase CODX from an exchange -->
            <p>
              Buy CODX on an exchange.
            </p>
          </section>

          <section class="pay-with-stripe" v-if="paymentsEnabled && isSimpleUser">

            <p>
              Select a package below to checkout securely with
              <a href="https://stripe.com/" target="_blank">Stripe</a>.
            </p>

            <div class="codx-packages">
              <div
                :key="packageName"
                class="codx-package"
                v-for="(codxPackage, packageName) in codxPackages"
              >
                <h2 class="price">
                  ${{ (codxPackage.price / 100).toFixed(0) }}
                </h2>

                <p class="total-amount">
                  <span>{{ codxPackage.codxTotal | formatCODXAmount }}</span>
                </p>

                <p class="total-breakdown" v-if="codxPackage.bonus !== 0">
                  <span class="base-amount">
                    {{ codxPackage.codxAmount | formatCODXAmount }}
                  </span>
                  <span class="bonus-amount">
                    + {{ codxPackage.codxBonus | formatCODXAmount('Bonus CODX!') }}
                  </span>
                </p>

                <span class="spacer"></span>

                <div class="details">
                  <p>
                    This amount is enough for one of the following:
                  </p>
                  <ul>
                    <li>Create {{ Math.floor(codxPackage.codxTotal / codxCosts.CodexRecord.mint) }} Codex Records</li>
                    <li>Modify {{ Math.floor(codxPackage.codxTotal / codxCosts.CodexRecord.modifyMetadataHashes) }} Codex Records</li>
                    <li>Accept {{ Math.floor(codxPackage.codxTotal / codxCosts.CodexRecord.safeTransferFrom) }} Codex Record transfers</li>
                  </ul>
                </div>

                <b-button
                  variant="primary"
                  @click.prevent="promptForPayment(packageName)"
                >
                  Buy
                </b-button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

import stripe from '../util/stripe'
import config from '../util/config'
import Faucet from '../util/api/faucet'
import EventBus from '../util/eventBus'
import { timeSince } from '../util/dateHelpers'

import AppHeader from '../components/core/AppHeader'
import FaucetDripModal from '../components/modals/FaucetDripModal'
import ApproveContractModal from '../components/modals/ApproveContractModal'

export default {
  name: 'GetCODXView',

  components: {
    AppHeader,
    FaucetDripModal,
    ApproveContractModal,
  },

  data() {
    return {
      faucetDripEnabled: config.faucetDripEnabled,
      expectedNetworkName: config.expectedNetworkName,
    }
  },

  beforeDestroy() {
    if (this.paymentsEnabled) {
      stripe.widget.close()
    }
  },

  computed: {
    ...mapGetters('auth', ['isSimpleUser']),
    ...mapState('web3', ['recordContract']),
    ...mapState('auth', ['registryContractApproved', 'user']),
    ...mapState('app', ['paymentsEnabled', 'codxPackages', 'codxCosts']),

    showFaucetDripForm() {
      return (
        (config.faucetDripEnabled && this.isSimpleUser) ||
        (config.faucetDripEnabled && config.feesEnabled && !this.isSimpleUser)
      )
    },

    nextRequestIn() {
      const now = Date.now()
      const faucetDripNextRequestAt = new Date(this.user.faucetDripNextRequestAt).getTime()
      return timeSince(new Date(now - (faucetDripNextRequestAt - now)))
    },
  },

  methods: {
    promptForPayment(packageName) {

      const codxPackage = this.codxPackages[packageName]

      stripe.widget.open({
        name: 'Codex Labs, Inc',
        amount: codxPackage.price,
        description: 'CODX Purchase',
        token(token) {
          Faucet.purchaseCODXPackage(token.id, packageName)
            .then(() => {
              EventBus.$emit('toast:success', 'CODX purchased successfully! Your balance will update soon.', 5000)
            })
            .catch((error) => {
              EventBus.$emit('toast:error', 'Could not purchase CODX.')
            })
        },
      })

    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

section + section
  margin-top: 2rem
  padding-top: 2rem
  border-top: 1px solid rgba($color-primary, .25)

.codx-packages
  display: flex
  flex-wrap: nowrap
  color: $color-dark
  justify-content: space-between

  .codx-package
    padding: 1rem
    text-align: center
    color: $color-light
    width: calc(33% - 1rem)
    background-color: $color-secondary

    display: flex
    align-items: center
    flex-direction: column

    .total-amount
      font-weight: 700
      margin-bottom: 0
      font-size: 1.5rem

    .total-breakdown
      font-size: small

      .bonus-amount
        font-weight: 700
        font-style: italic

    .details
      font-size: small
      text-align: left
      margin-bottom: 1rem
      color: rgba($color-light, .8)

      ul
        width: 100%

  @media screen and (max-width: $breakpoint-sm)
    flex-wrap: wrap

    .codx-package
      width: 100%

      .total-breakdown
        font-size: unset

      .details
        font-size: unset

      &+.codx-package
        margin-top: 2rem

      button
        width: 100%

</style>
