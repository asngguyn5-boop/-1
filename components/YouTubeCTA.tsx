
import React from 'react';

interface YouTubeCTAProps {
  isAdminMode?: boolean;
  onAdmin?: () => void;
}

const YouTubeCTA: React.FC<YouTubeCTAProps> = ({ isAdminMode, onAdmin }) => {
  const YOUTUBE_URL = 'https://www.youtube.com/@PlayShortsKorea';

  return (
    <section className="py-10 border-t border-gray-900 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] -mr-40 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#004EA2]/10 rounded-full blur-[100px] -ml-40 -mb-20"></div>

      {isAdminMode && (
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={onAdmin}
            className="bg-[#004EA2] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-2 border border-blue-400/30"
          >
            EDIT WIDGET
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
          <div className="lg:w-2/5 w-full p-8 flex justify-center items-center bg-gray-950/50">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#004EA2] to-red-600 rounded-full animate-pulse blur-xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
              
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-transparent p-4 flex flex-col items-center justify-center overflow-hidden">
                <img 
                  src="https://postfiles.pstatic.net/MjAyNTAyMTBfMTc1/MDAxNzM5MTY5NTMxNDU5.D25V6mGsh0L8-E-k59P76iL7_A3qVp7zH6r6f7M_zPsg.N2q8C6Wf9v-O7pL8l9l9l9l9l9l9l9l9l9l9l9l9l9g.PNG/character.png?type=w773"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  alt="상균아놀자 캐릭터 로고"
                />
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 w-full p-8 md:p-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 font-black text-[10px] tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
              YouTube Creator Channel
            </div>
            
            <h2 className="brand-serif text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              천안의 활력소, <br/>
              <span className="brand-brush text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                상균아놀자tv
              </span>
            </h2>
            
            <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed font-light">
              지금 바로 구독하고 '상균아놀자'의 새로운 영상을 가장 먼저 만나보세요. <br/>
              세상 사는 따뜻한 이야기를 전해드립니다.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href={YOUTUBE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white font-black px-10 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3 text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
                구독하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeCTA;
