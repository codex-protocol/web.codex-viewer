<template>
  <b-modal
    id="faucetModal"
    title="Get CODX Tokens"
    ok-title="Request Tokens"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="requestTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <p>
      To perform certain actions like creating new titles, a small fee in the form of CODX tokens is necessary. You may request free tokens to help facilitate testing by clicking the button below!
    </p>
  </b-modal>
</template>

<script>

import axios from 'axios'

export default {
  name: 'faucetModal',
  data() {
    return {
      modalVisible: false,
    }
  },
  methods: {
    requestTokens(event) {

      event.preventDefault()

      axios.get('/user/faucet')
        .then((response) => {

          if (response instanceof Error) {
            throw response
          }

          const { error } = response.data

          if (error) {
            throw error
          }

          // TODO: update their local token count and / or show notification here?

        })
        .catch((error) => {
          console.error('there was an error requesting tokens', error)
        })
        .then(() => {
          this.modalVisible = false
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
