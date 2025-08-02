import React, { useRef, useEffect } from 'react';
import './MusicControls.css';

const MusicControls = ({ isPlaying, onToggle }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log('Music autoplay blocked'));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div className="music-controls">
      <button className="music-btn" onClick={onToggle} title={isPlaying ? 'Pause Music' : 'Play Music'}>
        <span className="music-icon">
          {isPlaying ? '🎵' : '🔇'}
        </span>
      </button>
      <audio 
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="https://www.soundjay.com/misc/sounds/indian-classical-music-1.mp3" type="audio/mpeg" />
        <source src="https://www.soundjay.com/misc/sounds/indian-classical-music-1.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicControls; 