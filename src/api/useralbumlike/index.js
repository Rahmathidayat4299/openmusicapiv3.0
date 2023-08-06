/* eslint-disable no-undef */
const UserAlbumLikesHandler = require('./UserAlbumLikeHandler');
const routes = require('./routes');

module.exports = {
  name: 'userAlbumLikes',
  version: '1.0.0',
  register: async (server, { userLikesAlbumService, albumServices }) => {
    const userAlbumLikesHandler = new UserAlbumLikesHandler(userLikesAlbumService, albumServices);
    server.route(routes(userAlbumLikesHandler));
  },
};