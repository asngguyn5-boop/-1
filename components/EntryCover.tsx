
import React, { useState } from 'react';
import { SiteSettings } from '../types';

interface EntryCoverProps {
  settings: SiteSettings;
  onEnter: () => void;
}

const EntryCover: React.FC<EntryCoverProps> = ({ settings, onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnterClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  // TypeScript 커스텀 엘리먼트 캐스팅
  const SplineViewer = 'spline-viewer' as any;

  return (
    <div 
      className={`fixed inset-0 z-[1000] bg-black overflow-hidden transition-all duration-1000 ease-in-out cursor-pointer
        ${isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
      onClick={handleEnterClick}
    >
      {/* 3D Spline Scene */}
      <div className="absolute inset-0 z-0">
        <SplineViewer 
          url="https://prod.spline.design/Iu1JQq-8kmewDmQn/scene.splinecode" 
          className="w-full h-full"
        ></SplineViewer>
      </div>

      {/* Aesthetic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pb-20">
        <div className="space-y-4 animate-float">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 mb-8 shadow-2xl">
            <span className="text-primary font-black text-xs uppercase tracking-[0.5em]">{settings.brandAiLabel} TECHNOLOGY</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-white font-black text-xs uppercase tracking-[0.5em]">CHEONAN NEWS</span>
          </div>
          
          <div className="space-y-4">
            <h2 className="brand-serif text-3xl md:text-5xl text-white/60 italic tracking-widest uppercase mb-4 transition-all duration-700">
              {settings.brandSlogan}
            </h2>
            
            <h1 className="brand-serif text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <span className="brand-ai text-primary ai-glow mr-3 italic">{settings.brandAiLabel}</span>
              {settings.brandName}
            </h1>
          </div>
          
          <p className="wp-serif text-lg md:text-2xl text-zinc-400 font-light mt-10 max-w-2xl mx-auto italic text-keep-all px-4">
            "천안의 소식을 인공지능과 혁신적인 기획으로 디자인합니다."
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-16 group relative">
          <button 
            onClick={(e) => { e.stopPropagation(); handleEnterClick(); }}
            className="relative flex flex-col items-center gap-4 transition-all hover:scale-110 active:scale-95"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-primary transition-colors overflow-hidden relative">
               <div className="w-2 h-2 rounded-full bg-white group-hover:bg-primary transition-colors"></div>
               <div className="absolute inset-0 border border-primary rounded-full animate-ping opacity-0 group-hover:opacity-40"></div>
            </div>
            <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-[0.6em] ml-1">Click to Explore</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EntryCover;
