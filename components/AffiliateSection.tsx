
import React from 'react';
import { AffiliateProduct } from '../types';

interface AffiliateSectionProps {
  products: AffiliateProduct[];
  isAdminMode?: boolean;
  onAdmin?: () => void;
  onPurchase?: (product: any) => void;
}

const AffiliateSection: React.FC<AffiliateSectionProps> = ({ products, isAdminMode, onAdmin, onPurchase }) => {
  return (
    <section className="py-16 border-t border-gray-800 relative">
      <div className="flex items-center justify-between mb-10">
        <h2 className="wp-serif text-4xl font-black text-white tracking-tighter italic">추천 제휴 서비스 • AFFILIATES</h2>
        {isAdminMode && (
          <button 
            onClick={onAdmin} 
            className="bg-zinc-800 text-zinc-400 px-6 py-2 rounded-full text-[10px] font-black uppercase border border-zinc-700 hover:text-white transition-all"
          >
            제휴 관리
          </button>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
          <p className="text-zinc-700 font-black italic uppercase tracking-widest text-lg">신규 제휴 상품이 준비 중입니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 flex flex-col sm:flex-row gap-8 group hover:border-primary transition-all">
              <div className="w-full sm:w-1/3 aspect-square rounded-[1.8rem] overflow-hidden relative shadow-2xl">
                <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                <div className="absolute top-4 left-4 bg-primary text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">
                  {product.tag}
                </div>
              </div>
              <div className="w-full sm:w-2/3 flex flex-col justify-between py-2">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-2xl font-black text-white">{product.price}</span>
                  <button 
                    onClick={() => onPurchase?.(product)}
                    className="bg-white text-black font-black px-8 py-3 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-2xl"
                  >
                    상세 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AffiliateSection;
