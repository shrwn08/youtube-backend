import express from 'express';
import {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  reorderPlaylist
} from '../controllers/playlist.controllers.js';
import verifyToken from '../utils/verification.utils.js';

const playlistRoutes = express.Router();

// Create new playlist
playlistRoutes.post('/', verifyToken, createPlaylist);

// Get user's playlists
playlistRoutes.get('/my-playlists', verifyToken, getMyPlaylists);

// Get specific playlist by ID (with videos populated)
playlistRoutes.get('/:playlistId', getPlaylistById);

// Update playlist details (title, description, visibility)
playlistRoutes.put('/:playlistId', verifyToken, updatePlaylist);

// Delete playlist
playlistRoutes.delete('/:playlistId', verifyToken, deletePlaylist);

// Add video to playlist
playlistRoutes.post('/:playlistId/videos/:videoId', verifyToken, addVideoToPlaylist);

// Remove video from playlist
playlistRoutes.delete('/:playlistId/videos/:videoId', verifyToken, removeVideoFromPlaylist);

// Reorder videos in playlist
playlistRoutes.patch('/:playlistId/reorder', verifyToken, reorderPlaylist);

export default playlistRoutes;