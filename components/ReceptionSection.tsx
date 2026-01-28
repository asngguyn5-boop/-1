
import React from 'react';
import { ReceptionService } from '../types';

interface ReceptionSectionProps {
  services: ReceptionService[];
  isAdminMode?: boolean;
  onAdmin?: () => void;
  onSelectService: (service: ReceptionService) => void;
}

const ReceptionSection: React.FC<ReceptionSectionProps> = ({ services, isAdminMode, onAdmin, onSelectService }) => {
  return (
    <section id="reception-section" className="py-12 border-t border-zinc-900 relative scroll-mt-12">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="wp-serif text-5xl font-black text-white mb-3 tracking-tighter italic">고객접수 • PROJECT RECEPTION</h2>
          <p className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase">Premium Creative & Media Solution</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4 hidden md:block">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Fast Track</span>
            <span className="text-white font-bold">실시간 상담 접수 중</span>
          </div>
          {isAdminMode && (
            <button 
              onClick={onAdmin}
              className="bg-zinc-800 text-zinc-400 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:text-white transition-all flex items-center gap-2 border border-zinc-700"
            >
              접수 항목 관리
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => (
          <div 
            key={service.id} 
            onClick={() => onSelectService(service)}
            className="group relative bg-zinc-950 border border-zinc-900 rounded-[2.5rem] hover:border-primary hover:bg-zinc-900/50 transition-all cursor-pointer overflow-hidden flex flex-col h-full shadow-2xl"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={service.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={service.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
              
              <div className="absolute bottom-4 left-6 w-12 h-12 bg-[#004EA2] rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={service.icon} />
                </svg>
              </div>
            </div>

            <div className="p-8 flex-grow flex flex-col">
              <h3 className="text-2xl font-black text-white mb-3 italic wp-serif tracking-tight group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium group-hover:text-zinc-300 transition-colors">{service.description}</p>
              
              <div className="mt-auto flex items-center gap-3 text-[11px] font-black text-primary uppercase tracking-[0.3em]">
                <span>실시간 신청하기</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-primary/10 border border-primary/20 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="max-w-xl text-center md:text-left">
            <h4 className="text-3xl md:text-4xl font-black text-white italic mb-4 leading-tight">빠른 취재 및 제보가 필요하신가요?</h4>
            <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed">AI천안뉴스는 시민 여러분의 소중한 제보를 기다립니다.</p>
         </div>
         <div className="flex flex-col items-center md:items-end shrink-0">
            <span className="text-xs text-primary font-black uppercase tracking-[0.5em] mb-2 opacity-60">Direct Hotline</span>
            <a href="tel:010-3425-0755" className="text-4xl md:text-6xl font-black text-white hover:text-primary transition-all drop-shadow-[0_0_20px_rgba(0,78,162,0.3)]">010-3425-0755</a>
         </div>
      </div>
    </section>
  );
};

export default ReceptionSection;
