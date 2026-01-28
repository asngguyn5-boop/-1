
import React, { useState } from 'react';
import { Order } from '../types';
import { FORMSPREE_URL } from '../constants';

interface PaymentModalProps {
  product: any;
  onClose: () => void;
  onComplete: (order: Order) => void;
  primaryColor: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ product, onClose, onComplete, primaryColor }) => {
  const [step, setStep] = useState<'info' | 'processing' | 'success'>('info');
  const [quantity, setQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: '카드결제'
  });

  const priceInt = parseInt(product.price.replace(/[^0-9]/g, '')) || 0;
  const totalPrice = priceInt * quantity;

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('주문자 정보를 모두 입력해 주세요.');
      return;
    }
    setStep('processing');
    
    try {
      const orderId = 'ORD-' + Date.now();
      const newOrder: Order = {
        id: orderId,
        productName: product.name,
        productPrice: product.price,
        quantity,
        totalPrice,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        status: 'pending',
        date: new Date().toLocaleString('ko-KR'),
        paymentMethod: customerInfo.paymentMethod
      };

      // Formspree 실시간 데이터 전송
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[상품 주문 접수] ${product.name} - ${customerInfo.name}님`,
          orderId: orderId,
          productName: product.name,
          quantity: quantity,
          totalPrice: totalPrice.toLocaleString() + '원',
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          address: customerInfo.address,
          paymentMethod: customerInfo.paymentMethod,
          submittedAt: new Date().toLocaleString()
        })
      });

      // 결제 시뮬레이션 지연 후 완료 처리
      setTimeout(() => {
        onComplete(newOrder);
        setStep('success');
      }, 1500);
    } catch (e) {
      console.error('Order submission failed', e);
      alert('주문 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setStep('info');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {step === 'info' && (
          <div className="animate-slideUp">
            <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white italic wp-serif">CHECKOUT</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">주문 및 결제 정보 입력</p>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
              {/* Product Info */}
              <div className="flex gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                <img src={product.imageUrl} className="w-24 h-24 object-cover rounded-xl shadow-lg" alt={product.name} />
                <div className="flex-grow">
                  <h3 className="text-white font-black text-lg mb-1">{product.name}</h3>
                  <p className="text-zinc-500 text-sm mb-4">{product.price}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700">-</button>
                    <span className="text-white font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700">+</button>
                  </div>
                </div>
              </div>

              {/* Form Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">받는 분 성함</label>
                    <input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 text-white rounded-xl focus:border-primary focus:outline-none" placeholder="홍길동" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">연락처</label>
                    <input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 text-white rounded-xl focus:border-primary focus:outline-none" placeholder="010-0000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">배송지 주소</label>
                  <input value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-black border border-zinc-800 p-4 text-white rounded-xl focus:border-primary focus:outline-none" placeholder="도로명 또는 지번 주소" />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">결제 수단 선택</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['카드결제', '카카오페이', '토스페이', '계좌이체'].map(method => (
                    <button 
                      key={method}
                      onClick={() => setCustomerInfo({...customerInfo, paymentMethod: method})}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${customerInfo.paymentMethod === method ? 'bg-primary border-primary text-white shadow-lg shadow-blue-900/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-900/30 border-t border-zinc-900 flex justify-between items-center">
              <div>
                <span className="text-zinc-500 text-xs font-bold block mb-1">총 결제금액</span>
                <span className="text-white text-3xl font-black">{totalPrice.toLocaleString()}원</span>
              </div>
              <button 
                onClick={handlePayment}
                style={{ backgroundColor: primaryColor }}
                className="px-10 py-5 rounded-2xl text-white font-black text-lg shadow-xl transform active:scale-95 transition-all"
              >
                결제하기
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic">PROCESSING...</h3>
              <p className="text-zinc-500 text-sm mt-2">안전하게 주문 정보를 전송 중입니다.<br/>잠시만 기다려 주세요.</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 flex flex-col items-center text-center space-y-8 animate-bounceIn">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-900/40">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <h3 className="text-4xl font-black text-white italic wp-serif">ORDER SUCCESS!</h3>
              <p className="text-zinc-400 text-lg mt-4 font-bold">주문 요청이 정상적으로 완료되었습니다.</p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8 space-y-2 text-left">
                <p className="text-xs flex justify-between gap-4"><span className="text-zinc-500 shrink-0">주문 상품:</span> <span className="text-white font-bold truncate">{product.name} (x{quantity})</span></p>
                <p className="text-xs flex justify-between gap-4"><span className="text-zinc-500 shrink-0">결제 금액:</span> <span className="text-primary font-black">{totalPrice.toLocaleString()}원</span></p>
                <p className="text-xs flex justify-between gap-4"><span className="text-zinc-500 shrink-0">배송지:</span> <span className="text-white font-bold truncate">{customerInfo.address}</span></p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl hover:bg-zinc-200 transition-colors"
            >
              확인
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounceIn { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default PaymentModal;
