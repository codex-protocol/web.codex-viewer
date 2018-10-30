<template>
  <span>
    <span class="hash-short">{{ shortenName(processedName) }}</span>
    <span class="hash-large">{{ processedName }}</span>
  </span>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

export default {
  name: 'DisplayName',

  props: {
    name: String,
    userObject: Object,
  },

  data() {
    const selectedName = this.userObject
      ? this.userObject.email || this.userObject.address
      : this.name

    return {
      selectedName,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('app', ['getVerifiedNameFromAddress']),

    processedName() {
      // If userObject is defined, show the full selected name instead of 'You'
      if (this.user && !this.userObject && this.selectedName === this.user.address) {
        return 'You'
      }

      return this.getVerifiedNameFromAddress(this.selectedName)
    },
  },

  methods: {
    shortenName(string) {
      if (typeof string !== 'string') {
        return null
      }

      // Enough to fit 'Logged in as xxxxxxxxxxxx@gmail.com' in the mobile nav bar
      if (string.length <= 24) {
        return string
      }

      let formattedString = string
      const beginning = string.substring(0, 6)
      const end = string.substring(string.length - 4)
      formattedString = `${beginning}…${end}`

      return formattedString
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.hash-short

  @media screen and (min-width: $breakpoint-xl)
    display: none

.hash-large
  display: none

  @media screen and (min-width: $breakpoint-xl)
    display: inline-block

</style>
