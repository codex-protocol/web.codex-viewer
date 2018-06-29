export default {

  providerDataDelimeter: '::',

  encode(...args) {
    // allow an array or a list of arguments to be passed in
    const providerData = (Object.prototype.toString.call(args[0]) === '[object Array]') ? args[0] : args
    return providerData.join(this.providerDataDelimeter)
  },

}
