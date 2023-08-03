/* eslint-disable no-undef */
const UploadsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService,albumServices, validator }) => {
    const uploadsHandler = new UploadsHandler(storageService,albumServices, validator);
    server.route(routes(uploadsHandler));
  },
};