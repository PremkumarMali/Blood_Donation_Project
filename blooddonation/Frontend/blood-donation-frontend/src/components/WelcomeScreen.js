import React, { useEffect, useState } from 'react';

const WelcomeScreen = ({ username, onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800); // Wait for fade-out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`welcome-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <h1 className="welcome-text">Welcome, {username}</h1>
      <p className="welcome-subtext">Preparing your personal dashboard...</p>
    </div>
  );
};

export default WelcomeScreen;
