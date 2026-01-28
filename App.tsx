
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import NewsGrid from './components/NewsGrid';
import Sidebar from './components/Sidebar';
import EditorialArchives from './components/EditorialArchives';
import ReceptionSection from './components/ReceptionSection';
import ReceptionModal from './components/ReceptionModal';
import AffiliateSection from './components/AffiliateSection';
import GoodsSection from './components/GoodsSection';
import ProductInquiryModal from './components/ProductInquiryModal';
import RepresentativeProfile from './components/RepresentativeProfile';
import YouTubeCTA from './components/YouTubeCTA';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ArticleDetail from './components/ArticleDetail';
import BoardSection from './components/BoardSection';
import PostDetail from './components/PostDetail';
import AdminLoginModal from './components/AdminLoginModal';
import NavMenu from './components/NavMenu';
import CategorySpotlight from './components/CategorySpotlight'; 
import MobileBottomNav from './components/MobileBottomNav';
import MainPopup from './components/MainPopup';
import EntryCover from './components/EntryCover';
import AIAssistant from './components/AIAssistant';
import ImageModal from './components/ImageModal';
import { INITIAL_NEWS, INITIAL_POSTS, RECEPTION_SERVICES, REPRESENTATIVE_PROFILE, AFFILIATE_PRODUCTS, GOODS_ITEMS, INITIAL_ADS, INITIAL_SITE_SETTINGS, INITIAL_POPUP, FORMSPREE_URL } from './constants';
import { NewsArticle, ViewState, CommunityPost, ReceptionService, AffiliateProduct, GoodsItem, AdContent, SiteSettings, Order, PopupSettings, User, AdminTab } from './types';

