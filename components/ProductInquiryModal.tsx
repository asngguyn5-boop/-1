
import React, { useState } from 'react';
import { FORMSPREE_URL } from '../constants';

interface ProductInquiryModalProps {
  item: any; // AffiliateProduct | GoodsItem
  type: 'affiliate' | 'goods';
  onClose: () => void;
  primaryColor: string;
}

const ProductInquiryModal: React.FC<ProductInquiryModalProps> = ({ item, type, onClose, primaryColor }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('성함과 연락처를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[${type === 'affiliate' ? '제휴/상담문의' : '상품구매문의'}] ${item.name} - ${formData.name}`,
          productName: item.name,
          productPrice: item.price,
          customerName: formData.name,
          customerPhone: formData.phone,
          message: formData.message,
          submittedAt: new Date().toLocaleString()
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(onClose, 3000);
      } else {
        throw new Error('전송 실패');
      }
    } catch (error) {
      alert('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-fadeIn">
        <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-[3rem] p-12 text-center space-y-8 animate-bounceIn">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-900/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white italic wp-serif">문의 완료!</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              요청하신 정보가<br/>
              <span className="text-white font-bold">전담 매니저</span>에게<br/>
              실시간으로 전달되었습니다.
            </p>
          </div>
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] pt-4 animate-pulse">최대한 빨리 연락드리겠습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-slideUp">
        
        <div className="md:w-1/2 relative bg-zinc-900 overflow-hidden">
          <img src={item.imageUrl} className="w-full h-full object-cover opacity-80" alt={item.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {type === 'affiliate' ? (item.tag || '제휴 서비스') : 'OFFICIAL GOODS'}
              </span>
              <span className="text-white/60 text-xs font-bold">{item.price}</span>
            </div>
            <h2 className="text-4xl font-black text-white italic wp-serif leading-tight">{item.name}</h2>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col overflow-y-auto no-scrollbar p-10 md:p-12 space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Detail & Inquiry</h3>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="space-y-6"><p className="text-zinc-300 text-lg leading-relaxed font-light">{item.content || item.description || "상세 정보를 준비 중입니다."}</p></div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">성함</label>
                <input required disabled={isSubmitting} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 text-white rounded-2xl focus:border-primary outline-none text-sm disabled:opacity-50" placeholder="신청인 성함" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">연락처</label>
                <input required disabled={isSubmitting} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 text-white rounded-2xl focus:border-primary outline-none text-sm disabled:opacity-50" placeholder="전화번호" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">문의 및 요청사항</label>
              <textarea disabled={isSubmitting} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl h-32 resize-none focus:border-primary outline-none text-sm disabled:opacity-50" placeholder="궁금하신 점이나 구매/제휴 요청 내용을 남겨주세요." />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: primaryColor }}
              className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  실시간 전송 중...
                </>
              ) : '실시간 문의하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductInquiryModal;
