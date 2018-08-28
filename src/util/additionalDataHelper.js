import { Buffer } from 'buffer/'

// this is the delimiter used to separate providerId, providerMetadataId, etc
//  in additionalData strings sent to CodexRecord.mint() and
//  CodexRecord.modifyMetadataHashes() contract calls
const additionalDataDelimeter = '::'

export default {

  // this simply returns all arguments passed concatenated in a string delimited
  //  by the additionalDataDelimeter defined above
  //
  // this string should be passed to CodexRecord.mint() and
  //  CodexRecord.modifyMetadataHashes() contract calls as the additionalData
  //  parameter
  //
  // this string is decoded by the API when a Minted or Modified event is
  //  processed to determine which CodexRecordMetadata or
  //  CodexRecordMetadataPendingUpdate record to apply
  encode(...args) {
    // allow an array or a list of arguments to be passed in
    const additionalData = (Object.prototype.toString.call(args[0]) === '[object Array]') ? args[0] : args

    const hexString = Buffer
      .from(additionalData.join(additionalDataDelimeter))
      .toString('hex')

    return `0x${hexString}`
  },

}
