
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
    <footer className="bg-black border-t border-gray-900 pt-16 pb-12 mt-20 relative overflow-hidden" id="footer">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mb-64"></div>
      
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
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <h2 className="brand-serif font-black text-white mb-6 flex items-center" style={{ fontSize: `${settings.footerTitleSize}px` }}>
              <span className="brand-ai text-primary italic transform -skew-x-12 inline-block mr-3 ai-glow">
                {settings.brandAiLabel}
              </span>
              {settings.brandName}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              {settings.footerDescription}
            </p>
            <div className="flex gap-4">
              <a href="https://blog.naver.com/asnggyun" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-[#2DB400] hover:border-[#2DB400]/30 transition-all font-black shadow-xl">N</a>
              <a href="https://www.youtube.com/@PlayShortsKorea" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-600 hover:border-red-600/30 transition-all font-black shadow-xl">Y</a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-black tracking-[0.2em] uppercase text-zinc-400 mb-6 border-b border-zinc-900 pb-2 text-[11px]">기사 카테고리</h4>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li onClick={() => onCategorySelect?.('환경감시')} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-zinc-800"></div> {settings.navEnvironment}
              </li>
              <li onClick={() => onCategorySelect?.('정치')} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-zinc-800"></div> {settings.navPolitics}
              </li>
              <li onClick={() => onCategorySelect?.('천안소식')} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-zinc-800"></div> {settings.navReport}
              </li>
              <li onClick={() => onCategorySelect?.('드론항공촬영')} className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-zinc-800"></div> {settings.navVolunteer}
              </li>
            </ul>
          </div>

          <div className="md:col-span-6">
            <h4 className="font-black tracking-[0.2em] uppercase text-zinc-400 mb-6 border-b border-zinc-900 pb-2 text-[11px]">언론사 공시 및 법적 고지</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  <span className="text-zinc-700 font-black block mb-1 text-[10px] uppercase tracking-widest">등록번호 / 등록일자</span>
                  {settings.registrationNum} / {settings.registrationDate}
                </p>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  <span className="text-zinc-700 font-black block mb-1 text-[10px] uppercase tracking-widest">발행인 겸 편집인</span>
                  {settings.publisher}
                </p>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  <span className="text-zinc-700 font-black block mb-1 text-[10px] uppercase tracking-widest">청소년보호책임자</span>
                  {settings.youthProtectionOfficer}
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  <span className="text-zinc-700 font-black block mb-1 text-[10px] uppercase tracking-widest">본사 주소</span>
                  {settings.address}
                </p>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  <span className="text-zinc-700 font-black block mb-1 text-[10px] uppercase tracking-widest">고객 센터</span>
                  전화: {settings.phone}<br/>
                  이메일: {settings.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-950 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-[10px] text-zinc-800 uppercase tracking-widest font-black">
            <span className="hover:text-zinc-500 cursor-pointer transition-colors">개인정보 처리방침</span>
            <span className="hover:text-zinc-500 cursor-pointer transition-colors">이용약관</span>
            <span className="hover:text-zinc-500 cursor-pointer transition-colors">청소년 보호 정책</span>
            <span onClick={() => onCategorySelect?.('천안소식')} className="hover:text-primary cursor-pointer transition-colors">제보하기</span>
          </div>
          <p className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.4em] italic">
            © {new Date().getFullYear()} {settings.companyName}. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
