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
      method: 'post',
      url: `/user/giveaway/${giveawayId}`,
    }

    return callApi(requestOptions)
  },

  // Admin functions
  createNewGiveaway: () => {
    const requestOptions = {
      method: 'post',
      url: '/admin/giveaways',
    }

    return callApi(requestOptions)
  },
}
