
import React, { useState, useMemo, useEffect } from 'react';
import { NewsArticle, Category } from '../types';

interface EditorialArchivesProps {
  news: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
  isAdminMode?: boolean;
  activeCategory?: string | null;
  onCategoryChange?: (category: string) => void;
}

const EditorialArchives: React.FC<EditorialArchivesProps> = ({ 
  news, 
  onArticleClick, 
  isAdminMode,
  activeCategory,
  onCategoryChange
}) => {
  const [localTab, setLocalTab] = useState<string>('전체');
  
  useEffect(() => {
    setLocalTab(activeCategory || '전체');
  }, [activeCategory]);

  const coreCategories = ['전체', Category.POLITICS, Category.ENVIRONMENT, Category.ECONOMY, Category.LOCAL];

  const filteredNews = useMemo(() => {
    let base = news.filter(a => [Category.POLITICS, Category.ENVIRONMENT, Category.ECONOMY, Category.LOCAL].includes(a.category));
    if (localTab === '전체') return base;
    return base.filter(a => a.category === localTab);
  }, [news, localTab]);

  return (
    <section className="py-12 border-t border-zinc-900 scroll-mt-32" id="editorial-archives">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="brand-serif text-3xl md:text-5xl font-black text-white tracking-tighter italic">News Archives</h2>
        </div>
        
        {/* 모바일 횡스크롤 탭 */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto bg-zinc-900/40 p-1 rounded-2xl border border-zinc-800">
          {coreCategories.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setLocalTab(cat); onCategoryChange?.(cat === '전체' ? '' : cat); }}
              className={`flex-shrink-0 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 ${localTab === cat ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950/30 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="divide-y divide-zinc-900">
          {filteredNews.length === 0 ? (
            <div className="py-20 text-center text-zinc-800 font-black italic uppercase tracking-[0.3em]">No records found</div>
          ) : (
            filteredNews.slice(0, 10).map((article) => (
              <div 
                key={article.id}
                onClick={() => onArticleClick(article)}
                className="group flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-6 py-5 hover:bg-zinc-900/50 cursor-pointer transition-all active:bg-zinc-900"
              >
                <div className="col-span-2 mb-2 md:mb-0">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-zinc-800 text-zinc-500`}>
                    {article.category}
                  </span>
                </div>
                <div className="col-span-8 pr-4">
                  <h3 className="text-sm md:text-base font-bold text-zinc-300 group-hover:text-primary transition-colors line-clamp-1 truncate">
                    {article.title}
                  </h3>
                </div>
                <div className="col-span-2 flex justify-between items-center w-full md:justify-end gap-4 mt-2 md:mt-0 text-[9px] text-zinc-700 font-black uppercase tracking-widest">
                  <span className="truncate max-w-[80px]">{article.author}</span>
                  <span className="opacity-40">{article.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorialArchives;
