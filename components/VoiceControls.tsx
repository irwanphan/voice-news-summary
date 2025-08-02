import React from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface VoiceControlsProps {
  text: string;
  className?: string;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ text, className = '' }) => {
  const { isPlaying, speak, stop, pause, resume } = useTextToSpeech();

  const handlePlayClick = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(text);
    }
  };

  const handlePauseClick = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={handlePlayClick}
        style={{
          padding: '0.5rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: isPlaying ? '#dc2626' : '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2rem',
          height: '2rem'
        }}
        title={isPlaying ? 'Stop' : 'Play'}
      >
        {isPlaying ? (
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      <button
        onClick={handlePauseClick}
        style={{
          padding: '0.5rem',
          borderRadius: '0.375rem',
          border: '1px solid #d1d5db',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2rem',
          height: '2rem'
        }}
        title="Pause/Resume"
      >
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default VoiceControls; 