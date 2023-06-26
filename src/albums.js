/* eslint-disable no-undef */
// albums.js

// Sample array to store albums
const albums = [];

// Function to add an album
const addAlbum = (name, year) => {
  const albumId = albums.length + 1;
  const album = {
    albumId,
    name,
    year,
  };
  albums.push(album);
  return albumId;
};

// Function to get an album by ID
const getAlbum = (albumId) => {
  return albums.find((album) => album.albumId == albumId);
};

// Function to update an album
const updateAlbum = (albumId, name, year) => {
  const album = getAlbum(albumId);
  if (album) {
    album.name = name;
    album.year = year;
  }
};

// Function to delete an album
const deleteAlbum = (albumId) => {
  const index = albums.findIndex((album) => album.albumId == albumId);
  if (index !== -1) {
    albums.splice(index, 1);
  }
};

module.exports = {
  addAlbum,
  getAlbum,
  updateAlbum,
  deleteAlbum,
};
