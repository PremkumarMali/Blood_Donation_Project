import React from 'react';

const ImpactCard = ({ orders }) => {
  const approvedCount = orders.filter(o => o.status === 'APPROVED' || o.status === 'COMPLETED').length;
  const livesSaved = approvedCount * 3; // Standard calculation: 1 donation can save up to 3 lives

  return (
    <div className="glass-card p-4 h-100 border-0 shadow-lg text-center overflow-hidden position-relative">
      {/* Background Glow */}
      <div className="position-absolute top-0 start-50 translate-middle" 
           style={{ width: '200px', height: '200px', background: 'rgba(239, 68, 68, 0.15)', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0 }}></div>
      
      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="display-4 fw-bold text-danger mb-1">{livesSaved}</div>
        <h5 className="fw-bold mb-3">Lives Impacted</h5>
        
        <div className="progress mx-auto mb-3" style={{ height: '10px', width: '80%', background: 'rgba(255,255,255,0.1)' }}>
          <div 
            className="progress-bar bg-danger" 
            role="progressbar" 
            style={{ width: `${Math.min(approvedCount * 20, 100)}%` }}
          ></div>
        </div>
        
        <p className="small mb-0" style={{ opacity: 0.7 }}>
          Based on your {approvedCount} successful donations. Every drop counts!
        </p>
        
        <div className="mt-4 d-flex justify-content-around">
          <div>
            <div className="h4 fw-bold mb-0">{approvedCount}</div>
            <div className="small" style={{ opacity: 0.6 }}>Donations</div>
          </div>
          <div className="vr" style={{ opacity: 0.1 }}></div>
          <div>
            <div className="h4 fw-bold mb-0">{approvedCount > 0 ? 'Top 10%' : 'N/A'}</div>
            <div className="small" style={{ opacity: 0.6 }}>Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactCard;
