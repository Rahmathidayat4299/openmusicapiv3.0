/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./service/albums/AlbumServices');
const AlbumValidator = require('./validator/albums/index');
const songs = require('./api/songs');
const SongsService = require('./service/songs/SongsServices');
const SongsValidator = require('./validator/songs/index');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumService();
  const albumValidator = AlbumValidator;
  const songsService = new SongsService();
  const songsValidator = SongsValidator;
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // Mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // Penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // Mempertahankan penanganan client error oleh Hapi secara native, seperti 404, dll.
      if (!response.isServer) {
        return h.continue;
      }
      // Penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // Jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
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
