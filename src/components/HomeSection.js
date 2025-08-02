import React, { useRef } from 'react';
import './HomeSection.css';

const HomeSection = ({ isActive, childhoodPhoto, onPhotoUpload, onSectionChange, isAdminMode, onAdminLogin }) => {
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (isAdminMode) {
      fileInputRef.current?.click();
    } else {
      const password = window.prompt('Admin access required. Please enter the admin password:');
      if (password && onAdminLogin(password)) {
        // Login successful, allow upload
        setTimeout(() => fileInputRef.current?.click(), 100); // slight delay to ensure state updates
      } else if (password !== null) {
        window.alert('Incorrect password. Upload not allowed.');
      }
    }
  };

  const handleViewMemories = () => {
    onSectionChange('gallery');
  };

  return (
    <section className={`section ${isActive ? 'active' : ''}`}>
      <div className="hero-banner">
        <div className="hero-content">
          {/* Main Headline */}
          <div className="headline-section">
            <h1 className="main-headline">Happy Rakshabandhan Jinal!</h1>
            <h2 className="sub-headline">Our First Rakhi Together</h2>
            <p className="affectionate-line">To my dearest sister 💛</p>
          </div>
          
          {/* Festive Divider */}
          <div className="festive-divider">
            <span>🎀</span>
            <span>✨</span>
            <span>💝</span>
          </div>
          
          {/* Childhood Photo with Enhanced Presentation */}
          <div className="childhood-photo">
            <div className="photo-container">
              {childhoodPhoto ? (
                <div className="photo-frame">
                  <img 
                    src={childhoodPhoto.src || childhoodPhoto} 
                    alt="Jinal's childhood photo - Our beginnings, captured in this memory" 
                    className="childhood-photo-img"
                  />
                  <div className="photo-caption">
                    <p>Our beginnings, captured in this memory</p>
                  </div>
                </div>
              ) : (
                <div className="upload-area" onClick={handleUploadClick}>
                  <div className="upload-icon">📸</div>
                  <p>Upload Jinal's photo here</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Welcome Text */}
          <div className="introduction">
            <p>
              Dear Jinal, as we celebrate our first Rakshabandhan together, my heart is filled with joy and gratitude for the beautiful bond we share. This sacred thread of love connects us not just as siblings, but as lifelong friends who will always protect and cherish each other. May our relationship grow stronger with each passing year, and may we create countless beautiful memories together.
            </p>
          </div>

          {/* Call to Action Button */}
          <div className="cta-section">
            <button className="view-memories-btn" onClick={handleViewMemories}>
              <span className="btn-icon">📸</span>
              <span className="btn-text">View Your Gallery</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection; 