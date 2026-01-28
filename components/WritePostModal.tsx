
import React, { useState, useRef, useEffect } from 'react';
import { CommunityPost } from '../types';

interface WritePostModalProps {
  onClose: () => void;
  onSubmit: (post: Omit<CommunityPost, 'id' | 'views' | 'comments' | 'date'>) => Promise<void> | void;
  primaryColor: string;
  initialCategory?: string;
}

const WritePostModal: React.FC<WritePostModalProps> = ({ onClose, onSubmit, primaryColor, initialCategory }) => {
  const [postData, setPostData] = useState({
    category: initialCategory || '자유게시판',
    title: '',
    author: '',
    content: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<{ name: string; url: string; size?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['우리동네', '자유게시판', '벼룩시장', '육아/일상', '구인구직', '제보', '봉사활동'];

  useEffect(() => {
    if (initialCategory) {
      setPostData(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    Array.from(selectedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => { setImages(prev => [...prev, reader.result as string]); };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    Array.from(selectedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => [...prev, {
          name: file.name,
          url: reader.result as string,
          size: (file.size / 1024).toFixed(1) + 'KB'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postData.title.trim() || !postData.author.trim() || !postData.content.trim()) {
      alert('필수 항목(제목, 작성자, 내용)을 모두 입력해 주세요.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...postData,
        images: images.length > 0 ? images : undefined,
        files: files.length > 0 ? files : undefined
      });
      onClose();
    } catch (err) {
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/30">
          <div>
            <h2 className="text-2xl font-black text-white italic wp-serif uppercase tracking-tight">커뮤니티 글쓰기 / 제보</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">소중한 의견과 정보를 자유롭게 나누어 주세요</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-3 bg-zinc-900 rounded-full transition-all hover:rotate-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-8 space-y-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">게시판 카테고리</label>
              <select 
                value={postData.category}
                disabled={isSubmitting}
                onChange={e => setPostData({...postData, category: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary focus:outline-none text-sm appearance-none shadow-inner transition-all disabled:opacity-50"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">작성자 명칭</label>
              <input 
                disabled={isSubmitting}
                value={postData.author}
                onChange={e => setPostData({...postData, author: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-5 text-white rounded-2xl focus:border-primary focus:outline-none shadow-inner transition-all disabled:opacity-50"
                placeholder="익명 또는 닉네임"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">게시글 제목</label>
            <input 
              disabled={isSubmitting}
              value={postData.title}
              onChange={e => setPostData({...postData, title: e.target.value})}
              className="w-full bg-black border border-zinc-800 p-6 text-white rounded-2xl focus:border-primary focus:outline-none font-black text-xl shadow-inner transition-all disabled:opacity-50"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">상세 본문 내용</label>
            <textarea 
              disabled={isSubmitting}
              value={postData.content}
              onChange={e => setPostData({...postData, content: e.target.value})}
              className="w-full bg-black border border-zinc-800 p-8 text-white rounded-[2rem] h-72 resize-none text-lg leading-relaxed shadow-inner transition-all disabled:opacity-50"
              placeholder="천안 시민들과 공유하고 싶은 내용을 작성해 주세요..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">이미지 첨부 ({images.length})</label>
              </div>
              <button 
                type="button" 
                disabled={isSubmitting}
                onClick={() => imageInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 bg-zinc-900 border border-dashed border-zinc-800 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary hover:border-primary transition-all group disabled:opacity-50"
              >
                사진 선택
              </button>
              <input type="file" accept="image/*" multiple ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group animate-popIn">
                    <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">파일 첨부 ({files.length})</label>
              </div>
              <button type="button" disabled={isSubmitting} onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-3 bg-zinc-900 border border-dashed border-zinc-800 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all disabled:opacity-50">문서 선택</button>
              <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <div className="space-y-3">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-zinc-900/30 px-5 py-4 rounded-2xl border border-zinc-900 group">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-zinc-600 group-hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></div>
                      <p className="text-[11px] text-zinc-300 truncate font-black tracking-tight">{file.name}</p>
                    </div>
                    <button type="button" onClick={() => removeFile(idx)} className="text-zinc-800 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="p-10 border-t border-zinc-900 flex gap-4 bg-zinc-900/20">
          <button 
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: primaryColor }}
            className="flex-grow py-6 rounded-[1.5rem] text-white font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all shadow-blue-900/40 hover:brightness-110 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                등록 및 전송 중...
              </>
            ) : '게시글 등록 및 공유'}
          </button>
          <button type="button" onClick={onClose} className="px-12 py-6 rounded-[1.5rem] bg-zinc-800 text-zinc-400 font-black text-sm uppercase tracking-widest hover:text-white transition-all">취소</button>
        </div>
      </div>
    </div>
  );
};

export default WritePostModal;
