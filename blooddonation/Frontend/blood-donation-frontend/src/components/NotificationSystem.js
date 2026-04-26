import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationSystem = ({ isAdmin }) => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/notifications');
      const newNotifications = res.data;
      
      // If there's a new emergency notification, show a toast
      if (newNotifications.length > notifications.length) {
        const latest = newNotifications[0];
        if (latest.type === 'EMERGENCY' && !latest.read) {
          toast.error(`🚨 EMERGENCY: ${latest.message} at ${latest.senderLocation}`, {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
      setNotifications(newNotifications);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-system" style={{ position: 'relative' }}>
      <button 
        className="btn d-flex align-items-center justify-content-center position-relative" 
        onClick={() => setShowPanel(!showPanel)}
        style={{ 
          background: '#FFFFFF', 
          border: '1px solid rgba(45, 36, 30, 0.1)', 
          borderRadius: '12px', 
          width: '45px', 
          height: '45px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🔔</span>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="notification-panel" style={{ 
          position: 'absolute', 
          right: 0, 
          top: '60px', 
          width: '380px', 
          zIndex: 1000, 
          maxHeight: '500px', 
          overflowY: 'auto',
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(45, 36, 30, 0.15)',
          border: '1px solid rgba(45, 36, 30, 0.08)'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 text-premium fw-bold">Notifications</h5>
            <button className="btn btn-sm text-muted p-0" onClick={() => setShowPanel(false)}>Close</button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-5">
               <div className="fs-1 mb-2 opacity-20">📭</div>
               <p className="text-muted mb-0">No notifications yet.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-3 mb-3 rounded-4 ${n.read ? 'opacity-50' : 'border-start border-danger border-4 shadow-sm'}`} 
                   style={{ background: n.read ? 'transparent' : 'rgba(230, 57, 70, 0.02)', transition: '0.3s' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className={`badge ${n.type === 'EMERGENCY' ? 'bg-danger text-white' : 'bg-info text-dark'} rounded-pill`} style={{ fontSize: '0.7rem' }}>{n.type}</span>
                  <small className="text-muted">{new Date(n.timestamp).toLocaleTimeString()}</small>
                </div>
                <p className="text-premium mb-2 fw-bold" style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{n.message}</p>
                
                {n.type === 'EMERGENCY' && (
                  <div className="emergency-details mt-2 p-2 rounded-3" style={{ fontSize: '0.8rem', background: 'rgba(230, 57, 70, 0.05)', border: '1px solid rgba(230, 57, 70, 0.1)' }}>
                    <div className="text-muted mb-1">📍 Location: <span className="text-premium fw-bold">{n.senderLocation}</span></div>
                    <div className="text-muted mb-1">👤 Name: <span className="text-premium fw-bold">{n.senderName}</span></div>
                    <div className="text-muted">📞 Contact: <span className="text-premium fw-bold">{n.senderContact}</span></div>
                  </div>
                )}

                {!n.read && (
                  <button className="btn btn-sm btn-primary w-100 mt-3" style={{ fontSize: '0.8rem' }} onClick={() => markAsRead(n.id)}>Mark as Read</button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
