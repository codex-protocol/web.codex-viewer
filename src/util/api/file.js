import callApi from './callApi'

export default {
  uploadFiles: (files) => {
    const formData = new FormData()
    formData.append('files', files)

    const requestOptions = {

      method: 'post',
      url: '/users/files',

      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },

      data: formData,
    }

    return callApi(requestOptions)
  },
}
