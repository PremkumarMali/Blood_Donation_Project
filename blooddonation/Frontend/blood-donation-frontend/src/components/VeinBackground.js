import React from 'react';

const VeinBackground = () => {
  return (
    <div className="vein-background">
      {/* 🌌 Futuristic Glow Overlay */}
      <div className="auth-bg-glow" />
      
      {/* 🔮 Interactive Cursor Blob */}
      <div 
        className="auth-glow-blob cursor-blob" 
        style={{ 
          transform: 'translate(calc(var(--cursor-x, 50) * 1vw - 20vh), calc(var(--cursor-y, 50) * 1vh - 20vh))', 
          left: 0, 
          top: 0, 
          width: '40vh', 
          height: '40vh' 
        }} 
      />
      
      {/* 🛸 Static Decorative Blob */}
      <div className="auth-glow-blob" style={{ bottom: '10%', right: '5%', animationDelay: '-10s' }} />

      {/* 🩸 Floating Anti-Gravity Blood Cells */}
      <div className="blood-cell-flow float-cell" style={{ '--top': '20vh', '--duration': '15s' }}></div>
      <div className="blood-cell-flow float-cell" style={{ '--top': '40vh', '--duration': '20s', opacity: 0.4 }}></div>
      <div className="blood-cell-flow float-cell" style={{ '--top': '60vh', '--duration': '12s', animationDelay: '5s' }}></div>
      <div className="blood-cell-flow float-cell" style={{ '--top': '80vh', '--duration': '18s', animationDelay: '1s', opacity: 0.5 }}></div>
    </div>
  );
};

export default VeinBackground;
