<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="theViewBox"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title :id="iconName" lang="en">{{iconName}} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script>

const getViewBox = (iconName) => {
  switch (iconName) {
    case 'github':
    case 'telegram':
      return '0 0 496 512'
    case 'medium':
    case 'twitter':
      return '0 0 512 512'
    default:
      return '0 0 18 18'
  }
}

export default {
  props: {
    iconName: {
      type: String,
    },
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
    viewBox: {
      type: [String],
      default: '0 0 18 18',
    },
    iconColor: {
      type: String,
      default: 'currentColor',
    },
  },
  computed: {
    theViewBox() {
      return getViewBox(this.iconName)
    },
  },
}
</script>
