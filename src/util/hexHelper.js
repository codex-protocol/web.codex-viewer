// see: https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex

export default {

  decode(input) {
    return decodeURIComponent(input.replace(/(..)/g, '%$1'))
  },

  encode(input) {
    return unescape(encodeURIComponent(input.toString()))
      .split('')
      .map((character) => {
        return character.charCodeAt(0).toString(16)
      })
      .join('')
  },

}
