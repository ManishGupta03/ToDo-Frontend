import { useEffect, useState } from 'react';

const Timer = ({ startTime, duration }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const initialElapsedTime = duration * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const timeElapsed = now - start + initialElapsedTime;
      setElapsedTime(timeElapsed);
    };

    const intervalId = setInterval(updateTimer, 1000);

    // Initialize timer
    updateTimer();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [startTime, duration]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return <span>{formatTime(elapsedTime)}</span>;
};

export default Timer;
