/* eslint-disable no-undef */
const ClientError = require("../../exceptions/ClientError");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      const response = h
        .response({
          status: "success",
          message: "Lagu berhasil ditambahkan",
          data: {
            songId,
          },
        })
        .code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);

        return response;
      }

      console.error(error);

      const response = h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);

      return response;
    }
  }

  async getSongsHandler(request, h) {
    try {
      const songs = await this._service.getSongs();
      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);

        return response;
      }

      console.error(error);

      const response = h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);

      return response;
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);

      if (!song) {
        const response = h
          .response({
            status: "fail",
            message: "Lagu tidak ditemukan",
          })
          .code(404);

        return response;
      }

      return {
        status: "success",
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);

        return response;
      }

      console.error(error);

      const response = h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);

      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;
      const { id } = request.params;

      await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      return {
        status: "success",
        message: "Lagu berhasil diperbarui",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);

        return response;
      }

      console.error(error);

      const response = h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);

      return response;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      return {
        status: "success",
        message: "Lagu berhasil dihapus",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);

        return response;
      }

      console.error(error);

      const response = h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);

      return response;
    }
  }
}

module.exports = SongHandler;
