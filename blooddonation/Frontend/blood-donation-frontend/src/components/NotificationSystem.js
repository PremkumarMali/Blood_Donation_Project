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
        className="btn btn-dark position-relative" 
        onClick={() => setShowPanel(!showPanel)}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 15px' }}
      >
        🔔 {unreadCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unreadCount}</span>}
      </button>

      {showPanel && (
        <div className="notification-panel dark-widget" style={{ 
          position: 'absolute', 
          right: 0, 
          top: '60px', 
          width: '350px', 
          zIndex: 1000, 
          maxHeight: '500px', 
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-white fw-bold">Notifications</h5>
            <button className="btn btn-sm btn-link text-white-50" onClick={() => setShowPanel(false)}>Close</button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-white-50 py-4">No notifications yet.</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`notification-item p-3 mb-2 rounded ${n.read ? 'opacity-50' : 'bg-white bg-opacity-10 border-start border-danger border-4'}`} style={{ transition: '0.3s' }}>
                <div className="d-flex justify-content-between">
                  <span className={`badge ${n.type === 'EMERGENCY' ? 'bg-danger' : 'bg-info'} mb-2`}>{n.type}</span>
                  <small className="text-white-50">{new Date(n.timestamp).toLocaleTimeString()}</small>
                </div>
                <p className="text-white mb-1 fw-bold">{n.message}</p>
                
                {n.type === 'EMERGENCY' && (
                  <div className="emergency-details mt-2 p-2 rounded bg-black bg-opacity-25" style={{ fontSize: '0.85rem' }}>
                    <div className="text-white-50">📍 Location: <span className="text-white">{n.senderLocation}</span></div>
                    <div className="text-white-50">👤 Name: <span className="text-white">{n.senderName}</span></div>
                    <div className="text-white-50">📞 Contact: <span className="text-white">{n.senderContact}</span></div>
                  </div>
                )}

                {!n.read && (
                  <button className="btn btn-sm btn-outline-light mt-2" onClick={() => markAsRead(n.id)}>Mark as Read</button>
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
