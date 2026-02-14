
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
    alert('반영되었습니다.');
  };

  const generateAiImage = async (title: string, desc: string) => {
    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional cinematic photograph for: "${title}". Description: "${desc}". Studio lighting, high resolution.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (e) { console.error(e); } finally { setIsAiGenerating(false); }
    return null;
  };

  const handleAiImg = async () => {
    if (!editingItem) return;
    const url = await generateAiImage(editingItem.data.title || editingItem.data.name, editingItem.data.summary || editingItem.data.description || "");
    if (url) setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: url } });
  };

  const TextInput = ({ label, value, onChange, placeholder = '' }: any) => (
    <div className="flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all" />
    </div>
  );

  const ColorInput = ({ label, value, onChange }: any) => (
    <div className="flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-4">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-10 h-10 rounded bg-transparent border-none cursor-pointer" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="flex-grow bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-fadeIn">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-zinc-900/30 p-8 rounded-[3rem] border border-zinc-800/50 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic wp-serif uppercase tracking-tight">Management Suite</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Unified Control Dashboard</p>
        </div>
        <button onClick={props.onBack} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">Exit Admin</button>
      </div>

      {/* Main Tabs Styled Like Requested Image */}
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
            className={`px-8 py-5 rounded-[1.25rem] text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-lg ${activeTab === tab.id ? 'bg-[#004EA2] text-white' : 'bg-zinc-900/80 text-zinc-500 hover:text-zinc-300 border border-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-[4rem] min-h-[600px] shadow-2xl">
        
        {/* DESIGN SECTION */}
        {activeTab === 'design' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="flex gap-4 border-b border-zinc-900 pb-6 mb-8 overflow-x-auto no-scrollbar">
              {['branding', 'footer', 'typography', 'visual'].map(st => (
                <button key={st} onClick={() => setDesignSubTab(st as any)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${designSubTab === st ? 'bg-zinc-800 text-primary' : 'text-zinc-600 hover:text-white'}`}>{st}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {designSubTab === 'branding' && (
                <>
                  <TextInput label="Brand Name" value={localDesign.brandName} onChange={(v:string)=>setLocalDesign({...localDesign, brandName:v})} />
                  <TextInput label="Slogan" value={localDesign.brandSlogan} onChange={(v:string)=>setLocalDesign({...localDesign, brandSlogan:v})} />
                  <TextInput label="Support Phone" value={localDesign.heroPhone} onChange={(v:string)=>setLocalDesign({...localDesign, heroPhone:v})} />
                  <div className="flex flex-col gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visibility</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['showArchives', 'showReception', 'showAffiliates', 'showGoods', 'showYouTube', 'showProfile'].map(k => (
                        <button key={k} onClick={()=>setLocalDesign({...localDesign, [k]: !localDesign[k as keyof SiteSettings]})} className={`py-2 rounded-lg text-[9px] font-bold ${localDesign[k as keyof SiteSettings] ? 'bg-primary text-white' : 'bg-black text-zinc-700'}`}>{k}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {designSubTab === 'footer' && (
                <>
                  <TextInput label="Company" value={localDesign.companyName} onChange={(v:string)=>setLocalDesign({...localDesign, companyName:v})} />
                  <TextInput label="Registration" value={localDesign.registrationNum} onChange={(v:string)=>setLocalDesign({...localDesign, registrationNum:v})} />
                  <TextInput label="Publisher" value={localDesign.publisher} onChange={(v:string)=>setLocalDesign({...localDesign, publisher:v})} />
                  <TextInput label="Protection Officer" value={localDesign.youthProtectionOfficer} onChange={(v:string)=>setLocalDesign({...localDesign, youthProtectionOfficer:v})} />
                  <div className="md:col-span-2"><TextInput label="Address" value={localDesign.address} onChange={(v:string)=>setLocalDesign({...localDesign, address:v})} /></div>
                  <div className="md:col-span-2"><textarea value={localDesign.footerDescription} onChange={e=>setLocalDesign({...localDesign, footerDescription:e.target.value})} className="w-full bg-black/50 border border-zinc-800 p-6 text-white rounded-2xl h-24 text-sm" placeholder="Footer Description" /></div>
                </>
              )}
              {designSubTab === 'visual' && (
                <>
                  <ColorInput label="Primary Color" value={localDesign.primaryColor} onChange={(v:string)=>setLocalDesign({...localDesign, primaryColor:v})} />
                  <ColorInput label="Background" value={localDesign.bgColor} onChange={(v:string)=>setLocalDesign({...localDesign, bgColor:v})} />
                </>
              )}
            </div>
            <button onClick={() => handleSave('design', localDesign)} className="w-full bg-[#004EA2] py-6 rounded-3xl text-white font-black uppercase text-xs tracking-widest shadow-2xl">Apply Design Settings</button>
          </div>
        )}

        {/* NEWS SECTION */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">Editorial Archive</h3>
              <button onClick={() => setEditingItem({ type: 'news', data: { title: '', summary: '', content: '', category: Category.LOCAL, imageUrl: '', author: '김상균 기자' } })} className="bg-[#004EA2] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">+ New Article</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {props.articles.map(a => (
                <div key={a.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={a.imageUrl} className="w-16 h-12 object-cover rounded-lg shrink-0" alt="" />
                    <p className="text-white font-bold text-sm truncate">{a.title}</p>
                  </div>
                  <button onClick={() => setEditingItem({ type: 'news', data: a })} className="text-primary text-[10px] font-black uppercase border border-primary/20 px-4 py-2 rounded-lg">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHOP SECTION */}
        {activeTab === 'shop' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="space-y-6">
              <div className="flex justify-between items-center"><h4 className="text-lg font-black text-white">Affiliates</h4><button onClick={()=>setEditingItem({type:'affiliate', data:{name:'', price:'', imageUrl:'', description:'', tag:'추천'}})} className="bg-[#004EA2] text-white px-4 py-2 rounded-lg text-[9px] font-black">+ ADD</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {props.affiliates.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
                    <div className="flex items-center gap-4"><img src={p.imageUrl} className="w-12 h-12 rounded object-cover" /><p className="text-white text-sm font-bold">{p.name}</p></div>
                    <button onClick={() => setEditingItem({ type: 'affiliate', data: p })} className="text-primary text-[10px] font-black uppercase">Edit</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 pt-10">
              <div className="flex justify-between items-center"><h4 className="text-lg font-black text-white">Goods</h4><button onClick={()=>setEditingItem({type:'goods', data:{name:'', price:'', imageUrl:'', description:'', isNew:true}})} className="bg-[#004EA2] text-white px-4 py-2 rounded-lg text-[9px] font-black">+ ADD</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {props.goods.map(g => (
                  <div key={g.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
                    <div className="flex items-center gap-4"><img src={g.imageUrl} className="w-12 h-12 rounded object-cover" /><p className="text-white text-sm font-bold">{g.name}</p></div>
                    <button onClick={() => setEditingItem({ type: 'goods', data: g })} className="text-primary text-[10px] font-black uppercase">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AGENCY SECTION */}
        {activeTab === 'agency' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-black text-white mb-6 uppercase">Service Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {props.services.map(s => (
                <div key={s.id} className="flex justify-between items-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
                    </div>
                    <p className="text-white font-bold">{s.title}</p>
                  </div>
                  <button onClick={() => setEditingItem({ type: 'agency', data: s })} className="text-primary text-[10px] font-black uppercase border border-primary/20 px-4 py-2 rounded-lg">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY SECTION */}
        {activeTab === 'community' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-black text-white mb-6 uppercase">Manage Posts</h3>
            <div className="space-y-3">
              {props.posts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 rounded-2xl group hover:border-primary transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="px-2 py-0.5 bg-zinc-800 text-[8px] font-black text-zinc-500 rounded uppercase">{p.category}</span>
                    <p className="text-zinc-200 font-bold text-sm truncate">{p.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'community', data: p })} className="bg-zinc-800 text-zinc-400 px-4 py-1.5 rounded-lg text-[9px] font-black hover:text-white">Edit</button>
                    <button onClick={() => props.onUpdatePosts(props.posts.filter(x => x.id !== p.id))} className="bg-red-900/20 text-red-500 px-4 py-1.5 rounded-lg text-[9px] font-black hover:bg-red-600 hover:text-white transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE SECTION */}
        {activeTab === 'profile' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="Representative Name" value={props.profile.name} onChange={(v:string)=>props.onUpdateProfile({...props.profile, name:v})} />
              <TextInput label="Position Title" value={props.profile.title} onChange={(v:string)=>props.onUpdateProfile({...props.profile, title:v})} />
              <div className="md:col-span-2"><TextInput label="Photo URL" value={props.profile.imageUrl} onChange={(v:string)=>props.onUpdateProfile({...props.profile, imageUrl:v})} /></div>
              <div className="md:col-span-2"><textarea value={props.profile.description} onChange={e=>props.onUpdateProfile({...props.profile, description:e.target.value})} className="w-full bg-black/50 border border-zinc-800 p-6 text-white rounded-2xl h-32 text-sm leading-relaxed" placeholder="Bio description" /></div>
              
              {/* Careers List Editor */}
              <div className="md:col-span-2 space-y-4 p-6 bg-zinc-900/30 rounded-[3rem] border border-zinc-800/50">
                <div className="flex justify-between items-center mb-4"><label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Careers & Experiences</label><button onClick={()=>props.onUpdateProfile({...props.profile, careers: [...props.profile.careers, {label:'', type:'social'}]})} className="text-primary text-[9px] font-black uppercase">+ ADD ITEM</button></div>
                <div className="space-y-3">
                  {props.profile.careers.map((c:any, i:number) => (
                    <div key={i} className="flex gap-4 items-center">
                      <input className="flex-grow bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white" value={c.label} onChange={e=>{const nc=[...props.profile.careers]; nc[i].label=e.target.value; props.onUpdateProfile({...props.profile, careers:nc});}} placeholder="Position/Org" />
                      <select className="bg-black border border-zinc-800 rounded-xl px-3 py-3 text-[10px] text-zinc-500" value={c.type} onChange={e=>{const nc=[...props.profile.careers]; nc[i].type=e.target.value; props.onUpdateProfile({...props.profile, careers:nc});}}>
                        <option value="political">Political</option><option value="social">Social</option><option value="local">Local</option><option value="media">Media</option>
                      </select>
                      <button onClick={()=>{const nc=props.profile.careers.filter((_:any,idx:number)=>idx!==i); props.onUpdateProfile({...props.profile, careers:nc});}} className="text-red-900 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => handleSave('profile', props.profile)} className="w-full bg-[#004EA2] py-6 rounded-3xl text-white font-black uppercase text-xs tracking-widest shadow-2xl">Confirm Profile Updates</button>
          </div>
        )}

        {/* ADS SECTION */}
        {activeTab === 'ads' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-black text-white mb-6 uppercase">Advertisement Slots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.ads.map((ad, idx) => (
                <div key={ad.id} className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-4">
                  <span className="px-3 py-1 bg-zinc-800 text-primary text-[9px] font-black rounded-full">{ad.slot}</span>
                  <TextInput label="Title" value={ad.title} onChange={(v:string)=>{const na=[...props.ads]; na[idx].title=v; props.onUpdateAds(na);}} />
                  <TextInput label="Media URL" value={ad.mediaUrl} onChange={(v:string)=>{const na=[...props.ads]; na[idx].mediaUrl=v; props.onUpdateAds(na);}} />
                  <TextInput label="Target Link" value={ad.link} onChange={(v:string)=>{const na=[...props.ads]; na[idx].link=v; props.onUpdateAds(na);}} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generic Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl animate-fadeIn">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl p-10 rounded-[4rem] space-y-8 overflow-y-auto max-h-[90vh] no-scrollbar shadow-2xl">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-6">
                <h3 className="text-3xl font-black text-white italic uppercase">{editingItem.type} Editor</h3>
                <button onClick={() => setEditingItem(null)} className="text-zinc-600 hover:text-white p-2 bg-zinc-900 rounded-full transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(editingItem.type === 'news' || editingItem.type === 'community') && (
                  <>
                    <div className="md:col-span-2"><TextInput label="Title" value={editingItem.data.title} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, title: v}})} /></div>
                    <TextInput label="Category" value={editingItem.data.category} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, category: v}})} />
                    <TextInput label="Author" value={editingItem.data.author} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, author: v}})} />
                    {editingItem.type === 'news' && (
                      <div className="md:col-span-2 relative">
                        <TextInput label="Image URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} />
                        <button onClick={handleAiImg} disabled={isAiGenerating} className="absolute right-4 bottom-3 bg-primary text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">{isAiGenerating ? '...' : 'AI Image'}</button>
                      </div>
                    )}
                    <div className="md:col-span-2"><textarea value={editingItem.data.content} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, content: e.target.value}})} className="w-full bg-black border border-zinc-800 p-8 text-white rounded-3xl h-72 text-lg focus:border-primary outline-none" placeholder="Body Content" /></div>
                  </>
                )}
                {(editingItem.type === 'affiliate' || editingItem.type === 'goods') && (
                  <>
                    <TextInput label="Item Name" value={editingItem.data.name} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, name: v}})} />
                    <TextInput label="Price" value={editingItem.data.price} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, price: v}})} />
                    <div className="md:col-span-2 relative">
                      <TextInput label="Image URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} />
                      <button onClick={handleAiImg} className="absolute right-4 bottom-3 bg-primary text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase">AI Match</button>
                    </div>
                    <div className="md:col-span-2"><textarea value={editingItem.data.description} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-black border border-zinc-800 p-6 text-white rounded-2xl h-32 focus:border-primary outline-none" placeholder="Description Text" /></div>
                  </>
                )}
                {editingItem.type === 'agency' && (
                  <>
                    <TextInput label="Service Title" value={editingItem.data.title} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, title: v}})} />
                    <TextInput label="Icon Path (SVG d)" value={editingItem.data.icon} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, icon: v}})} />
                    <div className="md:col-span-2"><TextInput label="Hero Image URL" value={editingItem.data.imageUrl} onChange={(v:string)=>setEditingItem({...editingItem, data: {...editingItem.data, imageUrl: v}})} /></div>
                    <div className="md:col-span-2"><textarea value={editingItem.data.description} onChange={e=>setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full bg-black border border-zinc-800 p-6 text-white rounded-2xl h-24 focus:border-primary outline-none" placeholder="Short Summary" /></div>
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-10 border-t border-zinc-900">
                <button onClick={() => handleSave(editingItem.type, editingItem.data)} className="flex-grow bg-[#004EA2] py-6 rounded-3xl text-white font-black uppercase text-xs tracking-widest shadow-2xl">Confirm & Apply Changes</button>
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
