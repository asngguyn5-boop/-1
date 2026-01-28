
import React from 'react';
import { GoodsItem } from '../types';

interface GoodsSectionProps {
  items: GoodsItem[];
  isAdminMode?: boolean;
  onAdmin?: () => void;
  onPurchase?: (product: any) => void;
}

const GoodsSection: React.FC<GoodsSectionProps> = ({ items, isAdminMode, onAdmin, onPurchase }) => {
  return (
    <section id="goods-section" className="py-12 border-t border-zinc-900 relative scroll-mt-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="wp-serif text-5xl font-black text-white tracking-tighter italic">공식 스토어 굿즈 • OFFICIAL STORE</h2>
          <p className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mt-2">Exclusive Merchandise & Collectibles</p>
        </div>
        {isAdminMode && (
          <button 
            onClick={onAdmin} 
            className="bg-zinc-800 text-zinc-400 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all border border-zinc-700"
          >
            스토어 관리
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
          <p className="text-zinc-700 font-black italic uppercase tracking-widest text-xl">공식 굿즈를 준비하고 있습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col animate-fadeIn">
              <div className="relative aspect-[4/5] bg-zinc-950 rounded-[2rem] overflow-hidden mb-4 shadow-2xl border border-zinc-900/50">
                <img 
                  src={item.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={item.name} 
                />
                
                {item.isNew && (
                  <div className="absolute top-4 left-4 bg-primary text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] shadow-lg animate-pulse z-10">
                    NEW
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 backdrop-blur-[2px]">
                  <button 
                    onClick={() => onPurchase?.(item)}
                    className="w-full bg-white text-black font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-primary hover:text-white"
                  >
                    구매하기
                  </button>
                </div>
              </div>
              
              <div className="px-1">
                <h3 className="text-zinc-200 font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-black text-base">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GoodsSection;
