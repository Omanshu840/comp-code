import { useCallback } from 'react';

export const useSound = (soundUrl: string) => {
  const playSound = useCallback(() => {
    try {
      const audio = new Audio(`/comp-code${soundUrl}`);
      audio.play().catch(error => {
        console.error(`Failed to play sound: ${soundUrl}`, error);
      });
    } catch (error) {
      console.error(`Failed to create audio element for sound: ${soundUrl}`, error);
    }
  }, [soundUrl]);

  return playSound;
};
