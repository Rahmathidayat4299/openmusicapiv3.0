/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const ClientError = require('../../exceptions/ClientError');
// handler.js

class UploadsHandler {
  constructor(storageService, albumServices,validator) {
    this._storageService = storageService;
    this._validator = validator;
    this._albumServices = albumServices;
    // console.log("albumServices",albumServices)
    // console.log("Services",storageService)
  }
  // postUploadImageHandler
  postUploadImageHandler = async (request, h) => {
    const { id } = request.params;
    const { cover } = request.payload;
    console.log("cover",cover.hapi.headers)
    this._validator.validateImageHeaders(cover.hapi.headers);
    
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/cover/${filename}`;
    console.log(filename);
    await this._albumServices.updateAlbumCover(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;