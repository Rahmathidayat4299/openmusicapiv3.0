/* eslint-disable no-undef */
// Import dependencies
const albums = require('./albums'); // Assuming you have a module to handle album operations

// Handler for POST /albums
const createAlbumHandler = (request, h) => {
  const { name, year } = request.payload;

  // Add album logic here, assuming the function `addAlbum` exists in the `albums` module
  const albumId = albums.addAlbum(name, year);

  return h.response({
    status: 'success',
    data: {
      albumId: albumId
    }
  }).code(201);
};

// Handler for GET /albums/{id}
const getAlbumHandler = (request, h) => {
  const albumId = request.params.id;

  // Get album logic here, assuming the function `getAlbum` exists in the `albums` module
  const album = albums.getAlbum(albumId);

  if (!album) {
    return h.response({
      status: 'fail',
      message: 'Album not found'
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      album: album
    }
  }).code(200);
};

// Handler for PUT /albums/{id}
const updateAlbumHandler = (request, h) => {
  const albumId = request.params.id;
  const { name, year } = request.payload;

  // Update album logic here, assuming the function `updateAlbum` exists in the `albums` module
  albums.updateAlbum(albumId, name, year);

  return h.response({
    status: 'success',
    message: 'Album updated successfully'
  }).code(200);
};

// Handler for DELETE /albums/{id}
const deleteAlbumHandler = (request, h) => {
  const albumId = request.params.id;

  // Delete album logic here, assuming the function `deleteAlbum` exists in the `albums` module
  albums.deleteAlbum(albumId);

  return h.response({
    status: 'success',
    message: 'Album deleted successfully'
  }).code(200);
};

module.exports = {
  createAlbumHandler,
  getAlbumHandler,
  updateAlbumHandler,
  deleteAlbumHandler
};
