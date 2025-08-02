import React, { useState, useEffect } from 'react';
import './PhotoModal.css';

const PhotoModal = ({ isOpen, photo, onClose, onCaptionUpdate, isAdminMode }) => {
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (photo) {
      setCaption(photo.caption || '');
    }
  }, [photo]);

  const handleSave = () => {
    if (photo && onCaptionUpdate && isAdminMode) {
      onCaptionUpdate(photo.id, caption);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !photo) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        
        <img 
          src={photo.src} 
          alt="Gallery photo" 
          className="modal-image"
        />
        
        <div className="modal-caption">
          {isAdminMode ? (
            <>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a sweet message or compliment for this photo..."
                onKeyDown={handleKeyDown}
                className="caption-input"
              />
              <button 
                className="save-caption-btn" 
                onClick={handleSave}
              >
                Save Caption
              </button>
            </>
          ) : (
            <div className="caption-display">
              <p>{photo.caption || 'No caption added yet.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal; 