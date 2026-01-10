// frontend service should not import backend route modules

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };
  
  /**
   * Tạo một playlist mới
   * @param {object} playlistData
   *  - Dữ liệu cho playlist mới, ví dụ: { name: 'Nhạc Chill', description: '...' }
   */
  export const createPlaylist = async (playlistData) => {
    const response = await fetch('/api/playlists/createplaylist', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(playlistData)
    });
    if (!response.ok) throw new Error('Failed to create playlist');
    return response.json();
  };
  
  /**
   * Lấy thông tin chi tiết của một playlist bằng ID
   * @param {string} playlistId - ID của playlist cần lấy
   */
  export const getPlaylistById = async (playlistId) => {
    // Với GET request, ta thường gửi ID qua query parameter
    const response = await fetch(`/api/playlists/getplaylistbyid?id=${playlistId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch playlist');
    return response.json();
  };
  
  /**
   * Thêm một bài hát vào playlist
   * @param {string} playlistId - ID của playlist
   * @param {string} songId - ID của bài hát cần thêm
   */
  export const addSongToPlaylist = async (playlistId, songId) => {
    const response = await fetch('/api/playlists/addSong', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ playlistId, songId })
    });
    if (!response.ok) throw new Error('Failed to add song to playlist');
    return response.json();
  };
  
  /**
   * Xóa một bài hát khỏi playlist
   * @param {string} playlistId - ID của playlist
   * @param {string} songId - ID của bài hát cần xóa
   */
  export const removeSongFromPlaylist = async (playlistId, songId) => {
    const response = await fetch('/api/playlists/removeSong', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ playlistId, songId })
    });
    if (!response.ok) throw new Error('Failed to remove song from playlist');
    return response.json();
  };
  export const getMyPlaylists = async () => {
    const response = await fetch('/api/playlists', { // Gọi đến GET /api/playlists
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch your playlists');
    return response.json();
  };