
import React from 'react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings?: SiteSettings;
  onCategorySelect?: (category: string) => void;
  isAdminMode?: boolean;
  onAdmin?: () => void;
}

const Footer: React.FC<FooterProps> = ({ settings, onCategorySelect, isAdminMode, onAdmin }) => {
  if (!settings) return null;

  return (
    <footer className="bg-black border-t border-gray-900 pt-16 pb-12 mt-20 relative">
      {isAdminMode && (
        <div className="absolute top-8 right-8 z-20">
          <button 
            onClick={onAdmin}
            className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:brightness-110 flex items-center gap-2 border border-white/10"
          >
            FOOTER EDIT
          </button>
        </div>
      )}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h2 className="brand-serif font-black text-white mb-6" style={{ fontSize: `${settings.footerTitleSize}px` }}>
              <span className="brand-ai text-primary italic transform -skew-x-12 inline-block mr-2">
                {settings.brandAiLabel}
              </span>
              {settings.brandName}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {settings.footerDescription}
            </p>
            <div className="flex gap-4">
              <a href="https://blog.naver.com/asnggyun" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#2DB400] transition-all font-black">N</a>
              <a href="https://www.youtube.com/@PlayShortsKorea" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-red-600 transition-all font-black">Y</a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-black tracking-widest uppercase text-white mb-6 border-b border-gray-900 pb-2 footer-title-dynamic">기사 카테고리</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li onClick={() => onCategorySelect?.('환경감시')} className="hover:text-white cursor-pointer transition-colors">{settings.navEnvironment}</li>
              <li onClick={() => onCategorySelect?.('정치')} className="hover:text-white cursor-pointer transition-colors">{settings.navPolitics}</li>
              <li onClick={() => onCategorySelect?.('제보')} className="hover:text-white cursor-pointer transition-colors">{settings.navReport}</li>
              <li onClick={() => onCategorySelect?.('드론항공촬영')} className="hover:text-white cursor-pointer transition-colors">{settings.navVolunteer}</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-black tracking-widest uppercase text-white mb-6 border-b border-gray-900 pb-2 footer-title-dynamic">언론사 공시정보</h4>
            <div className="text-[11px] text-gray-500 space-y-3">
              <p><span className="text-gray-400 font-bold block mb-0.5 uppercase">등록번호 / 일자</span> {settings.registrationNum} / {settings.registrationDate}</p>
              <p><span className="text-gray-400 font-bold block mb-0.5 uppercase">발행인 / 편집인</span> {settings.publisher} / {settings.editor}</p>
              <p><span className="text-gray-400 font-bold block mb-0.5 uppercase">발행기관</span> {settings.companyName}</p>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-black tracking-widest uppercase text-white mb-6 border-b border-gray-900 pb-2 footer-title-dynamic">문의처</h4>
            <div className="text-sm text-gray-500 space-y-3">
              <p><span className="text-gray-300 font-bold block mb-1">본사 주소</span> {settings.address}</p>
              <p><span className="text-gray-300 font-bold block mb-1">대표 이메일</span> {settings.email}</p>
              <p><span className="text-gray-300 font-bold block mb-1">문의</span> {settings.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-950 pt-8 flex flex-wrap gap-x-8 gap-y-4 text-[10px] text-gray-700 uppercase tracking-widest font-bold">
          <span>개인정보 처리방침</span>
          <span>이용약관</span>
          <span>청소년 보호 정책</span>
          <span onClick={() => onCategorySelect?.('제보')}>제보하기</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
