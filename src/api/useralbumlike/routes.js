/* eslint-disable no-undef */
const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.postUserAlbumLikeHandler(request, h),
    options: {
      auth: "openmusicapi_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.getUserAlbumLikeHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: handler.deleteAlbumLikeHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
];

module.exports = routes;
