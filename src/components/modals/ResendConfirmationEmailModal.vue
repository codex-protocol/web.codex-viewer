<template>
  <b-modal
    ok-title="Send"
    @hidden="reset"
    v-model="modalVisible"
    cancel-variant="outline-primary"
    id="resendConfirmationEmailModal"
    title="Resend Confirmation Email"
    @ok="resendConfirmationEmail(emailAddress)"
  >
    <b-form-group
      label-size="sm"
      label-for="emailAddress"
      label="Email Address"
    >
      <b-form-input
        required
        class="mb-4"
        id="emailAddress"
        v-model="emailAddress"
      />
    </b-form-group>
  </b-modal>
</template>

<script>

import debug from 'debug'

import EventBus from '../../util/eventBus'
import EmailConfirmation from '../../util/api/emailConfirmation'

const logger = debug('app:component:resend-confirmation-email-modal')

export default {

  name: 'ResendConfirmationEmailModal',

  props: {
    defaultEmail: String,
  },

  data() {
    return {
      modalVisible: false,
      emailAddress: this.defaultEmail,
    }
  },

  methods: {
    reset() {
      this.emailAddress = this.defaultEmail
    },

    resendConfirmationEmail(emailAddress) {

      if (!emailAddress) {
        this.hide()
        return
      }

      EventBus.$emit('events:resend-confirmation-email-dialog', this)

      EmailConfirmation.resend(emailAddress)
        .then(() => {
          EventBus.$emit('toast:success', 'Confirmation email has been re-sent!', 5000)
          this.modalVisible = false
        })
        .catch((error) => {
          logger('Could not resend confirmation email:', error)
          EventBus.$emit('toast:error', 'Could not resend confirmation email.')
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
