
import React, { useState } from 'react';
import { NewsArticle, GoodsItem, AdContent, AdminTab, SiteSettings } from '../types';
import AdPlaceholder from './AdPlaceholder';

interface SidebarProps {
  news: NewsArticle[];
  goods: GoodsItem[];
  ads: AdContent[];
  settings: SiteSettings;
  onArticleClick: (article: NewsArticle) => void;
  isAdminMode?: boolean;
  onAdmin?: (tab: AdminTab) => void;
  onExpand?: (src: string) => void;
  onInternalSearch?: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ news, goods, ads, settings, onArticleClick, isAdminMode, onAdmin, onExpand, onInternalSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarAd = ads.find(a => a.slot === 'sidebar_ad');

  const handleSearch = (engine: 'internal' | 'naver' | 'google' | 'cheonan' | 'chungnam') => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해 주세요.');
      return;
    }
    
    if (engine === 'internal') {
      onInternalSearch?.(searchQuery);
    } else {
      let url = '';
      switch (engine) {
        case 'naver':
          url = `https://search.naver.com/search.naver?query=${encodeURIComponent(searchQuery)}`;
          break;
        case 'google':
          url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
          break;
        case 'cheonan':
          url = `https://www.cheonan.go.kr/search/search.do?query=${encodeURIComponent(searchQuery)}`;
          break;
        case 'chungnam':
          url = `https://www.chungnam.go.kr/search.do?query=${encodeURIComponent(searchQuery)}`;
          break;
      }
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 sticky top-24">
      {/* 1. 검색 섹션 */}
      <section className="bg-zinc-900/80 border border-zinc-800 p-5 sm:p-6 rounded-global shadow-xl">
        <h4 className="font-black uppercase text-white mb-4 tracking-widest flex items-center gap-2 sidebar-title-dynamic">
          <span className="w-1 h-3 bg-primary inline-block"></span>
          통합 검색
        </h4>
        <div className="space-y-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch('internal')}
              className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" 
            />
            <button 
              onClick={() => handleSearch('internal')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
          <button onClick={() => handleSearch('internal')} className="w-full bg-primary text-white font-black py-2.5 rounded-lg text-xs shadow-lg hover:bg-blue-700 transition-colors">기사 검색</button>
        </div>
      </section>

      {/* 2. SIDEBAR AD */}
      <AdPlaceholder 
        type="native" 
        adContent={sidebarAd} 
        className="h-48 rounded-global shadow-xl" 
        isAdminMode={isAdminMode}
        onAdmin={onAdmin}
        onExpand={onExpand}
      />

      {/* 3. 실시간 인기 기사 */}
      <section>
        <h4 className="font-black uppercase border-b border-white pb-2 mb-6 text-white tracking-widest sidebar-title-dynamic">실시간 인기 기사</h4>
        <div className="space-y-6">
          {news.slice(0, 5).map((article, idx) => (
            <div key={article.id} className="flex gap-4 group cursor-pointer relative" onClick={() => onArticleClick(article)}>
              <span className="text-2xl sm:text-3xl font-black text-zinc-800 leading-none group-hover:text-primary transition-colors shrink-0">{idx + 1}</span>
              <div className="flex flex-col">
                <h5 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:underline line-clamp-2 leading-snug">{article.title}</h5>
                <span className="text-[9px] sm:text-[10px] text-zinc-600 mt-1 font-bold">{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. YouTube 채널 */}
      <section className="bg-white rounded-global p-5 sm:p-6 shadow-xl border-4 border-red-600">
        <h4 className="text-blue-900 font-black text-[10px] sm:text-xs uppercase mb-1">YouTube Channel</h4>
        <h5 className="text-xl sm:text-2xl font-black text-gray-900 brand-serif mb-4">{settings.brandSlogan}</h5>
        <a href="https://www.youtube.com/@PlayShortsKorea" target="_blank" rel="noopener noreferrer" className="block text-center bg-red-600 text-white font-black py-3 rounded-full text-xs sm:text-sm hover:bg-red-700 transition-colors shadow-lg">구독하기</a>
      </section>
    </div>
  );
};

export default Sidebar;
