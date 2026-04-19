import React from 'react';

const VeinBackground = () => {
  const cells = Array.from({ length: 15 });

  return (
    <div className="vein-background">
      {cells.map((_, i) => (
        <div 
          key={i} 
          className="blood-cell-flow" 
          style={{ 
            '--top': `${Math.random() * 100}vh`,
            '--duration': `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export default VeinBackground;
