/* eslint-disable no-undef */
const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: handler.postSongToPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: handler.getSongFromPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: handler.deleteSongFromPlaylistHandler,
        options: {
            auth: 'openmusicapi_jwt',
        },
    }
];

module.exports = routes;