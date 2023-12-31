/* eslint-disable no-undef */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationErorr');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class PlaylistsServices {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }
 
    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
 
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };
 
        const result = await this._pool.query(query);
 
        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }
 
        return result.rows[0].id;
    }
 
    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        };
 
        const result = await this._pool.query(query);
        return result.rows;
    }
 
    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };
 
        const result = await this._pool.query(query);
 
        if (!result.rowCount) {
            throw new NotFoundError(
                'Playlist gagal dihapus. Id tidak ditemukan'
            );
        }
    }
 
    async addSongToPlaylist(playlistId, songId) {
        const id = `ps-${nanoid(16)}`;
 
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };
 
        const result = await this._pool.query(query);
 
        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
    }
 
    async getSongsFromPlaylist(playlistId) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
            LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
            WHERE playlistsongs.playlist_id = $1`,
            values: [playlistId],
        };
 
        const result = await this._pool.query(query);
 
        return result.rows;
    }
 
    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };
 
        const result = await this._pool.query(query);
 
        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal dihapus');
        }
    }
 
    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };
 
        const result = await this._pool.query(query);
 
        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
 
        const playlist = result.rows[0];
 
        if (playlist.owner !== owner) {
            throw new AuthorizationError(
                'Anda tidak berhak mengakses resource ini'
            );
        }
    }
 
    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(
                    playlistId,
                    userId
                );
            } catch {
                throw error;
            }
        }
    }
 
    async checkIfSongExists(songId) {
        const query = {
          text: 'SELECT * FROM songs WHERE id = $1',
          values: [songId],
        };
      
        const result = await this._pool.query(query);
        return result.rowCount > 0;
      }
      async getPlaylistDetails(playlistId) {
        const query = {
          text: `SELECT playlists.id, playlists.name, users.username FROM playlists
          LEFT JOIN users ON users.id = playlists.owner
          WHERE playlists.id = $1`,
          values: [playlistId],
        };
      
        const result = await this._pool.query(query);
        if (result.rows.length === 0) {
          throw new NotFoundError('Playlist tidak ditemukan');
        }
      
        return result.rows[0];
      }
      
}
 

module.exports = PlaylistsServices;