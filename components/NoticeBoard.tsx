
import React from 'react';
import { CommunityPost } from '../types';

interface NoticeBoardProps {
  posts: CommunityPost[];
  onPostClick: (post: CommunityPost) => void;
  onBack: () => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ posts, onPostClick, onBack }) => {
  const notices = posts.filter(p => p.isNotice);

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fadeIn">
      <div className="flex items-center justify-between mb-12 border-b-4 border-white pb-6">
        <div>
          <h1 className="wp-serif text-5xl font-black text-white italic uppercase tracking-tighter">OFFICIAL NOTICES</h1>
          <p className="text-primary font-bold text-xs tracking-[0.3em] uppercase mt-2">AI천안뉴스 공식 알림판</p>
        </div>
        <button onClick={onBack} className="text-xs font-black text-zinc-500 hover:text-white uppercase tracking-widest border border-zinc-800 px-6 py-2 rounded-full">
          HOME
        </button>
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="py-32 text-center text-zinc-600 font-bold uppercase tracking-widest italic">No notices posted yet</div>
        ) : (
          notices.map(post => (
            <div 
              key={post.id} 
              onClick={() => onPostClick(post)}
              className="bg-zinc-950 border-l-4 border-primary p-6 hover:bg-zinc-900 transition-all cursor-pointer group flex justify-between items-center"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Announcement</span>
                  <span className="text-[10px] text-zinc-600 font-bold">{post.date}</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{post.title}</h3>
              </div>
              <div className="w-10 h-10 rounded-full border border-zinc-900 flex items-center justify-center text-zinc-600 group-hover:bg-primary group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
