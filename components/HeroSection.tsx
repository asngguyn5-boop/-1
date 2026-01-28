
import React from 'react';
import { NewsArticle, SiteSettings } from '../types';

interface HeroSectionProps {
  article: NewsArticle;
  onClick: (article: NewsArticle) => void;
  isAdminMode?: boolean;
  onEdit?: (article: NewsArticle) => void;
  settings: SiteSettings;
}

const HeroSection: React.FC<HeroSectionProps> = ({ article, onClick, isAdminMode, onEdit, settings }) => {
  return (
    <section 
      className="relative overflow-hidden shadow-2xl rounded-global h-[200px] md:h-[280px] bg-zinc-950 border border-zinc-900 group"
    >
      {/* Background with reduced opacity for text clarity */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {article.imageUrl && (
          <div className="absolute inset-0">
            <img 
              src={article.imageUrl} 
              className="w-full h-full object-cover opacity-40 transition-transform duration-[10000ms] group-hover:scale-105" 
              alt={article.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
        )}
      </div>

      {isAdminMode && (
        <div className="absolute top-2 right-2 z-40">
          <button 
            onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(article); }}
            className="bg-primary text-white px-3 py-1 rounded-full font-black text-[8px] border border-primary/20"
          >
            EDIT
          </button>
        </div>
      )}

      {/* Compact Hero Content */}
      <div className="relative z-10 p-5 md:p-10 flex flex-col h-full justify-center">
        
        {/* Label and Slogan */}
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-lg">HOT</span>
          <span className="text-zinc-400 font-black text-[9px] uppercase tracking-[0.3em]">{settings.brandSlogan}</span>
        </div>

        {/* Optimized Title & Summary for Small Space */}
        <div className="cursor-pointer" onClick={() => onClick(article)}>
          <h2 
            className="brand-serif font-black text-white leading-[1.1] mb-2 drop-shadow-lg text-2xl md:text-4xl lg:text-5xl tracking-tighter text-keep-all line-clamp-1 group-hover:text-primary transition-colors"
          >
            {article.title}
          </h2>
          
          <p className="text-zinc-300 text-[10px] md:text-sm max-w-3xl line-clamp-1 md:line-clamp-2 opacity-80 font-light border-l border-primary/50 pl-3">
            {article.summary}
          </p>
        </div>

        {/* Contact Strip */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            <span className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Headline Report</span>
          </div>
          <div className="bg-black/40 px-3 py-1 rounded-lg border border-white/5">
            <span className="text-yellow-500 font-black text-xs md:text-base">{settings.heroPhone}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
