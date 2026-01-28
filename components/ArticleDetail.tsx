
import React from 'react';
import { NewsArticle, AdContent } from '../types';
import AdPlaceholder from './AdPlaceholder';

interface ArticleDetailProps {
  article: NewsArticle;
  onBack: () => void;
  isAdminMode?: boolean;
  onEdit?: () => void;
  onAdmin?: () => void;
  adMiddle?: AdContent;
  onImageClick?: (src: string) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, isAdminMode, onEdit, onAdmin, adMiddle, onImageClick }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('기사 링크가 복사되었습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 pb-32 animate-fadeIn">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="flex items-center text-xs font-bold text-zinc-500 hover:text-white group uppercase tracking-widest bg-zinc-900/50 px-5 py-2.5 rounded-full border border-zinc-800 transition-all">
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          목록으로 돌아가기
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare} className="bg-zinc-900 text-zinc-400 p-2 rounded-full border border-zinc-800 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.000l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
          {isAdminMode && <button onClick={onEdit} className="bg-primary text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">기사 수정</button>}
        </div>
      </div>

      <header className="mb-12 border-b border-zinc-900 pb-12">
        <span className={`font-black uppercase text-xs tracking-[0.3em] block mb-6 ${article.isSponsored ? 'text-yellow-500' : 'text-primary'}`}>
          {article.isSponsored ? 'ADVERTISEMENT' : article.category}
        </span>
        <h1 className="wp-serif font-black leading-tight mb-10 hero-title-dynamic text-white">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[11px] text-zinc-500 uppercase tracking-widest font-black">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
            <span>AUTHOR: {article.author}</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800 hidden md:block"></div>
          <div>DATE: {article.date}</div>
        </div>
      </header>

      {article.imageUrl && (
        <div className="mb-12 rounded-[2.5rem] overflow-hidden border border-zinc-900 shadow-2xl group bg-zinc-900">
          <img 
            src={article.imageUrl} 
            className="w-full h-auto object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-[1.02]" 
            alt={article.title}
            onClick={() => onImageClick?.(article.imageUrl)}
          />
          <div className="p-4 bg-zinc-900/50 backdrop-blur-md text-[10px] text-zinc-500 uppercase tracking-widest font-bold border-t border-zinc-800 flex justify-between">
            <span>Cheonan News Visual Archive</span>
            <span>Click image to enlarge</span>
          </div>
        </div>
      )}

      <div className="prose prose-invert max-w-none leading-relaxed">
        <div className="text-xl md:text-2xl font-bold mb-12 border-l-4 border-primary pl-6 md:pl-10 py-6 bg-zinc-900/30 italic text-zinc-100 rounded-r-3xl">
          {article.summary}
        </div>
        <div className="space-y-8 body-text-dynamic text-zinc-300">
          {article.content.split('\n').map((para, i) => para.trim() && <p key={i} className="mb-6 leading-[1.8]">{para}</p>)}
        </div>
      </div>
      
      <div className="mt-20 pt-10 border-t border-zinc-900 flex justify-center">
        <button onClick={onBack} className="bg-zinc-900 text-zinc-500 px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800 shadow-xl active:scale-95">
          전체 기사 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ArticleDetail;
