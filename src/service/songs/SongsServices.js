/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");

class SongServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = "song-" + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Data songs tidak dapat ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(requestParam) {
    const { title, performer } = requestParam || {};

    let query;
    let values;

    if (title && performer) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2",
        values: ["%" + title + "%", "%" + performer + "%"],
      };
    } else if (title) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1",
        values: ["%" + title + "%"],
      };
    } else if (performer) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE performer ILIKE $1",
        values: ["%" + performer + "%"],
      };
    } else {
      query = {
        text: "SELECT id, title, performer FROM songs",
      };
    }

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT id, title, year, performer, genre, duration, album_id FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return mapDBToModel(result.rows[0]);
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbaharui songs. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = SongServices;
