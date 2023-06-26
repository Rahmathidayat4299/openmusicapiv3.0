/* eslint-disable no-undef */
// Import dependencies
const {
    createAlbumHandler,
    getAlbumHandler,
    updateAlbumHandler,
    deleteAlbumHandler
  } = require('./handler');
  
  const routes = [
    {
      method: 'POST',
      path: '/albums',
      handler: createAlbumHandler
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: getAlbumHandler
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: updateAlbumHandler
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: deleteAlbumHandler
    }
  ];
  
  module.exports = routes;
  