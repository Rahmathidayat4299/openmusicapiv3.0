/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const ClientError = require("../../exceptions/ClientError");

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    // console.log('AlbumHandler - Service:', this._service); // Tambahkan console log di sini
    // console.log('AlbumHandler - Validator:', this._validator); // Tambahkan console log di sini
  }

  postAlbumHandler = async (request, h) => {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h
      .response({
        status: "success",
        message: "Album berhasil ditambahkan",
        data: {
          albumId,
        },
      })
      .code(201);

    return response;
  };

  getAlbumsHandler = async (request, h) => {
    const albums = await this._service.getAlbums();

    return {
      status: "success",
      data: {
        albums,
      },
    };
  };

  getAlbumByIdHandler = async (request, h) => {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    if (!album) {
      const response = h
        .response({
          status: "fail",
          message: "Album tidak ditemukan",
        })
        .code(200); // Set the status code to 200 for error response

      return response;
    }

    return {
      status: "success",
      data: {
        album,
      },
    };
  };

  putAlbumByIdHandler = async (request, h) => {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const { id } = request.params;

    await this._service.editAlbumById(id, { name, year });

    return {
      status: "success",
      message: "Album berhasil diperbarui",
    };
  };

  deleteAlbumByIdHandler = async (request, h) => {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  };
}

module.exports = AlbumHandler;
