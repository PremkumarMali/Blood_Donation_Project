import React from 'react';

const ImpactCard = ({ orders }) => {
  const approvedCount = orders.filter(o => o.status === 'APPROVED' || o.status === 'COMPLETED').length;
  const livesSaved = approvedCount * 3; // Standard calculation: 1 donation can save up to 3 lives

  return (
    <div className="dark-widget text-center overflow-hidden position-relative">
      {/* Background Glow */}
      <div className="position-absolute top-0 start-50 translate-middle" 
           style={{ width: '200px', height: '200px', background: 'rgba(239, 68, 68, 0.15)', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0 }}></div>
      
      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="display-4 fw-bold mb-1" style={{ color: '#ef4444' }}>{livesSaved}</div>
        <h5 className="fw-bold mb-3 text-white">Lives Impacted</h5>
        
        <div className="progress mx-auto mb-3" style={{ height: '10px', width: '80%', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${Math.min(approvedCount * 20, 100)}%`, background: 'linear-gradient(90deg, #ef4444, #f97316)', borderRadius: '10px' }}
          ></div>
        </div>
        
        <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Based on your {approvedCount} successful donations. Every drop counts!
        </p>
        
        <div className="mt-4 d-flex justify-content-around">
          <div>
            <div className="h4 fw-bold mb-0" style={{ color: '#f97316' }}>{approvedCount}</div>
            <div className="small" style={{ color: 'rgba(255,255,255,0.45)' }}>Donations</div>
          </div>
          <div className="vr" style={{ opacity: 0.1 }}></div>
          <div>
            <div className="h4 fw-bold mb-0" style={{ color: '#f97316' }}>{approvedCount > 0 ? 'Top 10%' : 'N/A'}</div>
            <div className="small" style={{ color: 'rgba(255,255,255,0.45)' }}>Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactCard;
