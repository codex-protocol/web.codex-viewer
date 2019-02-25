<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Get CODX" />

        <div class="content">

          <p>
            <a :href="etherscanHelper.getTokenUrl(tokenContract._address, user.address)" target="_blank">CodexCoin (CODX)</a>
            is the ERC-20 utility token used to interact with The Codex
            Protocol. You must have CODX to create, edit, and transfer Codex
            Records.
          </p>

          <section class="request-faucet-drip" v-if="showFaucetDripForm">
            <p>
              On testnets such as {{ expectedNetworkName | titleCase }}, you can
              request CODX for free from the "CODX Faucet". After requesting a
              drip from the faucet, CODX will be sent to your account and you
              will receive a notification upon success. You can request 1 drip
              every 24 hours.
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

          <section class="buy-on-exchange" v-if="!isNotSavvyUser && !faucetDripEnabled">
            <!--  @TODO: add info here about where savvy users can purchase CODX from an exchange -->
            <p>
              Buy CODX on an exchange.
            </p>
          </section>

          <section class="pay-with-stripe" v-if="paymentsEnabled && isNotSavvyUser">

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
                  <span>{{ codxPackage.total }} CODX</span>
                </p>

                <p class="total-breakdown" v-if="codxPackage.bonus !== 0">
                  <span class="base-amount">
                    {{ codxPackage.amount }} CODX
                  </span>
                  <span class="bonus-amount">
                    + {{ codxPackage.bonus }} Bonus CODX!
                  </span>
                </p>

                <span class="spacer"></span>

                <div class="details">
                  <p>
                    This amount is enough for one of the following:
                  </p>
                  <ul>
                    <li>Create {{ Math.floor(codxPackage.total / codxCosts.CodexRecord.mint) }} Codex Records</li>
                    <li>Modify {{ Math.floor(codxPackage.total / codxCosts.CodexRecord.modifyMetadataHashes) }} Codex Records</li>
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

          <b-alert class="mt-4" variant="secondary" :show="isNotSavvyUser">
            <strong>Please Note:</strong>
            Any CODX purchased is held in your managed Codex Viewer account and
            can only be spent implicitly via the Codex Viewer (e.g. creating or
            modifying a Codex Record.)
          </b-alert>

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
import etherscanHelper from '../util/web3/etherscanHelper'

import AppHeader from '../components/core/AppHeader'
import FaucetDripModal from '../components/modals/FaucetDripModal'
import ApproveContractModal from '../components/modals/ApproveContractModal'

export default {

  components: {
    AppHeader,
    FaucetDripModal,
    ApproveContractModal,
  },

  data() {
    return {
      etherscanHelper,
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
    ...mapGetters('auth', ['isNotSavvyUser']),
    ...mapState('web3', ['recordContract', 'tokenContract']),
    ...mapState('auth', ['registryContractApproved', 'user']),
    ...mapState('app', ['paymentsEnabled', 'codxPackages', 'codxCosts']),

    showFaucetDripForm() {
      return (
        (config.faucetDripEnabled && this.isNotSavvyUser) ||
        (config.faucetDripEnabled && config.feesEnabled && !this.isNotSavvyUser)
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
              EventBus.$emit('events:codx-package-purchase', packageName, codxPackage.total)
              EventBus.$emit('toast:success', 'CODX purchased successfully! Your balance will update soon.', 5000)
            })
            .catch((error) => {
              EventBus.$emit('toast:error', 'Could not purchase CODX, please try again later. Your card was not charged.')
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
