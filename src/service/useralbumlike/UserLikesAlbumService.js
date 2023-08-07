/* eslint-disable no-undef */
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
    // console.log("CacheService",cacheService);
  }

  likeAlbum = async (userId, albumId) => {
    const id = `user-album-like${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes values ($1, $2, $3)",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("User gagal like album");
    }

    await this._cacheService.delete(`album-like:${albumId}`);
  };

  unlikeAlbum = async (userId, albumId) => {
    console.log("User ID:", userId);
    console.log("Album ID:", albumId);

    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    try {
      const result = await this._pool.query(query);
      console.log("Result:", result);

      if (!result.rowCount) {
        throw new NotFoundError("User gagal unlike album");
      }

      await this._cacheService.delete(`album-like:${albumId}`);
    } catch (error) {
      console.error("Error in unlikeAlbum:", error);
      throw error;
    }
  };

  getAlbumLike = async (albumId) => {
    try {
      const result = await this._cacheService.get(`album-like:${albumId}`);
      return {
        likes: JSON.parse(result),
        from: "cache",
      };
    } catch {
      const query = {
        text: "SELECT * FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `album-like:${albumId}`,
        JSON.stringify(result.rowCount),
        1800
      );
      return {
        likes: result.rowCount,
      };
    }
  };

  async verifyAlbumLike(id, userId) {
    const query = {
      text: `SELECT * FROM user_album_likes
      WHERE EXISTS (
        SELECT 1 FROM albums
        WHERE albums.id = user_album_likes.album_id AND albums.id = $1
      )
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = user_album_likes.user_id AND users.id = $2
      )`,
      values: [id, userId],
    };
    const result = await this._pool.query(query);
    console.log(result);

    if (result.rowCount > 0) {
      throw new InvariantError("User sudah menyukai album");
    }
  }
}

module.exports = UserAlbumLikesService;
