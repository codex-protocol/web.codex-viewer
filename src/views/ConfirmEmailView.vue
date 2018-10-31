<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo">
          <b-link href="/" replace>
            <img src="../assets/logos/codex/gold.svg" />
          </b-link>
        </div>

        <h1>{{ headerText }}</h1>
        <div class="lead">{{ bodyText }}</div>

        <b-button
          size="sm"
          variant="link"
          class="pl-0 pr-0"
          v-b-modal.resendConfirmationEmailModal
        >
          {{ buttonText }}
        </b-button>

        <ResendConfirmationEmailModal :default-email="emailAddressToConfirm" />

        <b-button
          size="sm"
          variant="link"
          class="pl-0 pr-0"
          @click.prevent="confirmEmail"
          v-if="showManualConfirm && emailAddressToConfirm"
        >
          Confirm email
        </b-button>

      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" v-party-mode-activator /></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import config from '../util/config'
import EmailConfirmation from '../util/api/emailConfirmation'

import ResendConfirmationEmailModal from '../components/modals/ResendConfirmationEmailModal'

export default {

  name: 'ConfirmEmailView',

  components: {
    ResendConfirmationEmailModal,
  },

  data() {
    return {
      headerText: 'Confirm Your Email Address',
      buttonText: 'Didn\'t receive a confirmation email?',
      bodyText: 'Please check your email for a confirmation link from Codex Protocol. Once your email is confirmed, you\'ll automatically be logged into the Codex Registry.',
      showManualConfirm: config.showManualConfirm,
    }
  },

  computed: {
    ...mapState('app', ['apiError', 'emailAddressToConfirm']),
  },

  created() {
    // remove email from the query params if specified
    if (this.$route.query.email) {
      this.$store.commit('app/SET_EMAIL_ADDRESS_TO_CONFIRM', this.$route.query.email)
      this.$router.replace({ name: this.$route.name })
    }
  },

  mounted() {
    if (this.apiError) {
      this.buttonText = 'Resend Confirmation Email?'
      this.headerText = 'Could Not Confirm Your Email Address'
      this.bodyText = 'There was an error while confirming your email address.'
    }
  },

  methods: {
    confirmEmail() {
      EmailConfirmation.confirm(this.emailAddressToConfirm)
        .then(() => {
          this.$router.replace('/')
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.logo
  max-width: 100px
  margin-bottom: 2.5rem
  margin-top: 2.5rem

h1
  font-weight: bold
  font-family: $font-family-serif

.lead
  margin-bottom: 3rem

.login-art img
  width: 100%
  margin-top: 3rem

</style>
