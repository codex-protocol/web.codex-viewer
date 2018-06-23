module.exports = {
  NODE_ENV: '"production"',
  TARGET_ENV: '"production"',
  ANALYTICS_PROVIDER: '"mixpanel"',
  MIXPANEL_TOKEN: `"${process.env.PRODUCTION_MIXPANEL_TOKEN || ''}"`,
  FRESHCHAT_API_TOKEN: `"${process.env.FRESHCHAT_API_TOKEN || ''}"`,
}
