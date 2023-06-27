/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
// require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./service/albums/AlbumService');
const AlbumValidator = require('./validator/albums/index');
const songs = require('./api/songs');
const SongsService = require('./service/songs/SongsService');
const SongsValidator = require('./validator/songs/index');

const init = async () => {
  const albumService = new AlbumService();
  const albumValidator =  AlbumValidator;
  const songsService = new SongsService();
  const songsValidator = SongsValidator;
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: albumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songsValidator,
      },
    },
  ]);
  

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
