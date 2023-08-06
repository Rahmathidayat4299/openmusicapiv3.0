/* eslint-disable no-undef */
class UserAlbumLikeHandler {
    constructor(userLikesAlbumService, albumServices) {
      this._userLikesAlbumService = userLikesAlbumService;
      this._albumServices = albumServices;
      console.log("albumservice",albumServices);
      console.log("useralbumlikeservice",userLikesAlbumService);

    }
  
    async postUserAlbumLikeHandler(request, h) {
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;
  
      await this._albumServices.getAlbumById(albumId);
      const alreadyLike = await this.userLikesAlbumService.verifyAlbumLike(credentialId, albumId);
  
      if (!alreadyLike) {
        await this._userLikesAlbumService.likeAlbum(credentialId, albumId);
      } else {
        await this._userLikesAlbumService.unlikeAlbum(credentialId, albumId);
      }
  
      const response = h.response({
        status: 'success',
        message: 'Berhasil like/unlike albums',
      });
      response.code(201);
      return response;
    }
  
    async getUserAlbumLikeHandler(request, h) {
      const { id } = request.params;
  
      await this._albumServices.getAlbumById(id);
  
      const { likes, from } = await this._userLikesAlbumService.getAlbumLike(id);
  
      if (from === 'cache') {
        const response = h.response({
          status: 'success',
          data: {
            likes,
          },
        });
        response.code(200);
        response.header('X-Data-Source', from);
        return response;
      }
  
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.code(200);
      return response;
    }
  }
  
  module.exports = UserAlbumLikeHandler;