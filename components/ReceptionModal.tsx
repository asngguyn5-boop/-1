
import React, { useState } from 'react';
import { ReceptionService } from '../types';
import { FORMSPREE_URL } from '../constants';

interface ReceptionModalProps {
  service: ReceptionService;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
  primaryColor: string;
}

const ReceptionModal: React.FC<ReceptionModalProps> = ({ service, onClose, onSubmit, primaryColor }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 유효성 검사
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('성함과 연락처는 필수 입력 사항입니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Formspree 전송용 데이터 객체 생성
      const submissionData: any = {
        service: service.title,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: formData.details.trim(), // 'details'를 Formspree 표준인 'message'로 전달
        submittedAt: new Date().toLocaleString(),
        _subject: `[AI천안뉴스 실시간 접수] ${service.title} - ${formData.name.trim()}님`
      };

      // 이메일이 입력된 경우에만 포함 (빈 문자열 전송 시 유효성 에러 방지)
      if (formData.email.trim()) {
        submissionData.email = formData.email.trim();
        submissionData._replyto = formData.email.trim(); // 답장용 필드 추가
      }

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // 부모 컴포넌트에 알림
        if (onSubmit) onSubmit(formData);
        // 2.5초 후 자동으로 닫기
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        // Formspree에서 반환한 구체적인 에러 확인
        console.error('Formspree Validation Errors:', result.errors);
        const errorMsg = result.errors 
          ? result.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ')
          : '전송에 실패했습니다.';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('Submission error details:', error);
      alert(`접수 중 오류가 발생했습니다: ${error.message || '다시 시도해 주세요.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn">
        <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-[3rem] p-12 text-center shadow-2xl space-y-8 animate-bounceIn">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-900/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white italic wp-serif">접수 완료!</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              의뢰 내용이 실시간으로<br/>
              <span className="text-white font-bold">전담 기획팀</span>에<br/>
              안전하게 전달되었습니다.
            </p>
          </div>
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] pt-4 animate-pulse">곧 상담 전화를 드리겠습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[95vh] animate-slideUp">
        
        {/* Header Section */}
        <div className="relative h-56 bg-zinc-900 overflow-hidden shrink-0">
          <img src={service.imageUrl} className="w-full h-full object-cover opacity-30 scale-110" alt={service.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
          <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 text-primary mb-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={service.icon} />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Live Agency Service</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic wp-serif tracking-tight">{service.title} 의뢰</h2>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-all p-3 bg-black/50 rounded-full backdrop-blur-2xl border border-white/5 group mb-1">
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto no-scrollbar">
          <div className="bg-zinc-900/40 p-6 rounded-[1.8rem] border border-zinc-800 flex gap-4 items-start">
            <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">"{service.description}"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-1">신청인 성함 (필수)</label>
              <input 
                required
                disabled={isSubmitting}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50"
                placeholder="성함을 입력해 주세요"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-1">연락처 (필수)</label>
              <input 
                required
                disabled={isSubmitting}
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50"
                placeholder="예) 010-3425-0755"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-1">이메일 주소 (선택)</label>
            <input 
              type="email"
              disabled={isSubmitting}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50"
              placeholder="답변 받을 이메일 주소"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-1">상세 의뢰 내용</label>
            <textarea 
              disabled={isSubmitting}
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
              className="w-full bg-black border border-zinc-800 p-8 text-white rounded-[2.5rem] h-56 resize-none focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all leading-relaxed disabled:opacity-50"
              placeholder="의뢰하시고자 하는 내용을 자유롭게 기재해 주세요. 구체적일수록 빠른 상담이 가능합니다."
            />
          </div>

          <div className="flex items-center justify-center p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
            <div className="text-center">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Secure Submission Cloud System</p>
              <p className="text-primary font-bold text-xs">Formspree 실시간 통합 연동 중</p>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="p-10 border-t border-zinc-900 bg-zinc-900/20 flex gap-4 shrink-0">
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: primaryColor }}
            className="flex-grow py-6 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all hover:brightness-110 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                실시간 전송 중...
              </>
            ) : '실시간 신청하기'}
          </button>
          <button onClick={onClose} className="px-10 py-6 rounded-2xl bg-zinc-800 text-zinc-400 font-black text-sm uppercase tracking-widest hover:text-white transition-all">취소</button>
        </div>
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

export default ReceptionModal;
