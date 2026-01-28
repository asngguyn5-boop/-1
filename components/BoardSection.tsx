
import React, { useState } from 'react';
import { CommunityPost } from '../types';
import WritePostModal from './WritePostModal';

interface BoardSectionProps {
  posts: CommunityPost[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onPostClick: (post: CommunityPost) => void;
  isAdminMode?: boolean;
  onAdmin?: () => void;
  onNewPost: (post: Omit<CommunityPost, 'id' | 'views' | 'comments' | 'date'>) => void;
  primaryColor: string;
}

const BoardSection: React.FC<BoardSectionProps> = ({ posts, activeCategory, onCategoryChange, onPostClick, isAdminMode, onAdmin, onNewPost, primaryColor }) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [modalInitialCategory, setModalInitialCategory] = useState<string | undefined>(undefined);
  
  const categories = ['전체', '우리동네', '자유게시판', '벼룩시장', '육아/일상', '구인구직', '천안소식', '드론항공촬영', '공지'];

  const filteredPosts = activeCategory === '전체' 
    ? posts 
    : posts.filter(p => p.category === activeCategory || (activeCategory !== '공지' && p.isNotice));

  const openWriteModal = (category?: string) => {
    setModalInitialCategory(category);
    setIsWriteModalOpen(true);
  };

  return (
    <section className="py-8 md:py-16 border-t border-zinc-900 scroll-mt-32 relative" id="board-section">
      {isAdminMode && (
        <div className="absolute top-2 right-2 z-20">
          <button 
            onClick={onAdmin}
            className="bg-primary text-white px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-90"
          >
            CMS
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4 md:gap-6">
        <div>
          <h2 className="wp-serif font-black text-white mb-2 tracking-tighter italic uppercase text-3xl md:text-5xl">Community</h2>
          <p className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase">천안 시민 소통 광장</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => openWriteModal('천안소식')} className="bg-red-600 active:scale-95 text-white font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg flex-grow sm:flex-grow-0">제보</button>
          <button onClick={() => openWriteModal()} className="bg-white active:scale-95 text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex-grow sm:flex-grow-0 shadow-lg">글쓰기</button>
        </div>
      </div>

      <div className="flex border-b border-zinc-900 mb-6 overflow-x-auto no-scrollbar scroll-smooth gap-1">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => onCategoryChange(cat)} 
            className={`px-4 py-3 text-[11px] font-black transition-all rounded-t-xl whitespace-nowrap uppercase tracking-widest active:bg-zinc-800 ${activeCategory === cat ? 'bg-zinc-900 text-primary border-b-2 border-primary' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-zinc-950/30 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="divide-y divide-zinc-900">
          {filteredPosts.length === 0 ? (
            <div className="p-10 text-center text-zinc-800 font-black italic uppercase tracking-[0.3em]">No activity</div>
          ) : (
            filteredPosts.map(post => (
              <div 
                key={post.id} 
                onClick={() => onPostClick(post)} 
                className={`flex flex-col md:grid md:grid-cols-12 items-start md:items-center py-4 px-6 hover:bg-zinc-900/40 cursor-pointer transition-all active:bg-zinc-900 group ${post.isNotice ? 'bg-zinc-900/20' : ''}`}
              >
                <div className="col-span-1 mb-1 md:mb-0">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${post.isNotice ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    {post.category}
                  </span>
                </div>
                <div className="col-span-7 flex items-center gap-3 w-full min-w-0">
                  <h3 className={`text-sm md:text-base font-bold truncate group-hover:text-primary transition-colors flex-grow min-w-0 ${post.isNotice ? 'text-white' : 'text-zinc-300'}`}>{post.title}</h3>
                </div>
                <div className="flex items-center gap-4 mt-1 md:mt-0 text-[9px] text-zinc-600 w-full font-black uppercase tracking-widest md:col-span-4">
                  <div className="shrink-0">{post.author}</div>
                  <div className="ml-auto opacity-40">{post.date}</div>
                  <div className="hidden md:block opacity-30">VIEW {post.views}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isWriteModalOpen && (
        <WritePostModal onClose={() => setIsWriteModalOpen(false)} onSubmit={onNewPost} primaryColor={primaryColor} initialCategory={modalInitialCategory} />
      )}
    </section>
  );
};

export default BoardSection;
