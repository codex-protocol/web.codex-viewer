<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="Manage Tokens" />
        <h5 class="mb-5">Get CODX from the faucet &amp; stake CODX for discounts!</h5>

        <p>Credit balance: {{ creditBalance }}</p>

        <div class="item contract">
          <p>Registry contract approved? {{ registryContractApproved ? 'Yes!' : 'No' }}</p>
          <b-button variant="primary" v-b-modal.approveRegistryModal :disabled="registryContractApproved">
            Approve the registry contract
          </b-button>
        </div>

        <div class="item contract">
          <p>Stake contract approved? {{ stakeContractApproved ? 'Yes!' : 'No' }}</p>
          <b-button variant="primary" v-b-modal.approveStakeModal :disabled="stakeContractApproved">
            Approve the staking contract
          </b-button>
        </div>

        <div class="item">
          <p v-if="!stakeContractApproved">Before you can stake CODX, you have to approve the contract above</p>

          <personal-stakes-table :personal-stakes="userState.personalStakes" />
          <div class="stake-buttons">
            <b-button variant="primary" v-b-modal.stakeTokensModal :disabled="!stakeContractApproved">
              Stake more CODX
            </b-button>
            <b-button variant="outline-primary" v-b-modal.unstakeTokensModal :disabled="!stakeContractApproved">
              Unstake CODX
            </b-button>
            <b-button variant="outline-primary">Collect interest</b-button>
          </div>
        </div>

        <approve-contract-modal id="approveRegistryModal" :contractInstance="recordContract" stateProperty="registryContractApproved">
          This will grant the Codex Viewer permission to spend CODX on your behalf.
        </approve-contract-modal>

        <!-- <approve-contract-modal id="approveStakeModal" :contractInstance="stakeContract" stateProperty="stakeContractApproved">
          This will allow you to stake CODX.
        </approve-contract-modal> -->

        <stake-tokens-modal />
        <unstake-tokens-modal :unstake="true" />
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'

import AppHeader from '../components/AppHeader'
import PersonalStakesTable from '../components/PersonalStakesTable'
import ApproveContractModal from '../components/modals/ApproveContractModal'
import StakeTokensModal from '../components/modals/StakeTokensModal'
import UnstakeTokensModal from '../components/modals/UnstakeTokensModal'

export default {
  name: 'manage-tokens-view',
  components: {
    AppHeader,
    PersonalStakesTable,
    ApproveContractModal,
    StakeTokensModal,
    UnstakeTokensModal,
  },
  created() {
    EventBus.$emit('events:view-tokens-page')
  },
  computed: {
    web3() {
      return this.$store.state.web3.instance()
    },
    userState() {
      return this.$store.state.auth
    },
    creditBalance() {
      return this.userState.creditBalance
    },
    registryContractApproved() {
      return this.userState.registryContractApproved
    },
    stakeContractApproved() {
      return this.userState.stakeContractApproved
    },
    stakeContract() {
      return this.$store.state.web3.stakeContractInstance()
    },
    recordContract() {
      return this.$store.state.web3.recordContractInstance()
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.item
  margin-bottom: 4rem

.contract button
  white-space: normal

.stake-buttons
  display: flex
  flex-direction: column

  button
    margin-bottom: 1rem

  @media screen and (min-width: 675px)
    flex-direction: row

    button
      margin-right: 1rem
</style>