const App: React.FC = () => {
  const getSaved = (key: string, def: any) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === 'undefined' || saved === 'null') return def;
      return JSON.parse(saved);
    } catch (e) {
      return def;
    }
  };

  const [showCover, setShowCover] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [news, setNews] = useState<NewsArticle[]>(() => getSaved('news_data', INITIAL_NEWS));
  const [posts, setPosts] = useState<CommunityPost[]>(() => getSaved('posts_data', INITIAL_POSTS));
  const [users, setUsers] = useState<User[]>(() => getSaved('users_data', [
    { id: 'u0', loginId: 'admin', password: 'password', name: '최고관리자', phone: '010-0000-0000', role: 'admin', createdAt: '2024-01-01' }
  ]));
  const [services, setServices] = useState<ReceptionService[]>(() => getSaved('services_data', RECEPTION_SERVICES));
  const [profile, setProfile] = useState(() => getSaved('profile_data', REPRESENTATIVE_PROFILE));
  const [affiliates, setAffiliates] = useState<AffiliateProduct[]>(() => getSaved('affiliates_data', AFFILIATE_PRODUCTS));
  const [goods, setGoods] = useState<GoodsItem[]>(() => getSaved('goods_data', GOODS_ITEMS));
  const [ads, setAds] = useState<AdContent[]>(() => getSaved('ads_data', INITIAL_ADS));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSaved('site_settings', INITIAL_SITE_SETTINGS));
  const [popup, setPopup] = useState<PopupSettings>(() => getSaved('popup_settings', INITIAL_POPUP));
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => getSaved('current_user', null));
  const [view, setView] = useState<ViewState>('main');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [boardCategory, setBoardCategory] = useState<string>('전체');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [selectedService, setSelectedService] = useState<ReceptionService | null>(null);
  const [selectedInquiryItem, setSelectedInquiryItem] = useState<{item: any, type: 'affiliate' | 'goods'} | null>(null);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab | undefined>(undefined);
  const [adminEditTarget, setAdminEditTarget] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('news_data', JSON.stringify(news));
    localStorage.setItem('posts_data', JSON.stringify(posts));
    localStorage.setItem('site_settings', JSON.stringify(siteSettings));
    localStorage.setItem('profile_data', JSON.stringify(profile));
    localStorage.setItem('affiliates_data', JSON.stringify(affiliates));
    localStorage.setItem('goods_data', JSON.stringify(goods));
    localStorage.setItem('ads_data', JSON.stringify(ads));
    localStorage.setItem('popup_settings', JSON.stringify(popup));
  }, [news, posts, siteSettings, profile, affiliates, goods, ads, popup]);

  const handleNavNavigate = useCallback((target: string, type: 'view' | 'scroll' | 'category' | 'reception') => {
    setIsNavMenuOpen(false);
    if (type === 'view') {
      setView(target as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'category') {
      setSelectedCategory(target);
      setView('main');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (type === 'reception') {
      const service = services.find(s => s.id === target) || services[0];
      setSelectedService(service);
    } else if (type === 'scroll') {
      if (view !== 'main') setView('main');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          const yOffset = -100;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [services, view]);

  const handleScrollTo = useCallback((id: string, category?: string) => {
    if (category) setBoardCategory(category);
    handleNavNavigate(id, 'scroll');
  }, [handleNavNavigate]);

  const openAdminWithTab = (tab: AdminTab, target?: any) => {
    setAdminInitialTab(tab);
    setAdminEditTarget(target || null);
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewPost = async (newPostData: any) => {
    const newPost: CommunityPost = {
      ...newPostData,
      id: 'p' + Date.now(),
      views: 0,
      comments: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setPosts([newPost, ...posts]);
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[커뮤니티 새 게시글/제보] ${newPost.category}: ${newPost.title}`,
          category: newPost.category,
          title: newPost.title,
          author: newPost.author,
          content: newPost.content,
          submittedAt: new Date().toLocaleString()
        })
      });
    } catch (e) { console.error('Formspree notify failed', e); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: siteSettings.bgColor, color: siteSettings.bodyTextColor }}>
      <style>{`
        :root { 
          --primary-color: ${siteSettings.primaryColor}; 
          --global-radius: ${siteSettings.globalBorderRadius}px; 
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .container-wide { max-width: 1280px; margin: 0 auto; padding: 0 1.25rem; }
        .hero-title-dynamic { font-size: ${siteSettings.heroTitleSize}px; color: ${siteSettings.heroTitleColor}; }
        .grid-title-dynamic { font-size: ${siteSettings.gridTitleSize}px; }
        .body-text-dynamic { font-size: ${siteSettings.bodyTextSize}px; line-height: ${siteSettings.bodyLineHeight}; letter-spacing: ${siteSettings.bodyLetterSpacing}em; }
        .sidebar-title-dynamic { font-size: ${siteSettings.sidebarTitleSize}px; }
        .board-title-dynamic { font-size: ${siteSettings.boardTitleSize}px; }
        .footer-title-dynamic { font-size: ${siteSettings.footerTitleSize}px; }
        @media (max-width: 768px) {
          .hero-title-dynamic { font-size: ${Math.max(32, siteSettings.heroTitleSize * 0.6)}px; }
          .body-text-dynamic { font-size: ${Math.max(14, siteSettings.bodyTextSize * 0.9)}px; }
        }
      `}</style>

      {showCover && <EntryCover settings={siteSettings} onEnter={() => setShowCover(false)} />}

      <Header 
        settings={siteSettings} currentUser={currentUser}
        onHome={() => { setView('main'); setSelectedCategory(null); window.scrollTo({top:0, behavior:'smooth'}); }} 
        onCategorySelect={(cat) => handleNavNavigate(cat, 'category')}
        onAdmin={() => openAdminWithTab('design')}
        onOpenMenu={() => setIsNavMenuOpen(true)} 
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => isAdminMode ? setIsAdminMode(false) : setShowLoginModal(true)}
        onLoginClick={() => {}}
        onLogout={() => setCurrentUser(null)}
        onNoticeDetail={() => handleScrollTo('board-section', '공지')}
        onScrollTo={handleScrollTo}
        onOpenReception={() => setSelectedService(services[0])}
      />

      <main className="flex-grow w-full">
        {view === 'main' ? (
          <div className="space-y-0 animate-fadeIn">
             <div className="container-wide py-10">
               <HeroSection 
                  settings={siteSettings} 
                  article={(news.find(a=>a.isHeadline) || news[0])} 
                  onClick={(a)=>{setSelectedArticle(a); setView('article'); window.scrollTo({top:0, behavior:'smooth'});}} 
                  isAdminMode={isAdminMode} 
                  onEdit={(a) => openAdminWithTab('news', a)}
               />
               <CategorySpotlight 
                  news={news} 
                  onCategorySelect={(cat) => handleNavNavigate(cat, 'category')} 
                  onArticleClick={(a)=>{setSelectedArticle(a); setView('article'); window.scrollTo({top:0, behavior:'smooth'});}} 
               />
             </div>

             <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-10 py-10">
               <div className="lg:col-span-8 space-y-12">
                 <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                    <h2 className="brand-serif text-4xl font-black text-white italic tracking-tight uppercase">Latest Reports</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">{selectedCategory || 'World News Feed'}</span>
                      {isAdminMode && (
                        <button onClick={() => openAdminWithTab('news')} className="bg-primary text-white text-[9px] px-3 py-1 rounded-full font-black">EDIT NEWS</button>
                      )}
                    </div>
                 </div>
                 <NewsGrid articles={selectedCategory ? news.filter(a=>a.category===selectedCategory) : news} onArticleClick={(a)=>{setSelectedArticle(a); setView('article'); window.scrollTo({top:0, behavior:'smooth'});}} />
                 
                 {siteSettings.showArchives && (
                   <EditorialArchives news={news} onArticleClick={(a)=>{setSelectedArticle(a); setView('article'); window.scrollTo({top:0, behavior:'smooth'});}} isAdminMode={isAdminMode} activeCategory={selectedCategory} />
                 )}

                 <BoardSection 
                    posts={posts} activeCategory={boardCategory} onCategoryChange={setBoardCategory} 
                    onPostClick={(p)=>{setSelectedPost(p); setView('post_detail'); window.scrollTo({top:0, behavior:'smooth'});}} 
                    onNewPost={handleNewPost} 
                    primaryColor={siteSettings.primaryColor} isAdminMode={isAdminMode} 
                    onAdmin={() => openAdminWithTab('community')}
                 />
               </div>
               <div className="lg:col-span-4">
                 <Sidebar 
                    news={news} goods={goods} ads={ads} settings={siteSettings} 
                    onArticleClick={(a)=>{setSelectedArticle(a); setView('article'); window.scrollTo({top:0, behavior:'smooth'});}} 
                    isAdminMode={isAdminMode}
                    onAdmin={(tab) => openAdminWithTab(tab)}
                    onExpand={setZoomedImage}
                 />
               </div>
             </div>

             {siteSettings.showReception && (
               <div className="container-wide border-t border-zinc-900 pt-20 pb-20" id="reception-section">
                 <ReceptionSection 
                    services={services} 
                    onSelectService={(s) => setSelectedService(s)} 
                    isAdminMode={isAdminMode} 
                    onAdmin={() => openAdminWithTab('agency')}
                 />
               </div>
             )}
             
             {siteSettings.showAffiliates && (
               <div className="container-wide border-t border-zinc-900 pt-20 pb-20" id="affiliate-section">
                 <AffiliateSection 
                    products={affiliates} 
                    isAdminMode={isAdminMode} 
                    onAdmin={() => openAdminWithTab('shop')}
                    onPurchase={(p) => setSelectedInquiryItem({item: p, type: 'affiliate'})} 
                 />
               </div>
             )}

             {siteSettings.showGoods && (
               <div className="container-wide border-t border-zinc-900 pt-20 pb-20" id="goods-section">
                 <GoodsSection 
                    items={goods} 
                    isAdminMode={isAdminMode} 
                    onAdmin={() => openAdminWithTab('shop')}
                    onPurchase={(g) => setSelectedInquiryItem({item: g, type: 'goods'})} 
                 />
               </div>
             )}

             {siteSettings.showProfile && (
               <div className="container-wide border-t border-zinc-900 pt-20 pb-20" id="profile-section">
                 <RepresentativeProfile 
                    profile={profile} 
                    isAdminMode={isAdminMode} 
                    onAdmin={() => openAdminWithTab('profile')}
                    onImageClick={setZoomedImage}
                 />
               </div>
             )}

             {siteSettings.showYouTube && (
               <div className="container-wide border-t border-zinc-900 pt-20 pb-20" id="youtube-section">
                 <YouTubeCTA isAdminMode={isAdminMode} onAdmin={() => openAdminWithTab('design')} />
               </div>
             )}
          </div>
        ) : view === 'article' && selectedArticle ? (
          <ArticleDetail 
            article={selectedArticle} 
            onBack={() => setView('main')} 
            isAdminMode={isAdminMode}
            onEdit={() => openAdminWithTab('news', selectedArticle)}
            onImageClick={setZoomedImage}
          />
        ) : view === 'post_detail' && selectedPost ? (
          <PostDetail 
            post={selectedPost} 
            onBack={() => setView('main')} 
            isAdminMode={isAdminMode}
            onEdit={() => openAdminWithTab('community', selectedPost)}
          />
        ) : view === 'admin' ? (
          <AdminDashboard 
            articles={news} posts={posts} services={services} profile={profile} affiliates={affiliates} goods={goods} ads={ads} orders={orders} siteSettings={siteSettings} popup={popup} users={users} history={[]} 
            initialTab={adminInitialTab}
            initialArticle={adminEditTarget?.id?.startsWith('n') ? adminEditTarget : null}
            initialPost={adminEditTarget?.id?.startsWith('p') ? adminEditTarget : null}
            onUpdateNews={setNews} onUpdatePosts={setPosts} onUpdateServices={setServices} onUpdateProfile={setProfile} onUpdateAffiliates={setAffiliates} onUpdateGoods={setGoods} onUpdateAds={setAds} onUpdateSiteSettings={setSiteSettings} onUpdatePopup={setPopup} onUpdateOrders={setOrders} onUpdateUsers={setUsers} onRestoreHistory={()=>{}} onEmergencyReset={()=>{}} onBack={() => setView('main')} 
          />
        ) : null}
      </main>

      <Footer 
        settings={siteSettings} 
        onCategorySelect={(cat) => handleNavNavigate(cat, 'category')} 
        isAdminMode={isAdminMode}
        onAdmin={() => openAdminWithTab('design')}
      />
      <MobileBottomNav 
        onNavigate={handleScrollTo} activeTab={view === 'main' ? 'home' : (view === 'admin' ? 'admin' : 'other')} 
        onOpenAdmin={() => openAdminWithTab('design')} 
        onOpenReception={() => setSelectedService(services[0])} 
      />
      <NavMenu isOpen={isNavMenuOpen} onClose={() => setIsNavMenuOpen(false)} settings={siteSettings} onNavigate={handleNavNavigate} />
      {showLoginModal && <AdminLoginModal onClose={() => setShowLoginModal(false)} onSuccess={() => { setIsAdminMode(true); setShowLoginModal(false); }} />}
      {selectedService && <ReceptionModal service={selectedService} onClose={() => setSelectedService(null)} onSubmit={() => {}} primaryColor={siteSettings.primaryColor} />}
      {selectedInquiryItem && <ProductInquiryModal item={selectedInquiryItem.item} type={selectedInquiryItem.type} onClose={() => setSelectedInquiryItem(null)} primaryColor={siteSettings.primaryColor} />}
      <MainPopup settings={popup} onAction={handleScrollTo} />
      <ImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />

      <button 
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[80] w-16 h-16 bg-primary rounded-full shadow-[0_10px_40px_rgba(0,78,162,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all animate-bounce"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </button>
      <AIAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};

export default App;
