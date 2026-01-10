import React from 'react';
import { usePlayer } from '../context/PlayContext';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPlay, FaPause,FaVolumeUp,FaVolumeDown, FaStepForward,FaStepBackward, FaTimes } from 'react-icons/fa'; // Cài đặt: npm install react-icons


const Player = () =>{
  const { 
    currentSong, 
    isPlaying, 
    togglePlay,
    progress,
    duration,
    currentTime,
    seek,
    volume,
    changeVolume,
    formatTime,
    playNext,
    playPrevious,
    setShowPlayer
  } = usePlayer();    // Nếu không có bài hát nào đang được chọn, không hiển thị gì cả
    if(!currentSong) return null;
    const handleSeek = (e) => {
      const seekTime = (e.target.value / 100) * duration;
      seek(seekTime);
  }
    
    return (
      <div className="player-bar fixed-bottom bg-dark text-white p-3">
      <Container fluid>
        <Row className="align-items-center">
          {/* Nút đóng */}
          <Col md={1}>
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={() => setShowPlayer(false)}
              className="p-1"
            >
              <FaTimes />
            </Button>
          </Col>
          
          {/* Thông tin bài hát */}
          <Col md={2}>
            <h6>{currentSong.title}</h6>
            <p className="mb-0 text-muted">{currentSong.artist}</p>
          </Col>
          
          {/* Nút điều khiển và thanh tiến trình */}
          <Col md={6} className="d-flex flex-column align-items-center">
             {/* Nút điều khiển */}
             <div className="d-flex align-items-center">
             <Button variant="outline-light" onClick={playPrevious} className="mx-2 mb-2">
               <FaStepBackward />
             </Button>
            <Button variant="outline-light" onClick={togglePlay} className="mx-2 mb-2">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <Button variant="outline-light" onClick={playNext} className="mx-2 mb-2">
              <FaStepForward />
            </Button>
            </div>
            
            {/* Thanh tiến trình */}
            <div className="d-flex align-items-center w-100">
                <span>{formatTime(currentTime)}</span>
                <input 
                    type="range" 
                    className="form-range mx-2"
                    value={progress}
                    onChange={handleSeek}
                />
                <span>{formatTime(duration)}</span>
            </div>
          </Col>

          {/* Âm lượng */}
          <Col md={3} className="d-flex align-items-center justify-content-end">
             <FaVolumeUp className="me-2" />
             <input 
                type="range" 
                className="form-range w-50"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(e.target.value)}
             />
          </Col>
        </Row>
      </Container>
    </div>
      );
    };
    
    export default Player;