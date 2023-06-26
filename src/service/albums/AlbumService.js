/* eslint-disable no-undef */
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const id = "album-" + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newAlbum = {
      id,
      name,
      year,
      createdAt,
      updatedAt,
    };

    this._albums.push(newAlbum);

    const isSuccess =
      this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Gagal menambahkan album");
    }

    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(id) {
    const album = this._albums.find((a) => a.id === id);

    if (!album) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return album;
  }

  editAlbumById(id, { name, year }) {
    const albumIndex = this._albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }

    const updatedAt = new Date().toISOString();

    this._albums[albumIndex] = {
      ...this._albums[albumIndex],
      name,
      year,
      updatedAt,
    };
  }

  deleteAlbumById(id) {
    const albumIndex = this._albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundError("Gagal menghapus album. Id tidak ditemukan");
    }

    this._albums.splice(albumIndex, 1);
  }
}

module.exports = AlbumService;
