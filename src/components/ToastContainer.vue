<template>
  <div class="toast-container">
    <div
      v-for="(toast, index) in toasts" :key="index"
      @click="typeof toast.clickHandler === 'function' ? toast.clickHandler.call(toast, toast) : undefined"
      :class="[
        'toast',
        'alert',
        'alert-dismissible',
        `alert-${types[toast.type] || 'info'}`,
        typeof toast.clickHandler === 'function' ? 'clickable' : undefined
      ]"
    >
      <span class="toast-text">{{toast.text}}</span>
      <button
        type="button"
        class="close"
        aria-label="Close"
        @click.stop="removeToast(toast)"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script>

import EventBus from '../util/eventBus'

export default {
  name: 'toast-container',
  data() {
    return {
      toasts: [],

      // this maps types to bootstrap "alert" classes (they call it "danger"
      //  instead of "error", which is dumb)
      types: {
        info: 'info',
        error: 'danger',
        success: 'success',
      },
    }
  },
  methods: {
    addToast({ text, type = 'info', timeout, clickHandler }) {

      const newToast = {
        text,
        type,
        timeout,
        clickHandler,
        close: () => {
          this.removeToast(newToast)
        },
      }

      this.toasts.push(newToast)

      if (timeout) {
        setTimeout(() => {
          this.removeToast(newToast)
        }, timeout)
      }

    },

    removeToast(toast) {
      const index = this.toasts.indexOf(toast)
      if (index !== -1) this.toasts.splice(index, 1)
    },
  },
  mounted() {
    EventBus.$on('toast', (newToast) => {
      this.addToast(newToast)
    })

    Object.keys(this.types).forEach((type) => {
      EventBus.$on(`toast:${type}`, (text, timeout, clickHandler) => {
        if (typeof text === 'string') {
          this.addToast({ text, type, timeout, clickHandler })
        } else {
          this.addToast(Object.assign({ type }, text))
        }
      })
    })
  },
}

</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.toast-container
  top: 0
  right: 0
  width: 25rem
  padding: 1rem
  max-height: 100%
  position: absolute
  overflow-y: hidden
  pointer-events: none
  box-sizing: border-box

  // this brings the toasts above the modal z-index, since we need to see errors
  //  while inside of a modal... (maybe?)
  z-index: 1050

  @media screen and (max-width: $breakpoint-sm)
    width: 100%
    position: fixed

  .toast
    right: 0
    opacity: .9
    position: relative
    pointer-events: all
    border-radius: .25rem
    animation: .25s ease-out 0s slide-in
    box-shadow: 0 1rem 1rem -1rem rgba(black, .5)

    &.clickable
      cursor: pointer

    .toast-text
      word-wrap: break-word
      white-space: pre-wrap

@keyframes slide-in
  from
    right: -100%

  to
    right: 0

</style>
