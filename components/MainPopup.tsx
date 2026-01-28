
import React, { useState, useEffect } from 'react';
import { PopupSettings } from '../types';

interface MainPopupProps {
  settings: PopupSettings;
  onAction?: (target: string) => void;
}

const MainPopup: React.FC<MainPopupProps> = ({ settings, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 드래그 관련 상태
  const [position, setPosition] = useState({ x: 48, y: 128 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hideUntil = localStorage.getItem('hidePopupUntil');
    if (settings.isActive && (!hideUntil || Date.now() > parseInt(hideUntil))) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [settings.isActive]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const closePopup = () => setIsOpen(false);

  const closeToday = () => {
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('hidePopupUntil', tomorrow.toString());
    setIsOpen(false);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction && settings.linkUrl) {
      onAction(settings.linkUrl);
      setIsOpen(false); // 이동 시 팝업 닫기
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-[200] select-none"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)'
      }}
    >
      <div 
        onMouseDown={onMouseDown}
        className={`
          bg-zinc-950 rounded-[2.8rem] overflow-hidden max-w-[320px] w-full 
          border-2 border-white/10 ring-1 ring-primary/30 
          shadow-[0_40px_100px_rgba(0,0,0,0.9),0_0_40px_rgba(0,78,162,0.2)] 
          animate-popIn backdrop-blur-3xl
          ${isDragging ? 'cursor-grabbing scale-[1.03] border-primary/40 ring-primary/50 shadow-primary/30' : 'cursor-grab'} 
          transition-all duration-300
        `}
      >
        <div className="relative aspect-[4/5] bg-black">
          {settings.mediaType === 'video' ? (
            <video src={settings.imageUrl} className="w-full h-full object-cover opacity-85" autoPlay muted loop playsInline />
          ) : (
            <img src={settings.imageUrl} alt={settings.title} className="w-full h-full object-cover opacity-85" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40"></div>
          
          {/* Close Icon - More visible with glass effect */}
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={closePopup}
            className="absolute top-5 right-5 bg-white/10 hover:bg-red-600 text-white p-2.5 rounded-full backdrop-blur-xl transition-all z-20 border border-white/20 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="absolute bottom-0 left-0 p-8 w-full text-white z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block">Premium Notice</span>
            </div>
            <h2 className="brand-serif text-2xl font-black mb-3 drop-shadow-2xl leading-tight tracking-tight">{settings.title}</h2>
            <p className="text-[12px] text-gray-400 mb-8 line-clamp-2 leading-relaxed drop-shadow-md font-medium">{settings.subtitle}</p>
            <button 
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleActionClick}
              className="block w-full bg-primary hover:bg-blue-600 text-white text-center font-black py-4 rounded-2xl shadow-[0_10px_25px_rgba(0,78,162,0.4)] transition-all active:scale-[0.96] transform text-xs uppercase tracking-[0.2em] border border-white/10"
            >
              Learn More
            </button>
          </div>
        </div>
        
        <div className="bg-zinc-900/90 backdrop-blur-2xl px-8 py-5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500 border-t border-white/10">
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={closeToday} 
            className="hover:text-primary transition-colors flex items-center gap-2.5 group"
          >
            <span className="w-3.5 h-3.5 rounded border-2 border-zinc-800 group-hover:border-primary transition-colors flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-primary scale-0 group-hover:scale-100 transition-transform rounded-sm"></div>
            </span>
            오늘 하루 보지 않기
          </button>
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={closePopup} 
            className="hover:text-white transition-colors font-black flex items-center gap-1"
          >
            CLOSE
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-popIn { animation: popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default MainPopup;
