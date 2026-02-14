
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  NewsArticle, Category, AdminTab, CommunityPost, ReceptionService, 
  AffiliateProduct, GoodsItem, AdContent, SiteSettings, Order, PopupSettings, MediaType, User, StateSnapshot
} from '../types';

interface AdminDashboardProps {
  articles: NewsArticle[];
  posts: CommunityPost[];
  services: ReceptionService[];
  profile: any;
  affiliates: AffiliateProduct[];
  goods: GoodsItem[];
  ads: AdContent[];
  orders: Order[];
  siteSettings: SiteSettings;
  popup: PopupSettings;
  users: User[];
  history: StateSnapshot[];
  initialArticle?: NewsArticle | null;
  initialPost?: CommunityPost | null;
  initialTab?: AdminTab;
  onUpdateNews: (data: NewsArticle[]) => void;
  onUpdatePosts: (data: CommunityPost[]) => void;
  onUpdateServices: (data: ReceptionService[]) => void;
  onUpdateProfile: (data: any) => void;
  onUpdateAffiliates: (data: AffiliateProduct[]) => void;
  onUpdateGoods: (data: GoodsItem[]) => void;
  onUpdateAds: (data: AdContent[]) => void;
  onUpdateSiteSettings: (data: SiteSettings) => void;
  onUpdatePopup: (data: PopupSettings) => void;
  onUpdateOrders: (data: Order[]) => void;
  onUpdateUsers: (data: User[]) => void;
  onRestoreHistory: (snapshot: StateSnapshot) => void;
  onEmergencyReset: () => void;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(props.initialTab || 'news');
  const [editingItem, setEditingItem] = useState<{ type: string, data: any } | null>(null);
  const [localDesign, setLocalDesign] = useState<SiteSettings>(props.siteSettings);
  const [designSubTab, setDesignSubTab] = useState<'visual' | 'typography' | 'branding' | 'footer'>('branding');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  useEffect(() => {
    setLocalDesign(props.siteSettings);
  }, [props.siteSettings]);

  useEffect(() => {
    if (props.initialArticle) { setEditingItem({ type: 'news', data: props.initialArticle }); setActiveTab('news'); }
    if (props.initialPost) { setEditingItem({ type: 'community', data: props.initialPost }); setActiveTab('community'); }
  }, [props.initialArticle, props.initialPost]);

  const handleSave = (type: string, data: any) => {
    if (type === 'design') props.onUpdateSiteSettings(data);
    else if (type === 'news') {
      if (data.id) props.onUpdateNews(props.articles.map(a => a.id === data.id ? data : a));
      else props.onUpdateNews([{ ...data, id: 'n'+Date.now(), date: new Date().toISOString().split('T')[0] }, ...props.articles]);
    } else if (type === 'community') {
      if (data.id) props.onUpdatePosts(props.posts.map(p => p.id === data.id ? data : p));
      else props.onUpdatePosts([{ ...data, id: 'p'+Date.now(), date: new Date().toISOString().split('T')[0], views: 0, comments: 0 }, ...props.posts]);
    } else if (type === 'affiliate') {
      if (data.id) props.onUpdateAffiliates(props.affiliates.map(p => p.id === data.id ? data : p));
      else props.onUpdateAffiliates([...props.affiliates, { ...data, id: 'ap'+Date.now() }]);
    } else if (type === 'goods') {
      if (data.id) props.onUpdateGoods(props.goods.map(g => g.id === data.id ? data : g));
      else props.onUpdateGoods([...props.goods, { ...data, id: 'g'+Date.now() }]);
    } else if (type === 'profile') {
      props.onUpdateProfile(data);
    } else if (type === 'agency') {
      props.onUpdateServices(props.services.map(s => s.id === data.id ? data : s));
    }
    setEditingItem(null);
    alert('설정이 성공적으로 반영되었습니다.');
  };

