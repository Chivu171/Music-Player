import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

// Tạo Context
const PlayerContext = createContext(null);

// Tạo Provider
export const PlayerProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong,setCurrentSong] = useState(null);
    // State mới
    const [progress, setProgress] = useState(0); // Tiến trình bài hát (từ 0 đến 100)
    const [volume, setVolume] = useState(1); // Âm lượng (từ 0 đến 1)
    const [duration, setDuration] = useState(0); // Tổng thời gian bài hát (giây)
    const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại (giây)
    // State mới để quản lý danh sách phát
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [showPlayer, setShowPlayer] = useState(false); // State để điều khiển hiển thị Player

    const audioRef = useRef(null); // Dùng để tham chiếu đến thẻ <audio>

  // useEffect để quản lý các sự kiện của thẻ <audio>
    useEffect(()=>{
        const audio = audioRef.current;
        if(!audio)return;
        // Cập nhật thời gian hiện tại
        const handleTimeUpdate =()=>{
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime/audio.duration)*100);
        }

    // Xử lý khi bài hát kết thúc
        const handleEnded = ()=>{
            setIsPlaying(false);
            //Logic chuyen bai hai tiep theo co the them vao day
        }
        // Lấy tổng thời gian khi metadata đã được tải
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        // Dọn dẹp listener khi component bị unmount
    return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };

    },[audioRef.current])

    useEffect(()=>{
        // Observer: Khi currentSong thay đổi, ta sẽ xử lý audio
        if (currentSong){
            if(!audioRef.current){ // Nếu thẻ audio chưa tồn tại, tạo mới
                audioRef.current = new Audio();
            }
            // Đặt nguồn nhạc và bắt đầu phát
            audioRef.current.src = `http://localhost:8000/api/stream/song/${currentSong._id}`;;
            audioRef.current.play();
            setIsPlaying(true);
        }
    },[currentSong])


  // Cập nhật useEffect để tự động chuyển bài khi kết thúc
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext(); // Tự động phát bài tiếp theo
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current, currentIndex, playlist]);


    // Hàm để các component khác gọi để bắt đầu phát một bài hát
    const playSong  = (song, playlist, index)=>{
        setPlaylist(playlist);
        setCurrentIndex(index);
        setCurrentSong(song);
        setShowPlayer(true); // Hiển thị Player khi bắt đầu phát
    }
    // Hàm để bật/tắt nhạc
    const togglePlay = ()=>{
        if(!audioRef.current) return;
        if (isPlaying){
            audioRef.current.pause();
        }else{
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    
    }

    // Hàm mới để tua nhạc
    const seek = (time)=>{
        if(audioRef.current){
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }

    // Hàm mới để đổi âm lượng
  const changeVolume = (value) => {
    if (audioRef.current) {
        audioRef.current.volume = value;
        setVolume(value);
    }
}
    // Hàm tiện ích để format thời gian từ giây -> 00:00
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const playNext = ()=>{
    if (playlist.length===0)return;
    const nextIndex = (currentIndex+1)%playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);

  }
  const playPrevious = () => {
    if (playlist.length === 0) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
  };
  const value = {
    // State cũ
    currentSong,
    isPlaying,
    // State mới
    progress,
    volume,
    duration,
    currentTime,
    showPlayer,
    // Hàm cũ
    playSong,
    togglePlay,
    // Hàm mới
    seek,
    changeVolume,
    formatTime,
    playSong,
    playNext,
    playPrevious,
    setShowPlayer
  };
    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// Custom hook để sử dụng dễ dàng hơn
export const usePlayer = () => {
    return useContext(PlayerContext);
  };
