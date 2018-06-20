<template>
  <div>
    <app-header title="Coming Soon" />
    <h5 class="mb-5">Upcoming partnerships and features</h5>
    <b-card-group deck>
      <div class="feature-card" v-for="feature in features" :key="feature.description">
        <a
          :href="feature.url"
          target="_blank"
          @click="clickPartner(feature.url)"
        >
          <b-card
          >
            <img :src="feature.image" />
            <p class="card-text" slot="footer">{{ feature.description }}</p>
          </b-card>
        </a>
      </div>
    </b-card-group>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import AppHeader from '../components/AppHeader'
import laLogo from '../assets/images/features/la-logo.png'
import amLogo from '../assets/images/features/am-logo.png'
import vmsLogo from '../assets/images/features/vms-logo.png'
import clLogo from '../assets/images/features/cl-logo.png'
import oilPainting from '../assets/images/features/oil-painting.png'
import maecenas from '../assets/images/features/maecenas.png'

export default {
  name: 'features-view',
  components: {
    AppHeader,
  },
  created() {
    EventBus.$emit('events:view-coming-soon-page')
  },
  methods: {
    clickPartner(url) {
      EventBus.$emit('events:click-partner-link', { url })
    },
  },
  data() {
    return {
      features: [
        {
          description: 'Automatically fill your collection with pieces purchased through Live Auctioneers',
          image: laLogo,
          url: 'https://liveauctioneers.com',
        },
        {
          description: 'Get appraisals for individual pieces or for your entire collection from the experts at Value My Stuff',
          image: vmsLogo,
          url: 'https://www.valuemystuff.com',
        },
        {
          description: 'Automatically fill your collection with pieces purchased from auction houses using Auction Mobility software',
          image: amLogo,
          url: 'https://auctionmobility.com',
        },
        {
          description: 'Democratize your collection using Maecenas\' cutting edge blockchain technology',
          image: maecenas,
          url: 'https://www.maecenas.co/',
        },
        {
          description: 'Discover top rated art service companies with the Clarion List',
          image: clLogo,
          url: 'https://www.clarionlist.com/',
        },
        {
          description: 'Manage your art collection natively on Codex Viewer without having to setup your online blockchain wallet',
          image: oilPainting,
        },
      ],
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.feature-card
  width: 30%
  margin-bottom: 2rem
  font-weight: bold
  color: $color-dark

  a
    text-decoration: none
    cursor: pointer
    color: $color-dark

.card-title
  color: $color-dark

.card
  min-height: 30rem

.card-body
  display: flex
  flex-direction: column
  justify-content: center

img
  width: 100%
</style>
