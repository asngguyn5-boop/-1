
import React from 'react';
import { CommunityPost } from '../types';

interface NoticeTickerProps {
  notices: CommunityPost[];
  onClick: (post: CommunityPost) => void;
}

const NoticeTicker: React.FC<NoticeTickerProps> = ({ notices, onClick }) => {
  if (notices.length === 0) return null;

  return (
    <div className="bg-[#004EA2] text-white py-2 px-4 flex items-center gap-4 overflow-hidden relative group cursor-pointer" onClick={() => onClick(notices[0])}>
      <div className="flex-shrink-0 bg-white text-primary text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter animate-pulse">
        URGENT NOTICE
      </div>
      <div className="flex-grow whitespace-nowrap overflow-hidden relative">
        <div className="inline-block animate-marquee whitespace-nowrap font-bold text-sm">
          {notices.map((n, i) => (
            <span key={n.id} className="mr-20">
              [공지] {n.title} • {n.date}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 text-[10px] font-black opacity-50 group-hover:opacity-100 transition-opacity">
        VIEW ALL
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NoticeTicker;
