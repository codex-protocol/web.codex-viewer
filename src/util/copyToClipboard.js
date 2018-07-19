// this method sets the user's clipboard to the specified text via these steps:
//
//  1. create an "invisible" textarea
//  2. set it's value to the specified text
//  3. inject it into the DOM
//  4. select the entire contents
//  5. copy the contents to the clipboard
//  6. remove it from the DOM

import EventBus from './eventBus'

export default (text, toastMessage = 'Text copied to clipboard!') => {

  if (!document.execCommand) {
    // eslint-disable-next-line no-alert
    prompt('Your browser does not support clipboard access. Please copy the text below manually:', text)
  }

  const copyTarget = document.createElement('textarea')

  copyTarget.value = text

  // @NOTE: the opacity is probably unnecessary since the element will be hidden
  //  behind the #app container since it has a negative z-index, but I've added
  //  it for good measure
  copyTarget.style.opacity = '0'
  copyTarget.style.zIndex = '-9999'
  copyTarget.style.position = 'absolute'

  document.body.appendChild(copyTarget)

  copyTarget.focus()
  copyTarget.setSelectionRange(0, copyTarget.value.length)

  document.execCommand('copy')

  document.body.removeChild(copyTarget)

  EventBus.$emit('toast:success', toastMessage, 5000)

}
