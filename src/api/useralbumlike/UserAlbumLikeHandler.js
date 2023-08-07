/* eslint-disable no-undef */
class UserAlbumLikeHandler {
  constructor(userLikesAlbumService, albumServices) {
    this._userLikesAlbumService = userLikesAlbumService;
    this._albumServices = albumServices;
    console.log("albumservice", albumServices);
    console.log("useralbumlikeservice", userLikesAlbumService);

    if (!this._albumServices) {
      console.error("ERROR: AlbumServices not initialized properly.");
    }

    if (!this._userLikesAlbumService) {
      console.error("ERROR: UserLikesAlbumService not initialized properly.");
    }
  }

  async postUserAlbumLikeHandler(request, h) {
    console.log("Request Params:", request.params);

    const { id: credentialId } = request.auth.credentials;
    console.log("Credential ID:", credentialId);

    const { id: albumId } = request.params;
    console.log("Album ID:", albumId);
    await this._albumServices.getAlbumById(albumId);
    await this._userLikesAlbumService.verifyAlbumLike(albumId, credentialId);

    //   const alreadyLike = await this._userLikesAlbumService.verifyAlbumLike(credentialId, albumId);

    const addalbumlike = await this._userLikesAlbumService.likeAlbum(
      credentialId,
      albumId
    );

    const response = h.response({
      status: "success",
      message: "Berhasil menyukai album",
      data: {
        addalbumlike,
      },
    });
    response.code(201);
    return response;
  }

  async getUserAlbumLikeHandler(request, h) {
    const { id } = request.params;
    console.log("Album ID:", id);

    await this._albumServices.getAlbumById(id);

    const { likes, from } = await this._userLikesAlbumService.getAlbumLike(id);
    console.log("likeandfrom", likes, from);

    if (from === "cache") {
      const response = h.response({
        status: "success",
        data: {
          likes,
        },
      });
      response.code(200);
      response.header("X-Data-Source", from);
      return response;
    }

    const response = h.response({
      status: "success",
      data: {
        likes,
      },
    });
    response.code(200);
    return response;
  }
  async deleteAlbumLikeHandler(request,) {
    const { id: userId } = request.auth.credentials;
    const { id } = request.params;

    await this._userLikesAlbumService.unlikeAlbum(userId, id);
    return {
      status: "success",
      message: "Like berhasil dihapus dari album",
    };
  }
}

module.exports = UserAlbumLikeHandler;
