const formatDate = date => (new Date(date)).toLocaleString()

// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000)

  let interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return `${interval} days`
  } else if (interval === 1) {
    return `${interval} day`
  }

  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return `${interval} hours`
  } else if (interval === 1) {
    return `${interval} hour`
  }

  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return `${interval} minutes`
  }

  return `${Math.floor(seconds)} seconds`
}

export {
  formatDate,
  timeSince,
}
