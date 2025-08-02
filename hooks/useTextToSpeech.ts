
import { useState, useRef } from 'react';

interface UseTextToSpeechReturn {
  isPlaying: boolean;
  currentText: string;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const speak = (text: string) => {
    // Stop any current speech
    stop();

    // Create new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Set up event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentText('');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setCurrentText('');
    };

    // Store references
    speechRef.current = utterance;
    synthesisRef.current = window.speechSynthesis;

    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsPlaying(false);
    setCurrentText('');
    speechRef.current = null;
  };

  const pause = () => {
    if (synthesisRef.current) {
      synthesisRef.current.pause();
    }
  };

  const resume = () => {
    if (synthesisRef.current) {
      synthesisRef.current.resume();
    }
  };

  return {
    isPlaying,
    currentText,
    speak,
    stop,
    pause,
    resume
  };
};
