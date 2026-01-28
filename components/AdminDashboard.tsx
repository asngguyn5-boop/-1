
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
  const [designSubTab, setDesignSubTab] = useState<'visual' | 'typography' | 'branding'>('visual');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  useEffect(() => {
    setLocalDesign(props.siteSettings);
  }, [props.siteSettings]);

  useEffect(() => {
    if (props.initialArticle) { setEditingItem({ type: 'news', data: props.initialArticle }); setActiveTab('news'); }
    if (props.initialPost) { setEditingItem({ type: 'post', data: props.initialPost }); setActiveTab('community'); }
  }, [props.initialArticle, props.initialPost]);

  const handleSave = (type: string, data: any) => {
    if (type === 'design') props.onUpdateSiteSettings(data);
    else if (type === 'news') {
      if (data.id) props.onUpdateNews(props.articles.map(a => a.id === data.id ? data : a));
      else props.onUpdateNews([{ ...data, id: 'n'+Date.now(), date: new Date().toISOString().split('T')[0] }, ...props.articles]);
    } else if (type === 'post') {
      props.onUpdatePosts(props.posts.map(p => p.id === data.id ? data : p));
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

  const handleBatchAiGenerate = async () => {
    const emptyArticles = props.articles.filter(a => !a.imageUrl || a.imageUrl.includes('placeholder') || a.imageUrl === '');
    if (emptyArticles.length === 0) {
      alert('이미지가 비어 있는 기사가 없습니다.');
      return;
    }
    if (!window.confirm(`${emptyArticles.length}개의 기사에 대해 AI 이미지를 생성하시겠습니까? (시간이 소요될 수 있습니다)`)) return;
    
    setIsBatchGenerating(true);
    const updatedArticles = [...props.articles];
    
    try {
      for (let i = 0; i < updatedArticles.length; i++) {
        const a = updatedArticles[i];
        if (!a.imageUrl || a.imageUrl.includes('placeholder') || a.imageUrl === '') {
          const url = await generateSingleImage(a.title, a.summary, 'news');
          if (url) updatedArticles[i] = { ...a, imageUrl: url };
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      props.onUpdateNews(updatedArticles);
      alert('비어 있는 모든 이미지의 AI 생성이 완료되었습니다.');
    } catch (e) {
      console.error(e);
      alert('일괄 생성 중 일부 오류가 발생했습니다.');
    } finally {
      setIsBatchGenerating(false);
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

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-fadeIn">
      {/* 어드민 헤더 */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-zinc-900/50 p-8 rounded-[3rem] border border-zinc-800 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic wp-serif uppercase tracking-tight">System Control Center</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Fine-Grained Content & Design Management</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleBatchAiGenerate} 
            disabled={isBatchGenerating}
            className="bg-primary/20 text-primary border border-primary/30 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
          >
            {isBatchGenerating ? <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div> : 'AI 이미지 일괄 생성'}
          </button>
          <button onClick={props.onBack} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">Exit Admin</button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
        {['design', 'news', 'shop', 'agency', 'community', 'profile', 'ads'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)} 
            className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-[4rem] min-h-[600px] shadow-2xl">
        
        {activeTab === 'design' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="flex gap-4 border-b border-zinc-900 pb-6 mb-8 overflow-x-auto no-scrollbar">
              {[
                {id: 'branding', label: '브랜딩 & 레이아웃'},
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

            {designSubTab === 'typography' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SliderInput label="메인 헤드라인 크기" min={30} max={120} value={localDesign.heroTitleSize} onChange={(v:number)=>setLocalDesign({...localDesign, heroTitleSize:v})} />
                <SliderInput label="뉴스 그리드 제목 크기" min={16} max={40} value={localDesign.gridTitleSize} onChange={(v:number)=>setLocalDesign({...localDesign, gridTitleSize:v})} />
                <SliderInput label="본문 폰트 크기" min={12} max={24} value={localDesign.bodyTextSize} onChange={(v:number)=>setLocalDesign({...localDesign, bodyTextSize:v})} />
                <SliderInput label="본문 행간 (Line Height)" min={1} max={2} step={0.1} value={localDesign.bodyLineHeight} onChange={(v:number)=>setLocalDesign({...localDesign, bodyLineHeight:v})} suffix="" />
                <SliderInput label="본문 자간 (Letter Spacing)" min={-0.2} max={0.2} step={0.01} value={localDesign.bodyLetterSpacing} onChange={(v:number)=>setLocalDesign({...localDesign, bodyLetterSpacing:v})} suffix="em" />
                <SliderInput label="사이드바 타이틀 크기" min={10} max={24} value={localDesign.sidebarTitleSize} onChange={(v:number)=>setLocalDesign({...localDesign, sidebarTitleSize:v})} />
                <SliderInput label="게시판 타이틀 크기" min={18} max={48} value={localDesign.boardTitleSize} onChange={(v:number)=>setLocalDesign({...localDesign, boardTitleSize:v})} />
              </div>
            )}

            {designSubTab === 'visual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorInput label="브랜드 기본색 (Primary)" value={localDesign.primaryColor} onChange={(v:string)=>setLocalDesign({...localDesign, primaryColor:v})} />
                <ColorInput label="배경 색상 (Background)" value={localDesign.bgColor} onChange={(v:string)=>setLocalDesign({...localDesign, bgColor:v})} />
                <ColorInput label="카드 배경색 (Card Bg)" value={localDesign.cardBgColor} onChange={(v:string)=>setLocalDesign({...localDesign, cardBgColor:v})} />
                <ColorInput label="본문 텍스트 색상" value={localDesign.bodyTextColor} onChange={(v:string)=>setLocalDesign({...localDesign, bodyTextColor:v})} />
                <ColorInput label="헤드라인 제목 색상" value={localDesign.heroTitleColor} onChange={(v:string)=>setLocalDesign({...localDesign, heroTitleColor:v})} />
                <SliderInput label="전역 곡률 (Border Radius)" min={0} max={50} value={localDesign.globalBorderRadius} onChange={(v:number)=>setLocalDesign({...localDesign, globalBorderRadius:v})} />
              </div>
            )}

            <div className="pt-10 flex gap-4">
              <button onClick={() => handleSave('design', localDesign)} className="flex-grow bg-primary py-6 rounded-3xl text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:brightness-110 transition-all">설정 사항 즉시 적용</button>
              <button onClick={() => setLocalDesign(props.siteSettings)} className="px-10 bg-zinc-900 py-6 rounded-3xl text-zinc-500 font-black uppercase text-xs tracking-widest hover:text-white transition-all">되돌리기</button>
            </div>
          </div>
        )}

        {/* 기사 관리 탭 */}
        {activeTab === 'news' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-6 mb-6">
              <h3 className="text-2xl font-black text-white italic uppercase">Editorial Manager</h3>
              <button 
                onClick={() => setEditingItem({ type: 'news', data: { title: '', summary: '', content: '', category: Category.LOCAL, imageUrl: '', mediaType: 'image', author: '김상균 기자', isHeadline: false } })} 
                className="bg-primary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg"
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

        {/* 프로필 관리 탭 */}
        {activeTab === 'profile' && (
          <div className="space-y-10 animate-fadeIn">
            <h3 className="text-2xl font-black text-white italic uppercase mb-8">Representative Profile Edit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="이름" value={props.profile.name} onChange={(v:string)=>props.onUpdateProfile({...props.profile, name:v})} />
              <TextInput label="직함" value={props.profile.title} onChange={(v:string)=>props.onUpdateProfile({...props.profile, title:v})} />
              <div className="md:col-span-2">
                <TextInput label="프로필 이미지 URL" value={props.profile.imageUrl} onChange={(v:string)=>props.onUpdateProfile({...props.profile, imageUrl:v})} />
              </div>
              <div className="md:col-span-2">
                <TextInput label="네이버 블로그 URL" value={props.profile.blogUrl} onChange={(v:string)=>props.onUpdateProfile({...props.profile, blogUrl:v})} />
              </div>
              <div className="md:col-span-2 space-y-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">프로필 소개 문구</label>
                <textarea 
                  value={props.profile.description} 
                  onChange={e => props.onUpdateProfile({...props.profile, description: e.target.value})}
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl p-6 text-sm text-zinc-300 h-32 resize-none focus:border-primary outline-none"
                />
              </div>
            </div>
            <button onClick={() => handleSave('profile', props.profile)} className="w-full bg-primary py-6 rounded-3xl text-white font-black uppercase text-xs tracking-widest">Save Profile Changes</button>
          </div>
        )}

        {/* 광고 관리 탭 */}
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
                  <TextInput label="서브 텍스트 / 연락처" value={ad.subtitle} onChange={(v:string)=>{
                    const newAds = [...props.ads]; newAds[idx].subtitle = v; props.onUpdateAds(newAds);
                  }} />
                  <TextInput label="연결 링크 (tel: 또는 URL)" value={ad.link} onChange={(v:string)=>{
                    const newAds = [...props.ads]; newAds[idx].link = v; props.onUpdateAds(newAds);
                  }} />
                  <TextInput label="미디어 URL (이미지/영상)" value={ad.mediaUrl} onChange={(v:string)=>{
                    const newAds = [...props.ads]; newAds[idx].mediaUrl = v; props.onUpdateAds(newAds);
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 쇼핑 관리 탭 (Affiliates & Goods) */}
        {activeTab === 'shop' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white italic uppercase">Affiliate Services</h3>
                <button onClick={() => setEditingItem({ type: 'affiliate', data: { name: '', description: '', content: '', price: '', imageUrl: '', tag: '추천', affiliateUrl: '#' } })} className="bg-primary text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {props.affiliates.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl group">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover shrink-0" alt="" />
                      <div className="min-w-0"><p className="text-white font-bold text-sm truncate">{p.name}</p></div>
                    </div>
                    <button onClick={() => setEditingItem({ type: 'affiliate', data: p })} className="text-primary text-[10px] font-black uppercase border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">Edit</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white italic uppercase">Official Store Goods</h3>
                <button onClick={() => setEditingItem({ type: 'goods', data: { name: '', description: '', price: '', imageUrl: '', isNew: true } })} className="bg-primary text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {props.goods.map(g => (
                  <div key={g.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl group">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={g.imageUrl} className="w-12 h-12 rounded-lg object-cover shrink-0" alt="" />
                      <div className="min-w-0"><p className="text-white font-bold text-sm truncate">{g.name}</p></div>
                    </div>
                    <button onClick={() => setEditingItem({ type: 'goods', data: g })} className="text-primary text-[10px] font-black uppercase border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 편집 모달 (Common) */}
        {editingItem && (
          <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl animate-fadeIn">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl p-10 rounded-[4rem] space-y-8 overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-white italic uppercase">Editing {editingItem.type}</h3>
                <button onClick={() => setEditingItem(null)} className="text-zinc-600 hover:text-white"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {editingItem.type === 'news' && (
                  <>
                    <div className="md:col-span-2"><TextInput label="기사 제목" value={editingItem.data.title} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, title: v}})} /></div>
                    <div className="md:col-span-2 relative">
                      <TextInput label="이미지/미디어 URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} />
                      <button 
                        onClick={handleGenerateAiImage}
                        disabled={isAiGenerating}
                        className="absolute right-6 bottom-3 bg-primary text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                      >
                        {isAiGenerating ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                        AI 이미지 생성
                      </button>
                    </div>
                    <TextInput label="카테고리" value={editingItem.data.category} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, category: v}})} />
                    <TextInput label="작성자" value={editingItem.data.author} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, author: v}})} />
                    <div className="md:col-span-2"><textarea value={editingItem.data.summary} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, summary: e.target.value}})} className="w-full bg-black/50 border border-zinc-800 p-6 text-white rounded-2xl h-24 text-sm" placeholder="기사 요약문" /></div>
                    <div className="md:col-span-2"><textarea value={editingItem.data.content} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} className="w-full bg-black/50 border border-zinc-800 p-6 text-white rounded-2xl h-72 text-sm leading-relaxed" placeholder="기사 본문 내용" /></div>
                  </>
                )}

                {(editingItem.type === 'affiliate' || editingItem.type === 'goods') && (
                  <>
                    <TextInput label="상품/서비스 명칭" value={editingItem.data.name} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, name: v}})} />
                    <TextInput label="가격" value={editingItem.data.price} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, price: v}})} />
                    <div className="md:col-span-2 relative">
                      <TextInput label="이미지 URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} />
                      <button 
                        onClick={handleGenerateAiImage}
                        disabled={isAiGenerating}
                        className="absolute right-6 bottom-3 bg-primary text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                      >
                        {isAiGenerating ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                        AI 이미지 생성
                      </button>
                    </div>
                    <div className="md:col-span-2"><textarea value={editingItem.data.description} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-black/50 border border-zinc-800 p-6 text-white rounded-2xl h-24 text-sm" placeholder="짧은 설명" /></div>
                    <div className="md:col-span-2"><textarea value={editingItem.data.content || editingItem.data.description} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} className="w-full bg-black/50 border border-zinc-800 p-6 text-white rounded-2xl h-48 text-sm leading-relaxed" placeholder="상세 정보" /></div>
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button onClick={() => handleSave(editingItem.type, editingItem.data)} className="flex-grow bg-primary py-6 rounded-3xl text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl">Confirm & Apply</button>
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
