import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { CircleX } from 'lucide-react';

const ModalWrapper = ({ 
  open, 
  onClose, 
  children, 
  title, 
  isDarkMode = false,
  width = "80%",
  minWidth = "500px"
}) => {
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  // Handle click outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  const modalStyles = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    border: isDarkMode ? '1px solid #374151' : '1px solid #d1d5db',
    // Custom animation using CSS transforms
    animation: 'modalEntry 0.2s ease-out forwards',
    transform: 'scale(0.95)',
    opacity: 0,
  };

  const overlayStyles = {
    zIndex: 999999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    // Custom animation for overlay
    animation: 'overlayFadeIn 0.2s ease-out forwards',
    opacity: 0,
  };

  const iconColor = isDarkMode ? '#f9fafb' : '#111827';

  return createPortal(
    <>
      {/* Add keyframes for animations */}
      <style>{`
        @keyframes overlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalEntry {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        /* React Phone Number Input - Complete style override */
        .PhoneInput {
          position: relative !important;
          display: flex !important;
          width: 104% !important;
          font-family: inherit !important;
        }
        
        .PhoneInputInput {
          width: 100% !important;
          height: 48px !important;
          padding: 12px !important;
          font-size: 16px !important;
          line-height: 1.4 !important;
          color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
          background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
          border: 1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'} !important;
          border-radius: 0 6px 6px 0 !important;
          border-left: none !important;
          outline: none !important;
          transition: border-color 0.15s ease-in-out !important;
          flex: 1 !important;
        }
        
        .PhoneInputInput:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .PhoneInputCountrySelect {
          height: 48px !important;
          padding: 0 8px !important;
          background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
          border: 1px solid ${isDarkMode ? '#6b7280' : '#d1d5db'} !important;
          border-right: none !important;
          border-radius: 6px 0 0 6px !important;
          outline: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 60px !important;
          flex-shrink: 0 !important;
        }
        
        .PhoneInputCountrySelect:hover,
        .PhoneInputCountrySelect:focus {
          background-color: ${isDarkMode ? '#4b5563' : '#f9fafb'} !important;
          border-color: #3b82f6 !important;
        }
        
        .PhoneInputCountryIcon {
        //   width: 20px !important;
        //   height: 15px !important;
        //   background-size: cover !important;
        //   background-position: center !important;
        //   background-repeat: no-repeat !important;
        //   display: inline-block !important;
        //   margin-right: 4px !important;
        //   border-radius: 2px !important;
        //   flex-shrink: 0 !important;
        display: none;
        }
        
        .PhoneInputCountryIcon--US {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7410 3900'%3e%3cpath fill='%23b22234' d='M0 0h7410v3900H0z'/%3e%3cpath d='M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0' stroke='%23fff' stroke-width='300'/%3e%3cpath fill='%23002868' d='M0 0h2964v2100H0z'/%3e%3cg fill='%23fff'%3e%3cg id='d'%3e%3cg id='c'%3e%3cg id='e'%3e%3cg id='b'%3e%3cpath id='a' d='M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z'/%3e%3cuse href='%23a' y='420'/%3e%3cuse href='%23a' y='840'/%3e%3cuse href='%23a' y='1260'/%3e%3c/g%3e%3cuse href='%23b' x='247' y='210'/%3e%3c/g%3e%3cuse href='%23c' x='494'/%3e%3c/g%3e%3cuse href='%23d' x='988'/%3e%3cuse href='%23c' x='1976'/%3e%3cuse href='%23e' x='2470'/%3e%3c/g%3e%3c/svg%3e") !important;
        }
        
        .PhoneInputCountrySelectArrow {
          width: 0 !important;
          height: 0 !important;
          border-left: 3px solid transparent !important;
          border-right: 3px solid transparent !important;
          border-top: 4px solid ${isDarkMode ? '#d1d5db' : '#6b7280'} !important;
          margin-left: 4px !important;
          flex-shrink: 0 !important;
        }
        
        /* Country dropdown */
        .PhoneInputCountrySelectDropdown {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          max-height: 200px !important;
          overflow-y: auto !important;
          background: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
          border: 1px solid ${isDarkMode ? '#374151' : '#d1d5db'} !important;
          border-radius: 6px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          z-index: 10000 !important;
          margin-top: 2px !important;
        }
        
        .PhoneInputCountryOption {
          padding: 8px 12px !important;
          cursor: pointer !important;
          color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
          display: flex !important;
          align-items: center !important;
          border: none !important;
          background: none !important;
          width: 100% !important;
          text-align: left !important;
        }
        
        .PhoneInputCountryOption:hover,
        .PhoneInputCountryOption--selected {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'} !important;
        }
        
        .PhoneInputCountryOption .PhoneInputCountryIcon {
          margin-right: 8px !important;
        }
        
        /* Fix for any layout issues */
        .PhoneInput * {
          box-sizing: border-box !important;
        }
        
        /* Ensure proper focus states */
        .PhoneInput:focus-within .PhoneInputCountrySelect {
          border-color: #3b82f6 !important;
        }
        
        .PhoneInput:focus-within .PhoneInputInput {
          border-color: #3b82f6 !important;
        }
      `}</style>
      
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={overlayStyles}
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          className="relative rounded-xl shadow-2xl"
          style={{
            ...modalStyles,
            // width: width,
            minWidth: minWidth,
            maxHeight: '90vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mb-5"
            style={{ zIndex: 1000000 }}
          >
            <CircleX size={24} color={iconColor} />
          </button>

          {/* Modal content */}
          <div className="p-10 pt-15">
            {title && (
              <h3 className="text-2xl mb-5">
                {title}
              </h3>
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModalWrapper;