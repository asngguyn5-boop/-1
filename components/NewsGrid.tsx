
import React from 'react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onArticleClick: (article: NewsArticle) => void;
  isLarge?: boolean;
}

interface NewsGridProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onArticleClick, isLarge }) => {
  return (
    <article 
      className={`group cursor-pointer bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-primary hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${isLarge ? 'flex flex-col' : ''}`}
      onClick={() => onArticleClick(article)}
    >
      <div className={`overflow-hidden relative ${isLarge ? 'h-64 md:h-80' : 'h-48 md:h-64'}`}>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>
      
      <div className="p-8 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{article.category}</span>
          <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
          <span className="text-[10px] text-zinc-600 font-bold">{article.date}</span>
        </div>

        <h3 className={`brand-serif font-black text-white leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-4 tracking-tight ${isLarge ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}>
          {article.title}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2 font-light leading-relaxed border-l border-zinc-800 pl-4">
          {article.summary}
        </p>
      </div>
    </article>
  );
};

const NewsGrid: React.FC<NewsGridProps> = ({ articles, onArticleClick }) => {
  return (
    <section className="space-y-12">
      {/* Top Spotlight Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {articles.slice(0, 2).map((article) => (
          <NewsCard key={article.id} article={article} onArticleClick={onArticleClick} isLarge={true} />
        ))}
      </div>

      {/* Detailed List Row */}
      <div className="space-y-6">
        {articles.slice(2, 6).map((article) => (
          <article 
            key={article.id} 
            onClick={() => onArticleClick(article)}
            className="group flex gap-8 items-center border-b border-zinc-900 pb-8 last:border-0 hover:bg-zinc-900/10 transition-all p-6 rounded-[2rem] cursor-pointer"
          >
            <div className="w-24 h-24 md:w-48 md:h-32 rounded-2xl overflow-hidden shrink-0 shadow-xl">
               <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
            </div>
            <div className="min-w-0 flex-grow">
               <div className="flex items-center gap-3 mb-3">
                 <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{article.category}</span>
                 <span className="text-[9px] text-zinc-700 uppercase font-black">{article.date}</span>
               </div>
               <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors truncate tracking-tight">{article.title}</h4>
               <p className="text-zinc-600 text-sm mt-3 line-clamp-1 font-light italic">{article.summary}</p>
            </div>
            <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full border border-zinc-900 items-center justify-center text-zinc-800 group-hover:bg-primary group-hover:text-white transition-all">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsGrid;
