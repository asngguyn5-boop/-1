
import React from 'react';

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
      onClick={onClose}
    >
      <div className="absolute top-10 right-10 z-[310]">
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-all bg-zinc-900/50 p-3 rounded-full border border-zinc-800">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div className="relative max-w-7xl max-h-[90vh] p-1 rounded-2xl overflow-hidden shadow-2xl animate-popIn border border-white/10 bg-zinc-900">
        <img 
          src={src} 
          className="max-w-full max-h-[85vh] object-contain rounded-xl"
          alt="확대 보기"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.3em]">
          AI CHEONAN NEWS PREMIUM VIEW
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-popIn { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ImageModal;
