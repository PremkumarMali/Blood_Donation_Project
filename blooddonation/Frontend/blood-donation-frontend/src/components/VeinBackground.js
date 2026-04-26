import React from 'react';

const VeinBackground = () => {
  return (
    <div className="vein-background">
      {/* 🌌 Soft Ambient Glow */}
      <div className="auth-bg-glow" />
      
      {/* 🔮 Interactive Cursor Orb */}
      <div 
        className="auth-glow-blob cursor-blob" 
        style={{ 
          transform: 'translate(calc(var(--cursor-x, 50) * 1vw - 20vh), calc(var(--cursor-y, 50) * 1vh - 20vh))', 
          width: '40vh', 
          height: '40vh',
          opacity: 0.1
        }} 
      />
      
      {/* 🩸 Floating Serum Cells */}
      <div className="blood-cell-flow" style={{ '--top': '20vh', '--duration': '18s' }}></div>
      <div className="blood-cell-flow" style={{ '--top': '45vh', '--duration': '25s', opacity: 0.05 }}></div>
      <div className="blood-cell-flow" style={{ '--top': '75vh', '--duration': '14s' }}></div>
    </div>
  );
};

export default VeinBackground;
