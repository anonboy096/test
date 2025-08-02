import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import MusicControls from './components/MusicControls';
import FloatingElements from './components/FloatingElements';
import HomeSection from './components/HomeSection';
import GallerySection from './components/GallerySection';
import LetterSection from './components/LetterSection';
import PhotoModal from './components/PhotoModal';
import AdminSection from './components/AdminSection';

// Use Vercel API URL (will be your deployed domain)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-domain.vercel.app/api' 
  : 'http://localhost:5005/api';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [childhoodPhoto, setChildhoodPhoto] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load photos from Vercel API on component mount
  useEffect(() => {
    loadPhotosFromAPI();
  }, []);

  const loadPhotosFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/photos`);
      const data = await response.json();
      
      setChildhoodPhoto(data.childhoodPhoto);
      setGalleryPhotos(data.galleryPhotos || []);
    } catch (error) {
      console.error('Error loading photos from API:', error);
      // Fallback to localStorage if API is not available
      const savedChildhoodPhoto = localStorage.getItem('childhoodPhoto');
      const savedGalleryPhotos = localStorage.getItem('galleryPhotos');
      
      if (savedChildhoodPhoto) {
        setChildhoodPhoto(savedChildhoodPhoto);
      }
      
      if (savedGalleryPhotos) {
        setGalleryPhotos(JSON.parse(savedGalleryPhotos));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleMusicToggle = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleChildhoodPhotoUpload = (photo) => {
    setChildhoodPhoto(photo);
  };

  const handleGalleryPhotoUpload = (photos) => {
    setGalleryPhotos([...galleryPhotos, ...photos]);
  };

  const handlePhotoClick = (photo) => {
    setModalPhoto(photo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalPhoto(null);
  };

  const handleCaptionUpdate = (photoId, newCaption) => {
    // Update local state immediately for UI responsiveness
    setGalleryPhotos(photos =>
      photos.map(photo =>
        photo.id === photoId ? { ...photo, caption: newCaption } : photo
      )
    );
    
    // Save to cloud storage permanently
    saveCaptionToCloud(photoId, newCaption);
  };
  
  const saveCaptionToCloud = async (photoId, newCaption) => {
    try {
      console.log('💾 Saving caption to cloud...');
      const response = await fetch(`${API_BASE_URL}/photos?photoId=${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: newCaption
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Caption saved to cloud successfully');
      } else {
        console.error('❌ Error saving caption to cloud:', result.error);
      }
    } catch (error) {
      console.error('❌ Error saving caption to cloud:', error);
    }
  };

  const handleAdminLogin = (password) => {
    // Simple password check - you can change this password
    if (password === "panda2025") {
      setIsAdminMode(true);
      setAdminPassword('');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
  };

  const handleAdminChildhoodPhotoUpload = async (photo) => {
    try {
      console.log('📸 Uploading childhood photo...');
      const response = await fetch(`${API_BASE_URL}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'childhood',
          photo: photo
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setChildhoodPhoto(result.photo);
        console.log('✅ Childhood photo uploaded successfully');
        return result.message;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error uploading Mainphoto:', error);
      return `Upload failed: ${error.message}`;
    }
  };

  const handleAdminGalleryPhotoUpload = async (photos) => {
    try {
      console.log('📸 Uploading gallery photos...');
      const response = await fetch(`${API_BASE_URL}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'gallery',
          photos: photos
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGalleryPhotos([...galleryPhotos, ...result.photos]);
        console.log('✅ Gallery photos uploaded successfully');
        return result.message;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error uploading gallery photos:', error);
      return `Upload failed: ${error.message}`;
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      console.log('🗑️ Deleting photo:', photoId);
      const response = await fetch(`${API_BASE_URL}/photos?photoId=${photoId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGalleryPhotos(photos => photos.filter(photo => photo.id !== photoId));
        console.log('✅ Photo deleted successfully');
        return result.message;
      }
    } catch (error) {
      console.error('❌ Error deleting photo:', error);
      return `Delete failed: ${error.message}`;
    }
  };

  const handleClearAllPhotos = async () => {
    try {
      console.log('🗑️ Clearing all photos...');
      const response = await fetch(`${API_BASE_URL}/photos`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGalleryPhotos([]);
        setChildhoodPhoto(null);
        console.log('✅ All photos cleared successfully');
        return result.message;
      }
    } catch (error) {
      console.error('❌ Error clearing photos:', error);
      return `Clear failed: ${error.message}`;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🎁</div>
        <p>Loading your Rakshabandhan gift...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <MusicControls 
        isPlaying={isMusicPlaying} 
        onToggle={handleMusicToggle} 
      />
      
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <FloatingElements />
      
      <main className="main-content">
        <HomeSection 
          isActive={activeSection === 'home'} 
          childhoodPhoto={childhoodPhoto} 
          onPhotoUpload={handleChildhoodPhotoUpload} 
          onSectionChange={handleSectionChange}
          isAdminMode={isAdminMode}
          onAdminLogin={handleAdminLogin}
        />
        
        <GallerySection 
          isActive={activeSection === 'gallery'} 
          photos={galleryPhotos} 
          onPhotoClick={handlePhotoClick} 
        />
        
        <LetterSection isActive={activeSection === 'letter'} />
        
        <AdminSection 
          isActive={activeSection === 'admin'} 
          isAdminMode={isAdminMode}
          adminPassword={adminPassword}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          onAdminPasswordChange={setAdminPassword}
          onChildhoodPhotoUpload={handleAdminChildhoodPhotoUpload}
          onGalleryPhotoUpload={handleAdminGalleryPhotoUpload}
          onDeletePhoto={handleDeletePhoto}
          onClearAllPhotos={handleClearAllPhotos}
          onCaptionUpdate={handleCaptionUpdate}
          childhoodPhoto={childhoodPhoto}
          galleryPhotos={galleryPhotos}
        />
      </main>
      
      <PhotoModal 
        isOpen={isModalOpen} 
        photo={modalPhoto} 
        onClose={handleModalClose} 
        onCaptionUpdate={handleCaptionUpdate} 
        isAdminMode={isAdminMode}
      />
    </div>
  );
}

export default App; 