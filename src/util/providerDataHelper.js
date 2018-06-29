export default {

  providerDataDelimeter: '::',

  encode(...args) {
    // allow an array or a list of arguments to be passed in
    const providerData = (Object.prototype.toString.call(args[0]) === '[object Array]') ? args[0] : args

    // there's no need to hex encode this string since web3 does that internally
    return providerData.join(this.providerDataDelimeter)
  },

}
