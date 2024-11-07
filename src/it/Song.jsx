import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout/Layout/Layout';
import track1 from './music/Espresso.mp3';
import track2 from './music/Espresso.mp3';
import track3 from './music/Espresso.mp3';
import track4 from './music/Espresso.mp3';
import coverImage from './music/espresso.jpg';

const songsList = [
  { 
    name: 'hans zimmer', 
    artist: 'interstellar theme', 
    src: track1, 
    cover: coverImage 
  },
  { 
    name: 'narvent', 
    artist: 'Fainted', 
    src: track2, 
    cover: coverImage 
  },
  { 
    name: 'narvent', 
    artist: 'Memory Reboot', 
    src: track3, 
    cover: coverImage 
  },
  { 
    name: '', 
    artist: 'fainted', 
    src: track4, 
    cover: coverImage 
  },
];

const SongBox = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loop, setLoop] = useState(false);
  const song = useRef(new Audio(songsList[currentSong].src));
  const progressBarRef = useRef(null);

  useEffect(() => {
    loadSong(currentSong);
    song.current.addEventListener('timeupdate', updateProgress);
    song.current.addEventListener('ended', handleSongEnd);

    return () => {
      song.current.removeEventListener('timeupdate', updateProgress);
      song.current.removeEventListener('ended', handleSongEnd);
    };
  }, [currentSong]);

  const loadSong = (index) => {
    song.current.src = songsList[index].src;
    setPlaying(false);
    setProgress(0);
  };

  const updateProgress = () => {
    if (song.current.duration) {
      setProgress((song.current.currentTime / song.current.duration) * 100);
    }
  };

  const togglePlayPause = () => {
    if (playing) {
      song.current.pause();
    } else {
      song.current.play();
    }
    setPlaying(!playing);
  };

  const handleSongEnd = () => {
    if (loop) {
      song.current.currentTime = 0;
      song.current.play();
    } else {
      nextSong();
    }
  };

  const nextSong = () => {
    setCurrentSong((currentSong + 1) % songsList.length);
    song.current.play();
  };

  const prevSong = () => {
    setCurrentSong((currentSong - 1 + songsList.length) % songsList.length);
    song.current.play();
  };

  const seek = (e) => {
    const rect = progressBarRef.current?.getBoundingClientRect();
    if (rect) {
      const pos = ((e.clientX - rect.left) / rect.width) * song.current.duration;
      song.current.currentTime = pos;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleLoop = () => {
    setLoop(!loop);
    song.current.loop = !loop;
  };

  return (
    <Layout title='Song'>
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
        {/* Background with blur effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{ backgroundImage: `url(${songsList[currentSong].cover})` }}
        />
        
        {/* Main container with responsive padding */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Album Art - Responsive sizes */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 transition-all duration-300">
            <div
              className={`w-full h-full bg-cover bg-center rounded-2xl border-4 sm:border-6 lg:border-8 border-gray-800 shadow-2xl transition-transform duration-300 hover:scale-105 ${
                playing ? 'animate-spin [animation-duration:20s]' : ''
              }`}
              style={{ backgroundImage: `url(${songsList[currentSong].cover})` }}
            />
          </div>

          {/* Song Info - Responsive text sizes */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold truncate max-w-[90vw] sm:max-w-[70vw] lg:max-w-[50vw]">
              {songsList[currentSong].artist}
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl truncate max-w-[80vw] sm:max-w-[60vw] lg:max-w-[40vw]">
              {songsList[currentSong].name}
            </p>
          </div>

          {/* Progress Bar - Responsive width and touch-friendly */}
          <div className="w-full max-w-xs sm:max-w-lg lg:max-w-2xl px-2 sm:px-4 space-y-2">
            <div 
              ref={progressBarRef} 
              className="w-full h-2 sm:h-3 bg-gray-700 rounded-full cursor-pointer touch-none"
              onClick={seek}
            >
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-gray-400 text-sm sm:text-base lg:text-lg">
              <span>{formatTime(song.current.currentTime)}</span>
              <span>{formatTime(song.current.duration)}</span>
            </div>
          </div>

          {/* Controls - Responsive sizing and spacing */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8 bg-gray-800/50 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
            <button 
              onClick={prevSong} 
              className="text-3xl sm:text-4xl lg:text-5xl hover:text-red-500 transition-colors p-2 sm:p-3"
            >
              ⏮️
            </button>
            <button 
              onClick={togglePlayPause} 
              className="text-4xl sm:text-5xl lg:text-6xl bg-blue-600 hover:bg-blue-700 p-4 sm:p-6 lg:p-8 rounded-full transition-all transform hover:scale-105"
            >
              {playing ? '⏸️' : '▶️'}
            </button>
            <button 
              onClick={nextSong} 
              className="text-3xl sm:text-4xl lg:text-5xl hover:text-red-500 transition-colors p-2 sm:p-3"
            >
              ⏭️
            </button>
            <button 
              onClick={toggleLoop}
              className={`p-3 sm:p-4 lg:p-6 rounded-full transition-all transform hover:scale-105 ${
                loop ? 'bg-yellow-500' : 'bg-gray-700'
              }`}
            >
              <span className="text-xl sm:text-2xl lg:text-3xl">🔁</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SongBox;