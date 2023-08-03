/* eslint-disable no-undef */
class ExportsHandler {
  constructor(service, playlistsServices, validator) {
    this._service = service;
    this._playlistsServices = playlistsServices;
    this._validator = validator;

    // Tambahkan console log untuk memeriksa apakah playlistsServices terdefinisi atau tidak
    // console.log("playlistsServices:", playlistsServices);
    // console.log("service:", service);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsServices.verifyPlaylistOwner(playlistId, credentialId);
    // console.log("Verifying playlist owner...");
    // console.log("verifyResult:", verifyResult);
    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));
    // console.log("verifyResult:", verifyResult);

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
