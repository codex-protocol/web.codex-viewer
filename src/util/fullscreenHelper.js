export default {

  browserSupportsFullscreen: (
    typeof document.body.requestFullscreen === 'function' ||
    typeof document.body.mozRequestFullScreen === 'function' ||
    typeof document.body.webkitRequestFullScreen === 'function'
  ),

  requestFullscreen($element) {

    if (!this.browserSupportsFullscreen) {
      return false
    }

    if (typeof $element.requestFullscreen === 'function') {
      $element.requestFullscreen()
    } else if (typeof $element.mozRequestFullScreen === 'function') {
      $element.mozRequestFullScreen()
    } else if (typeof $element.webkitRequestFullScreen === 'function') {
      $element.webkitRequestFullScreen()
    }

    return true

  },
}
