
import { useState, useEffect, useCallback, useRef } from 'react';

interface TextToSpeechOptions {
    onEnd?: () => void;
}

export const useTextToSpeech = ({ onEnd }: TextToSpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleEnd = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
    if (onEnd) {
      onEnd();
    }
  }, [onEnd]);
  
  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = utteranceRef.current;
    if (u) {
        u.onend = handleEnd;
    }

    // Cleanup: cancel speech when component unmounts
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, [handleEnd]);
  
  const play = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    if (synth.speaking && !isPaused) {
      // If speaking a different text, stop and start new one
      synth.cancel();
    }

    if (isPaused && utteranceRef.current) {
      // Resume if paused
      synth.resume();
      setIsPaused(false);
    } else {
      // Start new speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = handleEnd;
      utteranceRef.current = utterance;
      synth.speak(utterance);
    }
    setIsSpeaking(true);
  }, [isPaused, handleEnd]);

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.pause();
      setIsPaused(true);
    }
  }, []);

  const stop = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, []);

  return { isSpeaking, isPaused, play, pause, stop };
};
