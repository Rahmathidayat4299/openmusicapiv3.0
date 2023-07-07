/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const ClientError = require("../../exceptions/ClientError");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postSongHandler = async (request, h) => {
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
  };

  getSongsHandler = async (request, h) => {
    const songs = await this._service.getSongs();

    return {
      status: "success",
      data: {
        songs,
      },
    };
  };

  getSongByIdHandler = async (request, h) => {
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
  };

  putSongByIdHandler = async (request, h) => {
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
  };

  deleteSongByIdHandler = async (request, h) => {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: "success",
      message: "Lagu berhasil dihapus",
    };
  };
}

module.exports = SongHandler;
