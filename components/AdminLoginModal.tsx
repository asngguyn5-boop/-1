
import React, { useState } from 'react';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 운영 환경에서는 서버 통신이 필요하나, 현재는 클라이언트 단 암호로 구현
    // 요청에 따라 비밀번호를 '6282'로 설정
    if (password === '6282') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-8 rounded-3xl shadow-2xl animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#004EA2]/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#004EA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white italic wp-serif">ADMIN ACCESS</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">관리자 전용 인증</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Access Key</label>
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••"
              className={`w-full bg-black border ${error ? 'border-red-600' : 'border-zinc-800'} rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-[#004EA2] transition-colors`}
            />
            {error && <p className="text-red-500 text-[10px] font-bold mt-2 text-center uppercase tracking-widest">인증번호가 올바르지 않습니다</p>}
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full bg-[#004EA2] hover:bg-blue-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all active:scale-95"
            >
              인증 완료
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-zinc-600 hover:text-white font-bold py-2 text-[10px] uppercase tracking-widest transition-colors"
            >
              취소하기
            </button>
          </div>
        </form>
        
        <p className="text-zinc-800 text-[8px] mt-8 text-center font-bold tracking-tighter leading-tight">
          THIS SYSTEM IS MONITORED. <br/> UNAUTHORIZED ACCESS IS PROHIBITED.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginModal;
