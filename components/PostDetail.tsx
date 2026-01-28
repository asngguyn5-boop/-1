
import React from 'react';
import { CommunityPost } from '../types';

interface PostDetailProps {
  post: CommunityPost;
  onBack: () => void;
  isAdminMode?: boolean;
  // Added onEdit to match props passed in App.tsx
  onEdit?: () => void;
  onConvertToArticle?: () => void;
  onDelete?: () => void;
}

// Destructured onEdit from props
const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, isAdminMode, onEdit, onConvertToArticle, onDelete }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0 animate-fadeIn">
      {/* Container for navigation and edit actions */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="flex items-center text-xs font-black text-zinc-500 hover:text-white uppercase tracking-widest group bg-zinc-900/50 px-5 py-2.5 rounded-full border border-zinc-800 transition-all">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          게시판 목록으로 돌아가기
        </button>
        {/* Added Edit button for administrators */}
        {isAdminMode && (
          <button 
            onClick={onEdit} 
            className="bg-primary text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl border border-white/10 hover:brightness-110 active:scale-95 transition-all"
          >
            게시글 수정
          </button>
        )}
      </div>

      <article className="bg-zinc-950/80 border border-zinc-900 rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden backdrop-blur-xl">
        <header className="mb-12 border-b border-zinc-900 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${post.isNotice ? 'bg-red-600 text-white shadow-red-900/20' : 'bg-primary/20 text-primary'}`}>
              {post.category}
            </span>
            {post.isHot && <span className="bg-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">HOT TOPIC</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-10 italic wp-serif tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-[11px] text-zinc-600 uppercase tracking-widest font-black">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
               <span className="text-zinc-300">작성자: {post.author}</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
               <span>일자: {post.date}</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-primary/30"></div>
               <span className="text-primary">조회수 {post.views}</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-cyan-900"></div>
               <span className="text-cyan-600">댓글 {post.comments}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="space-y-12">
          {/* Gallery - attached images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 gap-6 mb-12">
              {post.images.map((img, idx) => (
                <div key={idx} className="rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl group bg-black">
                  <img src={img} className="w-full h-auto object-contain transition-all" alt={`첨부 이미지 ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-lg md:text-xl min-h-[200px] font-light border-l-2 border-zinc-900 pl-8">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className="mb-6 last:mb-0">{line.trim()}</p>
            ))}
          </div>

          {/* Attached Files Section */}
          {post.files && post.files.length > 0 && (
            <div className="mt-20 pt-12 border-t border-zinc-900">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">시스템 첨부 파일 자료실</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.files.map((file, idx) => (
                  <a 
                    key={idx} 
                    href={file.url} 
                    download={file.name}
                    className="flex items-center justify-between bg-zinc-900/40 border border-zinc-900 p-5 rounded-[1.5rem] hover:bg-zinc-800/60 hover:border-primary transition-all group shadow-inner"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-zinc-300 truncate group-hover:text-white">{file.name}</p>
                        {file.size && <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">용량: {file.size}</p>}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-800 group-hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {isAdminMode && (
          <div className="mt-20 pt-10 border-t border-zinc-900 flex flex-wrap justify-end gap-4">
             <div className="mr-auto">
               <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest mb-1">Admin Operations</p>
               <span className="text-[10px] text-zinc-600 italic">게시글 관리 모드 활성화됨</span>
             </div>
            <button 
              onClick={onConvertToArticle} 
              className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
            >
              기획 기사로 전환
            </button>
            <button 
              onClick={() => window.confirm('해당 게시글을 영구적으로 삭제하시겠습니까?') && onDelete?.()} 
              className="bg-red-900/10 text-red-500 border border-red-900/20 hover:bg-red-600 hover:text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
            >
              게시글 영구 삭제
            </button>
          </div>
        )}
      </article>
      
      <div className="mt-12 flex justify-center">
         <button onClick={onBack} className="text-zinc-700 text-[10px] font-black uppercase tracking-[1em] hover:text-white transition-colors">
            Back to List
         </button>
      </div>
    </div>
  );
};

export default PostDetail;
