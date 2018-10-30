<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Coming Soon" />
        <h5 class="mb-5">Upcoming extensions and features</h5>
        <b-card-group deck>
          <div class="deck-item" v-for="feature in features" :key="feature.description">
            <a
              :href="feature.url"
              target="_blank"
              @click="clickPartner(feature.url)"
            >
              <b-card>
                <img :src="feature.image" />
                <p class="card-text" slot="footer">{{ feature.description }}</p>
              </b-card>
            </a>
          </div>
        </b-card-group>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/core/AppHeader'
import laLogo from '../assets/images/features/la-logo.png'
import amLogo from '../assets/images/features/am-logo.png'
import vmsLogo from '../assets/images/features/vms-logo.png'
import clLogo from '../assets/images/features/cl-logo.png'
import oilPainting from '../assets/images/features/oil-painting.png'
import maecenas from '../assets/images/features/maecenas.png'

export default {
  name: 'FeatureListView',

  components: {
    AppHeader,
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

.card-deck
  display: flex
  flex-wrap: wrap
  margin-left: 0
  margin-right: 0

.deck-item
  flex: none
  min-width: 240px
  margin-bottom: 1rem
  margin-top: 1rem
  border: none
  cursor: pointer
  border-radius: 0 0 .25rem .25rem
  font-weight: bold
  color: $color-dark

  @media screen and (min-width: $breakpoint-sm)
    max-width: calc(100% * 1/2)

  @media screen and (min-width: $breakpoint-md)
    max-width: calc(100% * 1/3)

  @media screen and (min-width: $breakpoint-lg)
    max-width: calc(100% * 1/4)

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

.card-footer
  padding-top: 1rem
  height: 12rem

img
  width: 100%
</style>
