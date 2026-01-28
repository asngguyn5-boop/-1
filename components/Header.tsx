
import React, { useState, useEffect } from 'react';
import { SiteSettings, User } from '../types';

interface HeaderProps {
  onHome: () => void;
  onCategorySelect: (category: string) => void;
  onAdmin: () => void;
  onOpenMenu: () => void;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
  settings: SiteSettings;
  currentUser: User | null;
  onLoginClick: () => void;
  // Fixed: Made onRegisterClick optional to resolve missing property error in App.tsx
  onRegisterClick?: () => void;
  onLogout: () => void;
  onEdit?: () => void;
  onNoticeDetail: () => void;
  onScrollTo: (id: string, category?: string) => void;
  onOpenReception?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onHome, onCategorySelect, onAdmin, onOpenMenu, isAdminMode, onToggleAdminMode, settings, currentUser, onLoginClick, onLogout, onNoticeDetail, onScrollTo, onOpenReception
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-[100] bg-black border-b border-zinc-900 transition-all duration-300 ${isScrolled ? 'shadow-2xl' : ''}`}>
      <div className="container-wide">
        {/* Top Utility: Massive MENU Button */}
        <div className="flex justify-between items-center py-4 md:py-6 border-b border-zinc-800/30">
          <button 
            onClick={onOpenMenu} 
            className="flex items-center gap-3 bg-[#004EA2] hover:bg-white px-6 md:px-10 py-3 md:py-4 rounded-[1.5rem] border border-white/10 group transition-all shadow-[0_10px_30px_rgba(0,78,162,0.4)] active:scale-95"
          >
            <div className="flex flex-col gap-1.5 w-6 md:w-8">
              <span className="h-1 w-full bg-white group-hover:bg-[#004EA2] rounded-full"></span>
              <span className="h-1 w-full bg-white group-hover:bg-[#004EA2] rounded-full"></span>
              <span className="h-1 w-full bg-white group-hover:bg-[#004EA2] rounded-full"></span>
            </div>
            <span className="tracking-[0.2em] text-sm md:text-xl font-black text-white group-hover:text-[#004EA2] uppercase">MENU</span>
          </button>

          <div className="flex items-center gap-4">
            <button onClick={onHome} className="brand-ai text-4xl md:text-6xl font-black text-primary italic transform -skew-x-12 select-none ai-glow group transition-transform hover:scale-105 active:scale-95">
              {settings.brandAiLabel}
            </button>
            <button onClick={onToggleAdminMode} className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${isAdminMode ? 'bg-primary text-white border-primary shadow-lg' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}>
              {isAdminMode ? 'ADMIN ACTIVE' : 'ADMIN'}
            </button>
          </div>
        </div>

        {/* Main Nav: 9개 항목 최적화 레이아웃 */}
        <nav className="py-3 md:py-6">
          <ul className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar md:justify-center px-2 pb-2">
            {isScrolled && (
              <li className="shrink-0 mr-3 pr-5 border-r border-zinc-800 flex items-center transition-all animate-fadeIn">
                 <button onClick={onOpenMenu} className="mr-4 text-white hover:text-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                 </button>
                 <span onClick={onHome} className="brand-ai text-2xl md:text-3xl font-black text-primary italic transform -skew-x-12 cursor-pointer">{settings.brandAiLabel}</span>
              </li>
            )}

            <li className="shrink-0">
              <button onClick={onNoticeDetail} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">공지</button>
            </li>
            <li className="shrink-0">
              <button onClick={() => onCategorySelect('천안소식')} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">천안소식</button>
            </li>
            <li className="shrink-0">
              <button onClick={() => onCategorySelect('정치')} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">정치</button>
            </li>
            <li className="shrink-0">
              <button onClick={() => onScrollTo('reception-section')} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">홍보/기획</button>
            </li>
            <li className="shrink-0">
              <button onClick={() => onCategorySelect('환경감시')} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">환경감시/제보</button>
            </li>
            <li className="shrink-0">
              <button onClick={() => onCategorySelect('드론항공촬영')} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">드론항공촬영</button>
            </li>
            <li className="shrink-0">
              <button onClick={() => onScrollTo('reception-section')} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">탐정/인력</button>
            </li>
            <li className="shrink-0">
              <button onClick={() => onScrollTo('board-section', '자유게시판')} className="bg-[#FFD700] hover:bg-white text-black px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-lg transition-all active:scale-95">자유게시판</button>
            </li>
            <li className="shrink-0">
              <button onClick={onOpenReception} className="bg-[#004EA2] text-white px-6 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-2xl shadow-2xl border-2 border-white/20 hover:bg-white hover:text-[#004EA2] transition-all active:scale-95 ml-1 animate-pulse">접수신청</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
