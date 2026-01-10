import React, { useState, useEffect } from 'react';
import { Container, Button, ListGroup } from 'react-bootstrap';
import { usePlayer } from '../context/PlayContext';
import apiClient from '../api/axios'; // Import API client đã tạo

const HomePage = () => {
  const [songs, setSongs] = useState([]);
  const { playSong } = usePlayer();

  // Gọi API để lấy danh sách bài hát
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/songs/getsongs');
        if( !response.ok){
          throw new Error('Lỗi khi lấy danh sách bài hát');
        }
        const data = await response.json();
        setSongs(data);
        console.log("Da import bai hai thanh cong");
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát:", error);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (song, index) => {
    // Gọi hàm playSong với bài hát, toàn bộ danh sách, và vị trí của bài hát
    playSong(song, songs, index);
  };

  return (
    <Container className="mt-4">
      <h2>Danh sách bài hát</h2>
      <ListGroup>
        {songs.map((song, index) => (
          <ListGroup.Item key={song._id} className="d-flex justify-content-between align-items-center">
            {song.title} - {song.artist}
            <Button variant="success" onClick={() => handlePlay(song, index)}>
              Play
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default HomePage;