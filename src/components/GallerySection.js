import React, { useRef } from 'react';
import './GallerySection.css';

const GallerySection = ({ isActive, photos, onPhotoClick }) => {
  return (
    <section className={`section ${isActive ? 'active' : ''}`}>
      <div className="gallery-container">
        <h2 className="section-title">Sister's Photo Gallery</h2>
        <p className="section-subtitle">
          {photos.length > 0 ? `${photos.length} beautiful moments` : 'No photos uploaded yet'}
        </p>
        
        {photos.length > 0 ? (
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="gallery-item"
                onClick={() => onPhotoClick(photo)}
              >
                <div className="photo-wrapper">
                  <img src={photo.src} alt="Gallery photo" />
                </div>
                <div className="gallery-caption">{photo.caption}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-gallery">
            <div className="empty-icon">📸</div>
            <h3>No Photos Yet</h3>
            <p>Upload photos through the Admin panel to see them here!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection; 