  const generateSingleImage = async (title: string, description: string, type: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let promptPrefix = "A professional news photograph";
    let aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "16:9";

    if (type === 'goods' || type === 'affiliate') {
      promptPrefix = "A premium product photograph on a minimalist background";
      aspectRatio = "1:1";
    }

    const prompt = `${promptPrefix} for an item titled: "${title}". Description: "${description}". High quality, photorealistic, cinematic lighting, studio quality.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  };

  const handleGenerateAiImage = async () => {
    if (!editingItem) return;
    const title = editingItem.data.title || editingItem.data.name;
    const desc = editingItem.data.summary || editingItem.data.description || "";

    if (!title) {
      alert('이미지를 생성하려면 제목(명칭)을 먼저 입력해 주세요.');
      return;
    }

    setIsAiGenerating(true);
    try {
      const url = await generateSingleImage(title, desc, editingItem.type);
      if (url) {
        setEditingItem({
          ...editingItem,
          data: { ...editingItem.data, imageUrl: url }
        });
      }
    } catch (e) {
      console.error(e);
      alert('AI 이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const ColorInput = ({ label, value, onChange }: any) => (
    <div className="flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-4">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="flex-grow bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white" />
      </div>
    </div>
  );

  const SliderInput = ({ label, value, min, max, step, onChange, suffix = 'px' }: any) => (
    <div className="flex flex-col gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
        <span className="text-primary font-black text-xs">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full accent-primary h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
    </div>
  );

  const TextInput = ({ label, value, onChange, placeholder = '' }: any) => (
    <div className="flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all" />
    </div>
  );

  // 커리어 리스트 편집 핸들러
  const handleCareerChange = (idx: number, field: 'label' | 'type', value: string) => {
    const newCareers = [...props.profile.careers];
    newCareers[idx] = { ...newCareers[idx], [field]: value };
    props.onUpdateProfile({ ...props.profile, careers: newCareers });
  };
  const addCareer = () => {
    props.onUpdateProfile({ ...props.profile, careers: [...props.profile.careers, { label: '', type: 'social' }] });
  };
  const removeCareer = (idx: number) => {
    props.onUpdateProfile({ ...props.profile, careers: props.profile.careers.filter((_:any, i:number) => i !== idx) });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-fadeIn">
      {/* 어드민 헤더 */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-zinc-900/50 p-8 rounded-[3rem] border border-zinc-800 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic wp-serif uppercase tracking-tight">System Control Center</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Fine-Grained Content & Design Management</p>
        </div>
        <div className="flex gap-4">
          <button onClick={props.onBack} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">Exit Admin</button>
        </div>
      </div>

      {/* 첨부 이미지 스타일의 탭 네비게이션 */}
      <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-4">
        {[
          { id: 'design', label: 'DESIGN' },
          { id: 'news', label: 'NEWS' },
          { id: 'shop', label: 'SHOP' },
          { id: 'agency', label: 'AGENCY' },
          { id: 'community', label: 'COMMUNITY' },
          { id: 'profile', label: 'PROFILE' },
          { id: 'ads', label: 'ADS' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-8 py-5 rounded-[1.25rem] text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-lg ${activeTab === tab.id ? 'bg-[#004EA2] text-white' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400 border border-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-[4rem] min-h-[600px] shadow-2xl">
        
        {/* DESIGN 관리 */}
        {activeTab === 'design' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="flex gap-4 border-b border-zinc-900 pb-6 mb-8 overflow-x-auto no-scrollbar">
              {[
                {id: 'branding', label: '브랜딩 & 레이아웃'},
                {id: 'footer', label: '푸터 및 상세 정보'},
                {id: 'typography', label: '타이포그래피'},
                {id: 'visual', label: '컬러 & 비주얼'}
              ].map(st => (
                <button 
                  key={st.id} 
                  onClick={() => setDesignSubTab(st.id as any)} 
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${designSubTab === st.id ? 'bg-zinc-800 text-primary' : 'text-zinc-600 hover:text-white'}`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {designSubTab === 'branding' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="브랜드 이름" value={localDesign.brandName} onChange={(v:string)=>setLocalDesign({...localDesign, brandName:v})} />
                <TextInput label="브랜드 서브 네임" value={localDesign.brandSubName} onChange={(v:string)=>setLocalDesign({...localDesign, brandSubName:v})} />
                <TextInput label="브랜드 슬로건" value={localDesign.brandSlogan} onChange={(v:string)=>setLocalDesign({...localDesign, brandSlogan:v})} />
                <TextInput label="AI 레이블 명칭" value={localDesign.brandAiLabel} onChange={(v:string)=>setLocalDesign({...localDesign, brandAiLabel:v})} />
                <TextInput label="고객 문의 전화번호" value={localDesign.heroPhone} onChange={(v:string)=>setLocalDesign({...localDesign, heroPhone:v})} />
                <div className="flex flex-col gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">레이아웃 섹션 노출</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {id: 'showArchives', label: '아카이브'},
                      {id: 'showReception', label: '고객접수'},
                      {id: 'showAffiliates', label: '제휴상품'},
                      {id: 'showGoods', label: '굿즈스토어'},
                      {id: 'showYouTube', label: '유튜브 위젯'},
                      {id: 'showProfile', label: '대표 프로필'}
                    ].map(sec => (
                      <button 
                        key={sec.id}
                        onClick={() => setLocalDesign({...localDesign, [sec.id]: !localDesign[sec.id as keyof SiteSettings]})}
                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${(localDesign[sec.id as keyof SiteSettings]) ? 'bg-primary/20 border-primary text-primary' : 'bg-black/50 border-zinc-800 text-zinc-700'}`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {designSubTab === 'footer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <TextInput label="발행기관(회사명)" value={localDesign.companyName} onChange={(v:string)=>setLocalDesign({...localDesign, companyName:v})} />
                </div>
                <div className="md:col-span-2">
                  <TextInput label="본사 주소" value={localDesign.address} onChange={(v:string)=>setLocalDesign({...localDesign, address:v})} />
                </div>
                <TextInput label="대표 이메일" value={localDesign.email} onChange={(v:string)=>setLocalDesign({...localDesign, email:v})} />
                <TextInput label="대표 전화" value={localDesign.phone} onChange={(v:string)=>setLocalDesign({...localDesign, phone:v})} />
                <TextInput label="등록번호" value={localDesign.registrationNum} onChange={(v:string)=>setLocalDesign({...localDesign, registrationNum:v})} />
                <TextInput label="등록 일자" value={localDesign.registrationDate} onChange={(v:string)=>setLocalDesign({...localDesign, registrationDate:v})} />
                <TextInput label="발행인" value={localDesign.publisher} onChange={(v:string)=>setLocalDesign({...localDesign, publisher:v})} />
                <TextInput label="편집인" value={localDesign.editor} onChange={(v:string)=>setLocalDesign({...localDesign, editor:v})} />
                <TextInput label="청소년보호책임자" value={localDesign.youthProtectionOfficer} onChange={(v:string)=>setLocalDesign({...localDesign, youthProtectionOfficer:v})} />
                <div className="md:col-span-2 space-y-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">푸터 상세 설명</label>
                  <textarea 
                    value={localDesign.footerDescription} 
                    onChange={e => setLocalDesign({...localDesign, footerDescription: e.target.value})}
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl p-6 text-sm text-zinc-300 h-32 resize-none focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}

            {designSubTab === 'typography' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SliderInput label="메인 헤드라인 크기" min={30} max={120} value={localDesign.heroTitleSize} onChange={(v:number)=>setLocalDesign({...localDesign, heroTitleSize:v})} />
                <SliderInput label="뉴스 그리드 제목 크기" min={16} max={40} value={localDesign.gridTitleSize} onChange={(v:number)=>setLocalDesign({...localDesign, gridTitleSize:v})} />
                <SliderInput label="본문 폰트 크기" min={12} max={24} value={localDesign.bodyTextSize} onChange={(v:number)=>setLocalDesign({...localDesign, bodyTextSize:v})} />
              </div>
            )}

            {designSubTab === 'visual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorInput label="브랜드 기본색 (Primary)" value={localDesign.primaryColor} onChange={(v:string)=>setLocalDesign({...localDesign, primaryColor:v})} />
                <ColorInput label="배경 색상 (Background)" value={localDesign.bgColor} onChange={(v:string)=>setLocalDesign({...localDesign, bgColor:v})} />
                <ColorInput label="카드 배경색 (Card Bg)" value={localDesign.cardBgColor} onChange={(v:string)=>setLocalDesign({...localDesign, cardBgColor:v})} />
              </div>
            )}

            <div className="pt-10 flex gap-4">
              <button onClick={() => handleSave('design', localDesign)} className="flex-grow bg-[#004EA2] py-6 rounded-3xl text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:brightness-110 transition-all">설정 사항 즉시 적용</button>
              <button onClick={() => setLocalDesign(props.siteSettings)} className="px-10 bg-zinc-900 py-6 rounded-3xl text-zinc-500 font-black uppercase text-xs tracking-widest hover:text-white transition-all">되돌리기</button>
            </div>
          </div>
        )}

        {/* NEWS 관리 */}
        {activeTab === 'news' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-6 mb-6">
              <h3 className="text-2xl font-black text-white italic uppercase">Editorial Manager</h3>
              <button 
                onClick={() => setEditingItem({ type: 'news', data: { title: '', summary: '', content: '', category: Category.LOCAL, imageUrl: '', mediaType: 'image', author: '김상균 기자', isHeadline: false } })} 
                className="bg-[#004EA2] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg"
              >
                + New Article
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {props.articles.map(a => (
                <div key={a.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl group hover:border-primary transition-all">
                  <div className="flex items-center gap-6 overflow-hidden">
                    <img src={a.imageUrl} className="w-20 h-14 object-cover rounded-lg shrink-0" alt="" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white line-clamp-1 mb-1">{a.title}</p>
                      <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{a.category} • {a.date}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditingItem({ type: 'news', data: a })} className="bg-zinc-800 text-zinc-400 hover:text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHOP 관리 */}
        {activeTab === 'shop' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white italic uppercase">Affiliate Services</h3>
                <button onClick={() => setEditingItem({ type: 'affiliate', data: { name: '', description: '', price: '', imageUrl: '', tag: '추천', affiliateUrl: '#' } })} className="bg-[#004EA2] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {props.affiliates.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <p className="text-white font-bold text-sm truncate">{p.name}</p>
                    </div>
                    <button onClick={() => setEditingItem({ type: 'affiliate', data: p })} className="text-primary text-[10px] font-black uppercase border border-primary/20 px-4 py-2 rounded-lg">Edit</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 pt-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white italic uppercase">Store Goods</h3>
                <button onClick={() => setEditingItem({ type: 'goods', data: { name: '', description: '', price: '', imageUrl: '', isNew: true } })} className="bg-[#004EA2] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {props.goods.map(g => (
                  <div key={g.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={g.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <p className="text-white font-bold text-sm truncate">{g.name}</p>
                    </div>
                    <button onClick={() => setEditingItem({ type: 'goods', data: g })} className="text-primary text-[10px] font-black uppercase border border-primary/20 px-4 py-2 rounded-lg">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AGENCY 관리 (Reception Services) */}
        {activeTab === 'agency' && (
          <div className="space-y-8 animate-fadeIn">
            <h3 className="text-2xl font-black text-white italic uppercase mb-8">Reception Services Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.services.map(s => (
                <div key={s.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center justify-between group hover:border-primary transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">{s.title}</p>
                      <p className="text-zinc-600 text-xs mt-1 line-clamp-1">{s.description}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingItem({ type: 'agency', data: s })} className="bg-zinc-800 text-zinc-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white">Edit Item</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY 관리 (게시글 관리) */}
        {activeTab === 'community' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white italic uppercase">Community Activity Feed</h3>
              <button 
                onClick={() => setEditingItem({ type: 'community', data: { title: '', content: '', author: '', category: '자유게시판' } })} 
                className="bg-[#004EA2] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"
              >
                + Create Post
              </button>
            </div>
            <div className="space-y-3">
              {props.posts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl group hover:border-primary transition-all">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase rounded-lg">{p.category}</span>
                    <p className="text-zinc-200 font-bold text-sm truncate">{p.title}</p>
                    <span className="text-zinc-700 text-[10px] font-black italic">by {p.author}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'community', data: p })} className="bg-zinc-800 text-zinc-500 hover:text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase">Edit</button>
                    <button onClick={() => props.onUpdatePosts(props.posts.filter(x => x.id !== p.id))} className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE 관리 */}
        {activeTab === 'profile' && (
          <div className="space-y-10 animate-fadeIn">
            <h3 className="text-2xl font-black text-white italic uppercase mb-8">Representative Bio & Careers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="이름" value={props.profile.name} onChange={(v:string)=>props.onUpdateProfile({...props.profile, name:v})} />
              <TextInput label="직함" value={props.profile.title} onChange={(v:string)=>props.onUpdateProfile({...props.profile, title:v})} />
              <div className="md:col-span-2">
                <TextInput label="프로필 이미지 URL" value={props.profile.imageUrl} onChange={(v:string)=>props.onUpdateProfile({...props.profile, imageUrl:v})} />
              </div>
              <div className="md:col-span-2 space-y-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">대표 인사말</label>
                <textarea 
                  value={props.profile.description} 
                  onChange={e => props.onUpdateProfile({...props.profile, description: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl p-6 text-sm text-zinc-300 h-32 resize-none focus:border-primary outline-none"
                />
              </div>

              {/* 정밀 경력 수정 기능 */}
              <div className="md:col-span-2 space-y-4 p-6 bg-zinc-900/30 rounded-[3rem] border border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">경력 사항 상세 편집</label>
                  <button onClick={addCareer} className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-primary/20 hover:bg-primary hover:text-white transition-all">+ Add Item</button>
                </div>
                <div className="space-y-3">
                  {props.profile.careers.map((career: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center animate-fadeIn">
                      <input 
                        className="flex-grow bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                        value={career.label}
                        onChange={e => handleCareerChange(idx, 'label', e.target.value)}
                        placeholder="기관 및 직책명"
                      />
                      <select 
                        className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-black text-zinc-500 uppercase"
                        value={career.type}
                        onChange={e => handleCareerChange(idx, 'type', e.target.value)}
                      >
                        <option value="political">정치</option>
                        <option value="social">사회봉사</option>
                        <option value="media">미디어</option>
                        <option value="local">지역사회</option>
                      </select>
                      <button onClick={() => removeCareer(idx)} className="p-3 text-red-900 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => handleSave('profile', props.profile)} className="w-full bg-[#004EA2] py-6 rounded-3xl text-white font-black uppercase text-xs tracking-widest shadow-2xl">Confirm Profile & Careers Updates</button>
          </div>
        )}

        {/* ADS 관리 */}
        {activeTab === 'ads' && (
          <div className="space-y-10 animate-fadeIn">
            <h3 className="text-2xl font-black text-white italic uppercase mb-8">Advertisement Slot Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {props.ads.map((ad, idx) => (
                <div key={ad.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-[3rem] space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="px-4 py-1.5 bg-zinc-800 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">{ad.slot}</span>
                  </div>
                  <TextInput label="광고 제목" value={ad.title} onChange={(v:string)=>{
                    const newAds = [...props.ads]; newAds[idx].title = v; props.onUpdateAds(newAds);
                  }} />
                  <TextInput label="연결 링크 (tel: 또는 URL)" value={ad.link} onChange={(v:string)=>{
                    const newAds = [...props.ads]; newAds[idx].link = v; props.onUpdateAds(newAds);
                  }} />
                  <TextInput label="미디어 URL" value={ad.mediaUrl} onChange={(v:string)=>{
                    const newAds = [...props.ads]; newAds[idx].mediaUrl = v; props.onUpdateAds(newAds);
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 정밀 편집 모달 (Common) */}
        {editingItem && (
          <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl animate-fadeIn">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl p-10 rounded-[4rem] space-y-8 overflow-y-auto max-h-[90vh] no-scrollbar shadow-[0_0_100px_rgba(0,0,0,0.9)]">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-white italic uppercase">Fine-Grained Editing: {editingItem.type.toUpperCase()}</h3>
                <button onClick={() => setEditingItem(null)} className="text-zinc-600 hover:text-white p-3 bg-zinc-900 rounded-full transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* News & Community 공통 필드 */}
                {(editingItem.type === 'news' || editingItem.type === 'community') && (
                  <>
                    <div className="md:col-span-2"><TextInput label="제목" value={editingItem.data.title} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, title: v}})} /></div>
                    <TextInput label="카테고리" value={editingItem.data.category} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, category: v}})} />
                    <TextInput label="작성자" value={editingItem.data.author} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, author: v}})} />
                    {editingItem.type === 'news' && (
                      <div className="md:col-span-2 relative">
                        <TextInput label="이미지 URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} />
                        <button onClick={handleGenerateAiImage} className="absolute right-6 bottom-3 bg-primary text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">AI 이미지</button>
                      </div>
                    )}
                    <div className="md:col-span-2"><textarea value={editingItem.data.content} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} className="w-full bg-black border border-zinc-800 p-8 text-white rounded-3xl h-72 text-lg leading-relaxed focus:border-primary outline-none" placeholder="본문 내용" /></div>
                  </>
                )}

                {/* Agency(Services) 필드 */}
                {editingItem.type === 'agency' && (
                  <>
                    <div className="md:col-span-2"><TextInput label="서비스 타이틀" value={editingItem.data.title} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, title: v}})} /></div>
                    <div className="md:col-span-2"><TextInput label="대표 이미지 URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} /></div>
                    <div className="md:col-span-2"><TextInput label="아이콘 데이터 (SVG d path)" value={editingItem.data.icon} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, icon: v}})} /></div>
                    <div className="md:col-span-2"><textarea value={editingItem.data.description} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-black border border-zinc-800 p-8 text-white rounded-3xl h-32 text-sm focus:border-primary outline-none" placeholder="서비스 요약 설명" /></div>
                  </>
                )}

                {/* Shop(Affiliate/Goods) 필드 */}
                {(editingItem.type === 'affiliate' || editingItem.type === 'goods') && (
                  <>
                    <TextInput label="명칭" value={editingItem.data.name} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, name: v}})} />
                    <TextInput label="가격" value={editingItem.data.price} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, price: v}})} />
                    <div className="md:col-span-2"><TextInput label="상품 이미지 URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} /></div>
                    <div className="md:col-span-2"><textarea value={editingItem.data.description} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-black border border-zinc-800 p-8 text-white rounded-3xl h-48 focus:border-primary outline-none" placeholder="상세 정보" /></div>
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-10">
                <button onClick={() => handleSave(editingItem.type, editingItem.data)} className="flex-grow bg-[#004EA2] py-6 rounded-3xl text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl">Confirm & Apply Changes</button>
                <button onClick={() => setEditingItem(null)} className="px-10 bg-zinc-900 text-zinc-500 py-6 rounded-3xl font-black uppercase text-xs tracking-widest">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
