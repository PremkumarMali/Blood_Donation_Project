import React, { useState, useEffect } from 'react';
import './DonationAwareness.css';

const DonationAwareness = ({ full = true }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "The Silent Crisis",
      message: "Every 2 seconds, someone in the world desperately needs a blood transfusion.",
      stat: "1 in 7 people entering a hospital need blood.",
      icon: "🚨"
    },
    {
      title: "Be a Real Hero",
      message: "A single donation can save up to 3 lives. You have the power to change a destiny.",
      stat: "Only 3% of eligible people donate blood.",
      icon: "🦸‍♂️"
    },
    {
      title: "No Substitute",
      message: "Blood cannot be manufactured in a factory. It can only come from a generous heart like yours.",
      stat: "It takes just 15 minutes to save 3 lives.",
      icon: "❤️"
    },
    {
      title: "The Tragic Reality",
      message: "Thousands of people lose their lives every day simply because the right blood type wasn't available in time.",
      stat: "Don't let them wait. Every drop counts.",
      icon: "🥀"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`awareness-container ${!full ? 'minimal' : ''}`}>
      {/* Animated Background Elements */}
      <div className="blood-cells">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="cell"></div>
        ))}
      </div>

      {/* Story Content */}
      <div className="awareness-content">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-icon">{slide.icon}</div>
            <h2 className="slide-title">{slide.title}</h2>
            <p className="slide-message">{slide.message}</p>
            <div className="slide-stat">
              <span className="stat-highlight">{slide.stat}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      {full && (
        <div className="awareness-dots">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationAwareness;
