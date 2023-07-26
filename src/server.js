/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
require("dotenv").config();
const Hapi = require("@hapi/hapi");
//jwt
const Jwt = require("@hapi/jwt");
//album
const albums = require("./api/albums");
const AlbumService = require("./service/albums/AlbumServices");
const AlbumValidator = require("./validator/albums/index");
//songs
const songs = require("./api/songs");
const SongsService = require("./service/songs/SongsServices");
const SongsValidator = require("./validator/songs/index");

//user
const users = require("./api/user");
const UsersService = require("./service/users/UsersService");
const UsersValidator = require("./validator/user");
const ClientError = require("./exceptions/ClientError");

//authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./service/authentications/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

//playlist
const playlists = require("./api/playlists");
// const playlistsService = require('./service/playlists/PlaylistsServices');
const PlaylistsServices = require("./service/playlists/PlaylistsServices");
const PlaylistValidator = require("./validator/playlists");

//collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./service/collaborations/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");
const init = async () => {
  const albumService = new AlbumService();
  const albumValidator = AlbumValidator;
  const songsService = new SongsService();
  const songsValidator = SongsValidator;
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsServices = new PlaylistsServices(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
      // eslint-disable-next-line no-else-return
    } else if (response instanceof Error) {
      const { statusCode, payload } = response.output;
      if (statusCode === 401) {
        return h.response(payload).code(401);
      }
      const newResponse = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      console.log(response);
      newResponse.code(500);
      return newResponse;
    }
    return response.continue || response;
  });

  // server.ext("onPreResponse", (request, h) => {
  //   // Mendapatkan konteks response dari request
  //   console.log();
  //   const { response } = request;
  //   if (response instanceof Error) {
  //     console.log(response);
  //     // Penanganan client error secara internal.
  //     if (response instanceof ClientError) {
  //       const newResponse = h.response({
  //         status: "fail",
  //         message: response.message,
  //       });
  //       newResponse.code(response.statusCode);
  //       return newResponse;
  //     }
  //     // Mempertahankan penanganan client error oleh Hapi secara native, seperti 404, dll.
  //     if (!response.isServer) {
  //       return h.continue;
  //     }
  //     // Penanganan server error sesuai kebutuhan
  //     const newResponse = h.response({
  //       status: "error",
  //       message: "Terjadi kegagalan pada server kami",
  //     });
  //     newResponse.code(500);
  //     return newResponse;
  //   }
  //   // Jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
  //   return h.continue;
  // });
  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("openmusicapi_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsServices,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsServices,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
