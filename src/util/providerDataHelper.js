import hexHelper from './hexHelper'

export default {

  providerDataDelimeter: '::',

  decode(providerData) {
    return hexHelper.decode(providerData.substr(2)).split(this.providerDataDelimeter)
  },

  encode(...args) {
    // allow an array or a list of arguments to be passed in
    const providerData = (Object.prototype.toString.call(args[0]) === '[object Array]') ? args[0] : args
    const hexString = hexHelper.encode(providerData.join(this.providerDataDelimeter))
    return `0x${hexString}`
  },

}
