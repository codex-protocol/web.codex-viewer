import callApi from './callApi'

export default {
  getGalleries: () => {
    const requestOptions = {
      method: 'get',
      url: '/galleries',
    }

    return callApi(requestOptions)
  },

  getUserGalleries: () => {
    const requestOptions = {
      method: 'get',
      url: '/user/galleries',
    }

    return callApi(requestOptions)
  },

  getGallery: (galleryShareCode) => {
    const requestOptions = {
      method: 'get',
      url: `/galleries/${galleryShareCode}`,
    }

    return callApi(requestOptions)
  },

  createGallery: (metadata) => {
    const requestOptions = {
      method: 'post',
      url: '/users/galleries',
      data: metadata,
    }

    return callApi(requestOptions)
  },

  updateGallery: (galleryId, galleryData) => {
    const requestOptions = {
      method: 'put',
      url: `/users/galleries/${galleryId}`,
      data: galleryData,
    }

    return callApi(requestOptions)
  },

  deleteGallery: (galleryId) => {
    const requestOptions = {
      method: 'delete',
      url: `/users/galleries/${galleryId}`,
    }

    return callApi(requestOptions)
  },

}
