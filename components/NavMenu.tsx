
import React from 'react';
import { SiteSettings, Category } from '../types';

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onNavigate: (target: string, type: 'view' | 'scroll' | 'category' | 'reception') => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose, settings, onNavigate }) => {
  if (!isOpen) return null;

  const menuGroups = [
    {
      title: 'NEWS CENTER',
      subtitle: '천안의 실시간 주요 소식',
      items: [
        { label: '종합 헤드라인', target: 'main', type: 'view' },
        { label: settings.navPolitics, target: '정치', type: 'category' },
        { label: settings.navEnvironment, target: '환경감시', type: 'category' },
        { label: settings.navPromo, target: '소상공인홍보', type: 'category' },
        { label: settings.navReport, target: '제보', type: 'category' },
        { label: settings.navVolunteer, target: '드론항공촬영', type: 'category' },
      ]
    },
    {
      title: 'COMMUNITY',
      subtitle: '시민 소통 및 정보 공유',
      items: [
        { label: '공지사항 안내', target: '공지', type: 'category' },
        { label: '전체 게시판', target: 'board-section', type: 'scroll' },
        { label: '자유 소통 광장', target: 'board-section', type: 'scroll' },
      ]
    },
    {
      title: 'BUSINESS',
      subtitle: '종합기획사 전문 솔루션',
      items: [
        { label: '영상/홍보물 제작 접수', target: 'rs1', type: 'reception' },
        { label: '드론 촬영 상담 신청', target: 'rs2', type: 'reception' },
        { label: '탐정 및 인력관리 서비스', target: 'rs3', type: 'reception' },
        { label: '지역 제휴 상품관', target: 'affiliate-section', type: 'scroll' },
        { label: '공식 굿즈 스토어', target: 'goods-section', type: 'scroll' },
      ]
    },
    {
      title: 'ABOUT BRAND',
      subtitle: 'AI천안뉴스 미디어 비전',
      items: [
        { label: '대표 김상균 약력', target: 'profile-section', type: 'scroll' },
        { label: '상균아놀자tv 유튜브', target: 'youtube-section', type: 'scroll' },
        { label: '광고 및 입점 문의', target: 'footer', type: 'scroll' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-3xl animate-fadeIn overflow-y-auto no-scrollbar">
      <div className="container mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-12 lg:mb-20 border-b border-white/5 pb-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-6">
             <span className="brand-ai text-5xl font-black text-primary italic transform -skew-x-12 select-none tracking-tighter">{settings.brandAiLabel}</span>
             <h2 className="brand-serif text-2xl md:text-3xl font-black text-white">{settings.brandName} <span className="text-zinc-800 mx-2">/</span> {settings.brandSubName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="group flex items-center gap-4 text-zinc-500 hover:text-white transition-all font-black text-xs uppercase tracking-[0.5em]"
          >
            CLOSE
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:rotate-90 transition-all duration-500 shadow-2xl">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 max-w-7xl mx-auto w-full">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-10 animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div>
                <h3 className="wp-serif text-3xl md:text-4xl font-black text-white tracking-tighter italic border-l-4 border-primary pl-6 leading-none">{group.title}</h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.4em] mt-3 pl-7">{group.subtitle}</p>
              </div>
              <ul className="space-y-4 pl-7">
                {group.items.map((item, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => onNavigate(item.target, item.type as any)}
                      className="text-lg md:text-xl font-bold text-zinc-500 hover:text-primary transition-all flex items-center gap-4 group text-left"
                    >
                      <span className="w-2 h-2 rounded-full bg-zinc-900 group-hover:bg-primary transition-all group-hover:scale-125"></span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Social / Contacts */}
        <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-zinc-700 max-w-7xl mx-auto w-full">
           <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest">
              <span className="text-zinc-400">HOTLINE: {settings.heroPhone}</span>
              <span>PUBLISHER: {settings.publisher}</span>
              <span className="hidden md:inline">REG: {settings.registrationNum}</span>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-900 italic">Premium Independent Media & Agency Platform</p>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NavMenu;
