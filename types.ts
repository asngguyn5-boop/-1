
export enum Category {
  POLITICS = '정치',
  ECONOMY = '소상공인홍보',
  ENVIRONMENT = '환경감시',
  DRONE = '드론항공촬영',
  DETECTIVE = '탐정/인력',
  NOTICE = '공지',
  LOCAL = '천안소식'
}

export type MediaType = 'image' | 'video' | 'youtube' | 'none';
export type AdActionType = 'link' | 'expand' | 'none';

export interface User {
  id: string;
  loginId: string;
  password?: string;
  name: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  category: Category;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  mediaType: MediaType;
  isHeadline?: boolean;
  isSponsored?: boolean;
  titleSize?: number;
}

export interface CommunityPost {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  isHot?: boolean;
  isNotice?: boolean;
  images?: string[];
  files?: { name: string; url: string; size?: string }[];
  userId?: string;
}

export interface ReceptionService {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  content?: string; // 상세 설명 필드 추가
  price: string;
  imageUrl: string;
  tag: string;
  affiliateUrl: string;
}

export interface GoodsItem {
  id: string;
  name: string;
  description?: string; // 상세 설명 필드 추가
  price: string;
  imageUrl: string;
  isNew?: boolean;
}

export interface AdContent {
  id: string;
  slot: 'top_left' | 'top_right' | 'mid_left' | 'mid_right' | 'sidebar_ad' | 'bottom_full';
  title: string;
  subtitle: string;
  link?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  actionType?: AdActionType;
  opacity?: number;
}

export interface PopupSettings {
  isActive: boolean;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  id?: string;
  mediaType?: MediaType;
}

export interface SiteSettings {
  heroTitleSize: number;
  gridTitleSize: number;
  bodyTextSize: number;
  bodyLineHeight: number; 
  bodyLetterSpacing: number; 
  sidebarTitleSize: number;
  boardTitleSize: number; 
  footerTitleSize: number; 
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string; 
  cardBgColor: string; 
  heroTitleColor: string;
  headlineColor: string;
  bodyTextColor: string;
  globalBorderRadius: number; 
  brandName: string;
  brandSubName: string;
  brandSlogan: string;
  brandAiLabel: string;
  navNotice: string;
  navPolitics: string;
  navPromo: string;
  navEnvironment: string;
  navReport: string; 
  navVolunteer: string;
  navBoard: string;
  navShop: string;
  navServiceBtn: string;
  navLocal: string;
  heroIndependentLabel: string;
  heroLatestLabel: string;
  heroPhone: string;
  heroServices: string[];
  showArchives: boolean;
  showReception: boolean;
  showAffiliates: boolean;
  showGoods: boolean;
  showYouTube: boolean;
  showProfile: boolean;
  footerDescription: string;
  address: string;
  phone: string;
  email: string;
  registrationNum: string;
  publisher: string;
  registrationDate: string;
  editor: string;
  companyName: string;
}

export interface Order {
  id: string;
  productName: string;
  customerName: string;
  date: string;
  status: string;
  productPrice: string;
  quantity: number;
  totalPrice: number;
  customerPhone: string;
  address: string;
  paymentMethod: string;
}

export interface StateSnapshot {
  timestamp: string;
  description: string;
  news: NewsArticle[];
  siteSettings: SiteSettings;
  posts: CommunityPost[];
  ads: AdContent[];
}

export type AdminTab = 'news' | 'community' | 'users' | 'agency' | 'shop' | 'profile' | 'ads' | 'popup' | 'design' | 'history';
export type ViewState = 'main' | 'admin' | 'article' | 'community' | 'post_detail' | 'notice';

export interface AIMessage {
  role: 'user' | 'model';
  text: string;
  groundingLinks?: { title: string; uri: string }[];
  isAudio?: boolean;
}
