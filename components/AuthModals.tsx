
import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  type: 'login' | 'register';
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  onSwitch: () => void;
  users: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({ type, onClose, onLogin, onRegister, onSwitch, users }) => {
  const [formData, setFormData] = useState({ loginId: '', password: '', name: '', phone: '' });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.loginId === formData.loginId && u.password === formData.password);
    if (user) {
      onLogin(user);
      onClose();
    } else {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.loginId === formData.loginId)) {
      setError('이미 존재하는 아이디입니다.');
      return;
    }
    const newUser: User = {
      id: 'u' + Date.now(), loginId: formData.loginId, password: formData.password,
      name: formData.name, phone: formData.phone, role: 'user',
      createdAt: new Date().toISOString().split('T')[0]
    };
    onRegister(newUser);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl p-10 animate-slideUp">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase wp-serif">{type === 'login' ? 'LOGIN' : 'JOIN'}</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Platform Account Access</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <form onSubmit={type === 'login' ? handleLogin : handleRegister} className="space-y-6">
          {error && <p className="text-red-500 text-[10px] font-black text-center bg-red-500/10 py-3 rounded-xl border border-red-900/20">{error}</p>}
          <div className="space-y-4">
            <input required value={formData.loginId} onChange={e => setFormData({...formData, loginId: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary outline-none" placeholder="아이디" />
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary outline-none" placeholder="비밀번호" />
            {type === 'register' && (
              <>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary outline-none" placeholder="성함" />
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary outline-none" placeholder="연락처" />
              </>
            )}
          </div>
          <button type="submit" className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all">
            {type === 'login' ? '인증 및 로그인' : '계정 생성'}
          </button>
        </form>
        <div className="mt-8 text-center"><button onClick={onSwitch} className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">{type === 'login' ? '신규 회원가입' : '이미 계정이 있으신가요?'}</button></div>
      </div>
    </div>
  );
};
