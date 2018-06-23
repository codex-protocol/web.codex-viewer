import callApi from './callApi'

export default {
  getAllEligibleGiveaways: () => {
    const requestOptions = {
      method: 'get',
      url: '/giveaways',
    }

    return callApi(requestOptions)
  },

  participateInGiveaway: (giveawayId) => {
    const requestOptions = {
      method: 'get',
      url: `/user/giveaway/${giveawayId}`,
    }

    return callApi(requestOptions)
  },

  // Admin functions
  createNewGiveaway: () => {
    const requestOptions = {
      method: 'post',
      url: '/giveaways',
    }

    return callApi(requestOptions)
  },
}
