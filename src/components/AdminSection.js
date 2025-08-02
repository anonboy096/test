import React, { useRef, useState } from 'react';
import './AdminSection.css';

const AdminSection = ({ 
  isActive, 
  isAdminMode, 
  adminPassword, 
  onAdminLogin, 
  onAdminLogout, 
  onAdminPasswordChange,
  onChildhoodPhotoUpload,
  onGalleryPhotoUpload,
  onDeletePhoto,
  onClearAllPhotos,
  onCaptionUpdate,
  childhoodPhoto,
  galleryPhotos
}) => {
  const childhoodPhotoRef = useRef(null);
  const galleryPhotosRef = useRef(null);
  const [loginError, setLoginError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [currentPhotoForCaption, setCurrentPhotoForCaption] = useState(null);
  const [captionInput, setCaptionInput] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (onAdminLogin(adminPassword)) {
      setUploadStatus('Successfully logged in!');
    } else {
      setLoginError('Incorrect password.');
    }
  };

  const handleChildhoodPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = await onChildhoodPhotoUpload(e.target.result);
        setUploadStatus(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryPhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const photoPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(photoPromises).then(async (photoUrls) => {
      const result = await onGalleryPhotoUpload(photoUrls);
      setUploadStatus(result);
    });
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      const result = await onDeletePhoto(photoId);
      setUploadStatus(result);
    }
  };

  const handleClearAllPhotos = async () => {
    if (window.confirm('Are you sure you want to clear ALL photos? This cannot be undone!')) {
      const result = await onClearAllPhotos();
      setUploadStatus(result);
    }
  };

  const handleLogout = () => {
    onAdminLogout();
    setUploadStatus('Logged out successfully!');
  };

  const handlePhotoClick = (photo) => {
    setCurrentPhotoForCaption(photo);
    setCaptionInput(photo.caption);
    setShowCaptionModal(true);
  };

  const handleCaptionSave = () => {
    if (currentPhotoForCaption && captionInput.trim()) {
      onCaptionUpdate(currentPhotoForCaption.id, captionInput.trim());
      setShowCaptionModal(false);
      setCurrentPhotoForCaption(null);
      setCaptionInput('');
      setUploadStatus('Caption updated successfully!');
    }
  };

  const handleCaptionCancel = () => {
    setShowCaptionModal(false);
    setCurrentPhotoForCaption(null);
    setCaptionInput('');
  };

  return (
    <section className={`section admin-section ${isActive ? 'active' : ''}`}>
      <div className="admin-container">
        <h2 className="section-title">🔐 Admin Panel</h2>
        
        {!isAdminMode ? (
          <div className="login-section">
            <h3>Login Required</h3>
            <p>Enter the admin password to manage photos</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => onAdminPasswordChange(e.target.value)}
                placeholder="Enter password"
                className="password-input"
              />
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
            
            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}
            
            <div className="admin-hint">
              <p><strong>Hint:</strong>  Your Name</p>
            </div>
          </div>
        ) : (
          <div className="admin-panel">
            <div className="admin-header">
              <h3>Welcome, Admin! 👋</h3>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>

            {uploadStatus && (
              <div className="status-message">
                {uploadStatus}
              </div>
            )}

            <div className="admin-sections">
              {/* MainPhoto Management */}
              <div className="admin-section-card">
                <h4>📸 MainPhoto</h4>
                <div className="current-photo">
                  {childhoodPhoto ? (
                    <img src={childhoodPhoto} alt="Current Mainphoto" />
                  ) : (
                    <p>No Mainphoto uploaded</p>
                  )}
                </div>
                <button 
                  onClick={() => childhoodPhotoRef.current?.click()}
                  className="upload-btn"
                >
                  Change Main Photo
                </button>
                <input
                  type="file"
                  ref={childhoodPhotoRef}
                  accept="image/*"
                  onChange={handleChildhoodPhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Gallery Photos Management */}
              <div className="admin-section-card">
                <h4>🖼️ Gallery Photos ({galleryPhotos.length})</h4>
                <div className="gallery-preview">
                  {galleryPhotos.slice(0, 6).map((photo) => (
                    <div key={photo.id} className="preview-item">
                      <img 
                        src={photo.src} 
                        alt="Gallery photo" 
                        onClick={() => handlePhotoClick(photo)}
                        style={{ cursor: 'pointer' }}
                      />
                      <button 
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="delete-btn"
                      >
                        ❌
                      </button>
                      <div className="caption-preview">
                        {photo.caption.length > 15 ? 
                          photo.caption.substring(0, 15) + '...' : 
                          photo.caption
                        }
                      </div>
                    </div>
                  ))}
                  {galleryPhotos.length > 6 && (
                    <div className="more-photos">
                      +{galleryPhotos.length - 6} more
                    </div>
                  )}
                  {galleryPhotos.length === 0 && (
                    <div className="no-photos">
                      <p>No photos uploaded yet</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => galleryPhotosRef.current?.click()}
                  className="upload-btn"
                >
                  Upload Gallery Photos
                </button>
                <input
                  type="file"
                  ref={galleryPhotosRef}
                  accept="image/*"
                  multiple
                  onChange={handleGalleryPhotoUpload}
                  style={{ display: 'none' }}
                />
                <p className="upload-hint">
                  💡 Click on photos to edit captions
                </p>
              </div>

              {/* Data Management */}
              <div className="admin-section-card">
                <h4>🗂️ Data Management</h4>
                <div className="data-stats">
                  <p>MainPhoto: {childhoodPhoto ? '✅ Uploaded' : '❌ Not uploaded'}</p>
                  <p>Gallery Photos: {galleryPhotos.length} photos</p>
                  <p>Storage: {localStorage.getItem('galleryPhotos') ? '✅ Saved' : '❌ Not saved'}</p>
                </div>
                <button 
                  onClick={handleClearAllPhotos}
                  className="clear-btn"
                >
                  Clear All Photos
                </button>
              </div>

              {/* Instructions */}
              <div className="admin-section-card">
                <h4>📋 Instructions</h4>
                <div className="instructions">
                  <p><strong>How to use:</strong></p>
                  <ul>
                    <li>Upload Mainphoto for the main banner</li>
                    <li>Upload multiple gallery photos at once</li>
                    <li>Click on photos to edit captions</li>
                    <li>Photos are automatically saved to browser storage</li>
                    <li>Photos persist between page refreshes</li>
                    <li>Use "Clear All Photos" to reset everything</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Caption Edit Modal */}
        {showCaptionModal && (
          <div className="caption-modal-overlay">
            <div className="caption-modal">
              <h3>Edit Caption</h3>
              <div className="modal-photo">
                <img src={currentPhotoForCaption?.src} alt="Photo" />
              </div>
              <textarea
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                placeholder="Enter caption for this photo..."
                className="caption-textarea"
                rows="3"
              />
              <div className="modal-buttons">
                <button onClick={handleCaptionCancel} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleCaptionSave} className="save-btn">
                  Save Caption
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminSection; 