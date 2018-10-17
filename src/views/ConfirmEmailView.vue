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

        <ResendConfirmationEmailModal :default-email="this.emailAddress" />

      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import EventBus from '../util/eventBus'
import ResendConfirmationEmailModal from '../components/modals/ResendConfirmationEmailModal'

export default {

  name: 'ConfirmEmailView',

  components: {
    ResendConfirmationEmailModal,
  },

  data() {
    return {
      emailAddress: null,
      headerText: 'Confirm Your Email Address',
      buttonText: 'Didn\'t receive a confirmation email?',
      bodyText: 'Please check your email for a confirmation link from Codex Protocol. Once your email is confirmed, you\'ll automatically be logged into the Codex Registry.',
    }
  },

  computed: {
    ...mapState('auth', ['apiError']),
  },

  created() {

    EventBus.$emit('events:view-confirm-email-page', this)

    // remove email from the query params if specified
    if (this.$route.query.email) {
      this.emailAddress = this.$route.query.email
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
