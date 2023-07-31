/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    // console.log('PlaylistHandler - Service:', this._service);
    // console.log('PlaylistHandler - Validator:', this._validator);
  }

  postPlaylistHandler = async (request, h) => {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });
    const response = h.response({
      status: "success",
      message: "Playlist berhasil ditambahkan",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  };

  getPlaylistHandler = async (request, h) => {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    const response = h.response({
      status: "success",
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  };

  deletePlaylistHandler = async (request, h) => {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    const response = h.response({
      status: "success",
      message: "Playlist berhasil dihapus",
    });
    response.code(200);
    return response;
  };

  postSongToPlaylistHandler = async (request, h) => {
    this._validator.validateSongPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const songExists = await this._service.checkIfSongExists(songId);
    if (!songExists) {
      const response = h.response({
        status: "fail",
        message: "Lagu dengan songId yang diberikan tidak ditemukan.",
      });
      response.code(404);
      return response;
    }

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);
    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
    response.code(201);
    return response;
  };
  getSongFromPlaylistHandler = async (request, h) => {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const songs = await this._service.getSongsFromPlaylist(playlistId);

    const playlistDetails = await this._service.getPlaylistDetails(playlistId);

    const response = h.response({
      status: "success",
      data: {
        playlist: {
          id: playlistId,
          name: playlistDetails.name,
          username: playlistDetails.username,
          songs,
        },
      },
    });
    response.code(200);
    return response;
  };

  deleteSongFromPlaylistHandler = async (request, h) => {
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    });
    response.code(200);
    return response;
  };
}

module.exports = PlaylistHandler;
