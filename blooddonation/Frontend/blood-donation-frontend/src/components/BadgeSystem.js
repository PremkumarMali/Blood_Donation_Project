import React from 'react';

const BadgeSystem = ({ badges, points }) => {
  const badgeList = badges ? badges.split(',') : [];

  const getBadgeIcon = (badge) => {
    switch (badge.trim()) {
      case 'Newcomer': return '🌱';
      case 'Life Saver': return '🎖️';
      case 'Frequent Donor': return '🩸';
      case 'Emergency Hero': return '⚡';
      default: return '🏅';
    }
  };

  return (
    <div className="glass-card p-4 mb-4 shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">My Achievements</h5>
        <div className="badge bg-warning text-dark px-3 py-2 rounded-pill">
          ✨ {points || 0} Points
        </div>
      </div>
      
      <div className="d-flex flex-wrap gap-3">
        {badgeList.map((badge, index) => (
          <div 
            key={index} 
            className="d-flex flex-column align-items-center p-3 glass-card text-center"
            style={{ minWidth: '100px', background: 'rgba(255,255,255,0.05)' }}
          >
            <span style={{ fontSize: '2rem' }}>{getBadgeIcon(badge)}</span>
            <span className="small mt-2 fw-medium">{badge}</span>
          </div>
        ))}
        
        {badgeList.length === 0 && (
          <div className="small" style={{ opacity: 0.6 }}>No achievements yet. Start donating to earn badges!</div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
          <div 
            className="progress-bar bg-danger" 
            role="progressbar" 
            style={{ width: `${(points % 100)}%` }}
          ></div>
        </div>
        <div className="small mt-2" style={{ opacity: 0.6 }}>
          {100 - ((points || 0) % 100)} points until your next rank!
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;
