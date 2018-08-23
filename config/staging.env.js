module.exports = {
  NODE_ENV: '"production"',
  TARGET_ENV: '"staging"',
  ANALYTICS_PROVIDER: '"mixpanel"',
  MIXPANEL_TOKEN: `"${process.env.STAGING_MIXPANEL_TOKEN || ''}"`,
  FRESHCHAT_API_TOKEN: `"${process.env.FRESHCHAT_API_TOKEN || ''}"`,
  METADATA_PROVIDER_ID: `"${process.env.METADATA_PROVIDER_ID || ''}"`,
  GA_ID: `"${process.env.GA_ID || ''}"`,
}
