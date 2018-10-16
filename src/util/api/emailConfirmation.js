import callApi from './callApi'

export default {
  resend: (email) => {
    const requestOptions = {
      method: 'post',
      url: '/email-confirmation/resend',
      data: {
        email,
      },
    }

    return callApi(requestOptions)
  },
}
