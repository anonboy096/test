import React, { useState, useRef, useEffect } from 'react';

import './Navigation.css';

const Navigation = ({ activeSection, onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
  
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  
    // Cleanup when component unmounts or before next effect run
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSectionChange = (section) => {
    onSectionChange(section);
    setIsMenuOpen(false); // Close menu when section changes
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span 
            className="logo-text" 
            onClick={() => onSectionChange('home')} 
            style={{ cursor: 'pointer' }}
          >
            Panda 🐼
          </span>
        </div>
        
        {/* Hamburger Menu Button */}
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="nav-buttons desktop-nav">
          <button 
            className={`nav-btn ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => onSectionChange('home')}
          >
            Home
          </button>
          
          <button 
            className={`nav-btn ${activeSection === 'gallery' ? 'active' : ''}`}
            onClick={() => onSectionChange('gallery')}
          >
            Gallery
          </button>
          
          <button 
            className={`nav-btn ${activeSection === 'letter' ? 'active' : ''}`}
            onClick={() => onSectionChange('letter')}
          >
            Rakhi Letter
          </button>
          
          
          <button 
            className={`nav-btn admin-btn ${activeSection === 'admin' ? 'active' : ''}`}
            onClick={() => onSectionChange('admin')}
          >
            Admin
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div ref={menuRef} className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>

          <button 
            className={`mobile-nav-btn ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => handleSectionChange('home')}
          >
            🏠 Home
          </button>
          
          <button 
            className={`mobile-nav-btn ${activeSection === 'gallery' ? 'active' : ''}`}
            onClick={() => handleSectionChange('gallery')}
          >
            📸 Gallery
          </button>
          
          <button 
            className={`mobile-nav-btn ${activeSection === 'letter' ? 'active' : ''}`}
            onClick={() => handleSectionChange('letter')}
          >
            💌 Rakhi Letter
          </button>
          
          <button 
            className={`mobile-nav-btn admin-btn ${activeSection === 'admin' ? 'active' : ''}`}
            onClick={() => handleSectionChange('admin')}
          >
            🔐 Admin
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 