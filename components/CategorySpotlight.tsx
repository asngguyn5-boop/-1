
import React from 'react';
import { Category, NewsArticle } from '../types';

interface CategorySpotlightProps {
  news: NewsArticle[];
  onCategorySelect: (category: string) => void;
  onArticleClick: (article: NewsArticle) => void;
}

const CategorySpotlight: React.FC<CategorySpotlightProps> = ({ news, onCategorySelect, onArticleClick }) => {
  const spotlightCategories = [
    { 
      id: Category.POLITICS, 
      label: '정치', 
      desc: '정직한 정치 현장',
      color: 'from-blue-600/30 to-zinc-950',
      borderColor: 'border-blue-500/20',
      accentColor: 'text-blue-400'
    },
    { 
      id: Category.ENVIRONMENT, 
      label: '환경감시', 
      desc: '지속 가능한 내일',
      color: 'from-emerald-600/30 to-zinc-950',
      borderColor: 'border-emerald-500/20',
      accentColor: 'text-emerald-400'
    },
    { 
      id: Category.ECONOMY, 
      label: '소상공인홍보', 
      desc: '지역 상생의 장',
      color: 'from-orange-600/30 to-zinc-950',
      borderColor: 'border-orange-500/20',
      accentColor: 'text-orange-400'
    },
    { 
      id: Category.LOCAL, 
      label: '천안소식', 
      desc: '사는 이야기',
      color: 'from-cyan-600/30 to-zinc-950',
      borderColor: 'border-cyan-500/20',
      accentColor: 'text-cyan-400'
    }
  ];

  return (
    <section className="py-10 md:py-20 relative overflow-hidden">
      <div className="flex flex-col mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-2 animate-fadeIn">
          <span className="w-8 h-[2px] bg-primary"></span>
          <p className="text-primary font-black tracking-[0.4em] text-[8px] md:text-[10px] uppercase">Spotlight</p>
        </div>
        <h2 className="wp-serif text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
          Editor's Picks
        </h2>
      </div>

      {/* 모바일 횡스크롤 컨테이너 */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 snap-x -mx-4 px-4 md:grid md:grid-cols-4 md:mx-0 md:px-0 md:overflow-visible">
        {spotlightCategories.map((cat, idx) => {
          const latestArticle = news.find(a => a.category === cat.id);
          
          return (
            <div 
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className={`flex-shrink-0 w-[80vw] md:w-full group relative h-[380px] md:h-[480px] bg-zinc-950 rounded-[2.5rem] border ${cat.borderColor} overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:scale-[1.03] snap-center active:scale-95`}
            >
              {/* Background */}
              <div className="absolute inset-0 z-0">
                {latestArticle ? (
                  <img src={latestArticle.imageUrl} className="w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" alt={cat.label} />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${cat.color}`}></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`w-1.5 h-1.5 rounded-full bg-current ${cat.accentColor} animate-pulse`}></span>
                     <span className="text-white text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
                  </div>
                  <h3 className="brand-serif text-xl md:text-2xl font-black text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {latestArticle?.title || `${cat.label} 섹션 준비 중`}
                  </h3>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                  <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Read More</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-primary transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySpotlight;
