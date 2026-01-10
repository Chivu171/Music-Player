// pages/LibraryPage.js (Đã sửa)

import React, { useEffect, useState } from 'react';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
// 👇 Sửa dòng import này
import { getMyPlaylists } from '../services/playListService';

function LibraryPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // Hàm này giờ đã tồn tại và hoạt động đúng
        const data = await getMyPlaylists();
        setPlaylists(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2>Thư viện của bạn</h2>
      {playlists.length > 0 ? (
        <ListGroup>
          {playlists.map(playlist => (
            <ListGroup.Item key={playlist._id} action href={`/playlist/${playlist._id}`}>
              {playlist.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Bạn chưa có playlist nào. Hãy tạo một cái!</p>
      )}
    </div>
  );
}

export default LibraryPage;