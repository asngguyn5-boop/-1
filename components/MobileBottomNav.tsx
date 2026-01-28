
import React from 'react';

interface MobileBottomNavProps {
  onNavigate: (target: string, category?: string) => void;
  onOpenAdmin: () => void;
  onOpenReception: () => void;
  activeTab: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate, onOpenAdmin, onOpenReception, activeTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-3xl border-t border-zinc-900 flex justify-around items-center py-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <button 
        onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); onNavigate('main'); }}
        className={`flex flex-col items-center gap-1 flex-1 active:scale-90 transition-all ${activeTab === 'home' ? 'text-primary' : 'text-zinc-600'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
      </button>

      <button 
        onClick={() => onNavigate('board-section', '자유게시판')}
        className="flex flex-col items-center gap-1 flex-1 active:scale-90 transition-all text-zinc-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-widest">Board</span>
      </button>

      <button 
        onClick={onOpenReception}
        className="flex flex-col items-center gap-1 flex-1 active:scale-90 transition-all text-zinc-600"
      >
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center -mt-6 border-4 border-black shadow-xl animate-bounce">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest mt-1 text-primary">Apply</span>
      </button>

      <button 
        onClick={() => onNavigate('profile-section')}
        className="flex flex-col items-center gap-1 flex-1 active:scale-90 transition-all text-zinc-600"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
      </button>

      <button 
        onClick={onOpenAdmin}
        className={`flex flex-col items-center gap-1 flex-1 active:scale-90 transition-all ${activeTab === 'admin' ? 'text-primary' : 'text-zinc-600'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
