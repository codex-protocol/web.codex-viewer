module.exports = {
  NODE_ENV: '"production"',
  TARGET_ENV: '"staging"',
  ANALYTICS_PROVIDER: '"mixpanel"',
  MIXPANEL_TOKEN: `"${process.env.STAGING_MIXPANEL_TOKEN || ''}"`,
  FRESHCHAT_API_TOKEN: `"${process.env.FRESHCHAT_API_TOKEN || ''}"`,
}
