<template>
  <div class="mb-5" v-if="personalStakes[0]">
    <p>Your stakes</p>

    <div class="table">
      <div class="table-header">Actual amount</div>
      <div
        v-for="(property, index) in personalStakes[1]"
        :style="{ order: index }"
        :key="'actualAmount' + index"
      >
        {{ formatTokenAmount(property) }} CODX
      </div>

      <div class="table-header addresses">Staked for</div>
      <div
        class="addresses"
        v-for="(property, index) in personalStakes[2]"
        :style="{ order: index }"
        :key="'stakedFor' + index"
      >
        <hash-formatter :data="property" />
      </div>

      <div class="table-header">Unlock date</div>
      <div
        v-for="(property, index) in personalStakes[0]"
        :style="{ order: index }"
        :key="'unlockDate' + index"
      >
        {{ (new Date(parseInt(property) * 1000)).toLocaleDateString() }}
      </div>
    </div>
  </div>
</template>

<script>
import formatTokenAmount from '../util/formatTokenAmount'
import HashFormatter from './HashFormatter'


export default {
  name: 'personal-stakes-table',
  props: ['personalStakes'],
  components: {
    HashFormatter,
  },
  methods: {
    formatTokenAmount(rawAmount) {
      return formatTokenAmount(rawAmount)
    },
  },
}
</script>

<style lang="stylus" scoped>
.table
  display: flex
  flex-wrap: wrap
  text-align: center

  div
    width: 30%

  .addresses
    width: 40%

.table-header
  order: -1
</style>
