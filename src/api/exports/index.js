/* eslint-disable no-undef */
const ExportsHandler = require('./handler');
const routers = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, playlistsServices, validator }) => {
    const exportHandler = new ExportsHandler(producerService, playlistsServices, validator);
    server.route(routers(exportHandler));
  },
};