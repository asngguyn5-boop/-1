
import React from 'react';
import { AdContent, AdminTab } from '../types';

interface AdPlaceholderProps {
  type: 'display' | 'banner' | 'native' | 'hero';
  adContent?: AdContent;
  label?: string;
  className?: string;
  isAdminMode?: boolean;
  onAdmin?: (tab: AdminTab) => void;
  onExpand?: (src: string) => void;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  type, 
  adContent,
  label = 'ADVERTISEMENT', 
  className = '', 
  isAdminMode, 
  onAdmin,
  onExpand
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (adContent?.actionType === 'expand' && adContent.mediaUrl) {
      onExpand?.(adContent.mediaUrl);
      return;
    }

    if (adContent?.link && adContent.actionType === 'link' && adContent.link !== '#') {
      window.open(adContent.link, '_blank');
    }
  };

  const renderMedia = () => {
    if (!adContent?.mediaUrl || adContent.mediaType === 'none') return null;

    const opacity = adContent.opacity !== undefined ? adContent.opacity / 100 : 0.6;

    if (adContent.mediaType === 'youtube' || (adContent.mediaUrl.includes('youtube.com') || adContent.mediaUrl.includes('youtu.be'))) {
      let videoId = adContent.mediaUrl;
      if (videoId.includes('v=')) videoId = videoId.split('v=')[1].split('&')[0];
      else if (videoId.includes('youtu.be/')) videoId = videoId.split('youtu.be/')[1].split('?')[0];
      else if (videoId.includes('embed/')) videoId = videoId.split('embed/')[1].split('?')[0];

      return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <iframe 
            className="w-full h-full scale-[1.5] opacity-60"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
        </div>
      );
    }

    if (adContent.mediaType === 'video') {
      return (
        <video 
          src={adContent.mediaUrl} 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: opacity }}
        />
      );
    }

    return (
      <img 
        src={adContent.mediaUrl} 
        alt={adContent.title}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: opacity }}
      />
    );
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center overflow-hidden group cursor-pointer ${className}`}
    >
      {renderMedia()}

      <div className="absolute top-0 left-0 bg-black/60 backdrop-blur-sm text-zinc-500 text-[8px] px-3 py-1 font-black tracking-widest uppercase z-10 border-r border-b border-white/5">
        {adContent?.slot || label}
      </div>
      
      {isAdminMode && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdmin?.('ads'); }}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-3 border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            SLOT SETTINGS
          </button>
        </div>
      )}
      
      <div className="relative z-10 text-center p-8 pointer-events-none">
        <div className="text-white font-black text-2xl md:text-4xl mb-2 italic wp-serif drop-shadow-[0_5px_15px_rgba(0,0,0,1)] uppercase tracking-tighter leading-tight group-hover:scale-105 transition-transform">
          {adContent?.title || 'PREMIUM SPACE'}
        </div>
        <div className="text-primary font-black text-[10px] md:text-sm tracking-[0.4em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,1)] mt-4">
          {adContent?.subtitle || '문의 010-3425-0755'}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

export default AdPlaceholder;
