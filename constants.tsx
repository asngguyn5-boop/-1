
import { Category, NewsArticle, ReceptionService, AffiliateProduct, GoodsItem, CommunityPost, AdContent, SiteSettings, PopupSettings } from './types';

// Formspree API Endpoint - 모든 실시간 신청 및 제보가 이 링크로 전송됩니다.
export const FORMSPREE_URL = 'https://formspree.io/f/mqeqpaqa';

export const REPRESENTATIVE_PROFILE = {
  name: '김상균',
  title: '대표 / 발행인 / 기자',
  description: 'AI천안뉴스 및 종합기획사의 대표로서, 지역 사회의 공정한 보도와 지속 가능한 발전을 위해 헌신하고 있습니다. 미디어 전문성과 사회 활동을 결합하여 천안의 새로운 가치를 창출합니다.',
  imageUrl: 'https://postfiles.pstatic.net/MjAyNjAxMjdfMjU1/MDAxNzY5NDM5NzMxODUy.qKiDXjMGyyOzgCMl7pNFJN4ne9pn4SpCroz5PbqHkcMg.VQ1mQnXu7sY4jP4fBsGVlEOHAoo6nLKN2Z_zgIfWdj8g.JPEG/1769439617689.jpg?type=w3840',
  blogUrl: 'https://blog.naver.com/asnggyun',
  careers: [
    { label: '현) 더불어민주당 천안갑 탄소중립위원장', type: 'political' },
    { label: '아주따뜻한봉사단 사무처장', type: 'social' },
    { label: '먹사니즘전국네트워크 충남 사무국장', type: 'social' },
    { label: '밝은도시천안포럼 홍보국장', type: 'social' },
    { label: '천안을 같이걷자 방장', type: 'local' },
    { label: '우리가언론사 나도기자단', type: 'media' },
    { label: '내부제보실천운동 활동', type: 'social' }
  ]
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  heroTitleSize: 82, 
  gridTitleSize: 26,
  bodyTextSize: 18,
  bodyLineHeight: 1.4,
  bodyLetterSpacing: -0.05, 
  sidebarTitleSize: 14,
  boardTitleSize: 24,
  footerTitleSize: 18,
  globalBorderRadius: 32,
  primaryColor: '#004EA2',
  secondaryColor: '#FFD700',
  accentColor: '#FF3B30',
  bgColor: '#000000',
  cardBgColor: '#111111',
  heroTitleColor: '#FFFFFF',
  headlineColor: '#FFFFFF',
  bodyTextColor: '#A1A1AA',
  showArchives: true,
  showReception: true,
  showAffiliates: true,
  showGoods: true,
  showYouTube: true,
  showProfile: true,
  brandName: '천안뉴스',
  brandSubName: '기획사',
  brandSlogan: '천안 상균아놀자tv',
  brandAiLabel: 'AI',
  navNotice: '공지사항',
  navPolitics: '정치',
  navPromo: '소상공인홍보',
  navEnvironment: '환경감시',
  navReport: '천안소식', 
  navVolunteer: '드론항공촬영',
  navBoard: '자유게시판',
  navShop: '쇼핑/제휴',
  navServiceBtn: '고객접수',
  navLocal: '천안소식',
  heroIndependentLabel: 'INDEPENDENT MEDIA PLATFORM',
  heroLatestLabel: 'THE HEADLINE REPORT',
  heroServices: ['영상촬영 편집 • 홍보', '드론 항공 촬영', '광고물 전문 제작', '1인 언론 미디어', '인력관리 • 탐정'],
  heroPhone: '010-3425-0755',
  registrationNum: '충남, 아00000',
  registrationDate: '2024년 01월 01일',
  publisher: '김상균',
  editor: '김상균',
  address: '충청남도 천안시 동남구 버들로 1-4 (대흥동) 세광사진관 2층',
  phone: '010-3425-0755',
  email: 'asngguyn5@gmail.com',
  companyName: 'AI천안뉴스 • 종합기획사',
  footerDescription: 'AI천안뉴스는 천안 지역의 미디어 문화 발전과 기업의 성장을 돕는 파트너입니다.'
};

export const INITIAL_POPUP: PopupSettings = {
  id: 'main-popup',
  isActive: true,
  title: '필독: 커뮤니티 이용 규칙 안내',
  subtitle: '쾌적한 소통 공간을 위해 공지사항을 반드시 확인해 주세요.',
  imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=2070',
  linkUrl: 'p1'
};

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    category: Category.LOCAL, 
    title: '천안의 내일을 디자인하는 AI 미디어의 혁신적 도약',
    summary: '정론직필의 정신과 최첨단 AI 기술이 만났습니다. 우리는 천안 지역 사회의 숨겨진 목소리를 대변하고 새로운 미디어 생태계를 구축합니다.',
    content: 'AI천안뉴스는 데이터 기반의 공정하고 신속한 보도를 원칙으로 합니다. 우리는 지역 소외 계층의 목소리를 대변하고 소상공인의 활로를 여는 데 앞장서겠습니다.\n\n또한 미디어와 기획이 결합된 새로운 모델을 통해 천안 시민들의 일상을 더욱 가치 있게 만들고자 합니다. 영상 촬영부터 드론 항공 촬영까지, 기술이 뉴스를 만날 때 생기는 놀라운 변화를 직접 경험해 보세요.',
    author: '김상균 기자',
    date: '2024-05-20',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070', 
    mediaType: 'image',
    isHeadline: true,
    titleSize: 82
  },
  {
    id: 'n2',
    category: Category.POLITICS,
    title: '천안시 의회, 지역 경제 활성화를 위한 민생 조례 통과',
    summary: '이번 조례 통과로 지역 소상공인들을 위한 실질적인 지원책이 마련될 것으로 기대됩니다.',
    content: '천안시 의회는 오늘 본회의를 열고 소상공인 지원 조례안을 가결했습니다. 이는 김상균 기자가 지속적으로 보도해온 민생 과제 중 하나였습니다.\n\n이번 조례는 디지털 전환 비용 지원 및 임대료 보조 등을 골자로 하고 있으며, 향후 3년간 천안 지역 경제의 버팀목이 될 예정입니다.',
    author: '김상균 기자',
    date: '2024-05-21',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=2069',
    mediaType: 'image'
  },
  {
    id: 'n3',
    category: Category.ENVIRONMENT,
    title: '천안천 수질 개선 프로젝트, 시민 참여로 성과 가시화',
    summary: '환경 감시단과 시민들의 자발적인 참여로 천안천의 생태계가 점차 회복되고 있습니다.',
    content: '천안 환경 감시 활동이 결실을 맺고 있습니다. 수질 분석 결과 생물학적 산소요구량이 현저히 낮아진 것으로 나타났습니다.\n\n특히 지역 주민들이 직접 참여하는 하천 정화 활동과 환경 교육 프로그램이 큰 역할을 했습니다. 우리는 계속해서 맑고 깨끗한 천안을 만들기 위해 감시의 눈을 늦추지 않겠습니다.',
    author: '김상균 기자',
    date: '2024-05-22',
    imageUrl: 'https://images.unsplash.com/photo-1532300481631-0bc14f3b7699?auto=format&fit=crop&q=80&w=2070',
    mediaType: 'image'
  },
  {
    id: 'n4',
    category: Category.ECONOMY,
    title: '소상공인 디지털 전환 성공 사례: 지역 명소로 거듭나다',
    summary: 'AI천안뉴스의 홍보 기획 지원을 받은 전통시장 상점들이 MZ세대의 핫플레이스로 등극했습니다.',
    content: '종합기획사의 영상 촬영 및 마케팅 지원을 통해 전통시장 내 노포들이 새로운 전성기를 맞이하고 있습니다.\n\n단순한 물건 판매를 넘어 상점의 스토리를 담은 영상과 세련된 홍보물 제작이 고객들의 발길을 끌어모으고 있습니다. 소상공인 여러분의 열정과 우리의 기획력이 만나 최고의 시너지를 냅니다.',
    author: '김상균 기자',
    date: '2024-05-23',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1974',
    mediaType: 'image'
  },
  {
    id: 'n5',
    category: Category.DRONE,
    title: '천안 도심 항공 촬영, 4K 초고화질로 담아낸 도시의 미학',
    summary: '드론 기술을 활용해 천안의 발전상을 입체적으로 기록하는 종합기획사의 최신 프로젝트입니다.',
    content: '드론 항공 촬영 기술이 비약적으로 발전하며 천안의 도시 전경을 새로운 시각에서 담아내고 있습니다.\n\n4K 고해상도 영상을 통해 보는 천안은 우리가 알던 모습보다 훨씬 역동적이고 아름답습니다. 이 영상들은 홍보물 제작뿐만 아니라 도시 계획의 소중한 자료로 활용될 예정입니다.',
    author: '김상균 기자',
    date: '2024-05-24',
    imageUrl: 'https://images.unsplash.com/photo-1473968512463-0c582c00a44e?auto=format&fit=crop&q=80&w=2070',
    mediaType: 'image'
  },
  {
    id: 'n6',
    category: Category.DETECTIVE,
    title: '전문 탐정 서비스의 사회적 역할과 권익 보호의 미래',
    summary: '민간 조사 활동을 통해 지역 시민들의 억울함을 해소하고 사실 관계를 명확히 규명합니다.',
    content: '인력 관리와 탐정 서비스는 현대 사회에서 개인의 권익을 보호하는 중요한 축으로 자리 잡고 있습니다.\n\nAI천안뉴스 종합기획사는 법 테두리 안에서 전문적인 조사 역량을 발휘하여 시민들의 고민을 해결합니다. 투명하고 정직한 조사를 통해 억울한 사례가 없도록 최선을 다하겠습니다.',
    author: '김상균 기자',
    date: '2024-05-25',
    imageUrl: 'https://images.unsplash.com/photo-1541829081-f3f94bb44ecb?auto=format&fit=crop&q=80&w=2070',
    mediaType: 'image'
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    category: '공지',
    title: 'AI천안뉴스 공식 커뮤니티 이용 규칙 안내',
    author: '운영자',
    date: '2024-05-21',
    views: 1250,
    comments: 0,
    isNotice: true,
    content: '쾌적한 커뮤니티 환경을 위해 욕설 및 비방글은 제한됩니다. 정론직필의 미디어 문화를 함께 만들어가 주세요.'
  }
];

export const RECEPTION_SERVICES: ReceptionService[] = [
  { 
    id: 'rs1', 
    title: '영상촬영 및 편집', 
    description: '기업 홍보, 유튜브 콘텐츠 제작 및 광고 영상 제작 접수', 
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    imageUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=2070'
  },
  { 
    id: 'rs2', 
    title: '드론 항공 촬영', 
    description: '4K 고해상도 드론 항공 촬영 및 시설물 점검 촬영 신청', 
    icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
    imageUrl: 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=2070'
  },
  { 
    id: 'rs3', 
    title: '탐정 및 인력관리', 
    description: '전문 탐정 서비스 상담 및 효율적인 인력 배치/관리 솔루션 접수', 
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    imageUrl: 'https://images.unsplash.com/photo-1563198804-b14316d3e811?auto=format&fit=crop&q=80&w=1974'
  },
  { 
    id: 'rs4', 
    title: '기획·취재 제보전화', 
    description: '천안 지역 내 억울한 사연이나 사건 사고에 대한 신속한 제보', 
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
    imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=2070'
  }
];

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  { 
    id: 'ap1', 
    name: '천안 특산물 프리미엄 세트', 
    description: '지역 농가 협업 최상급 특산물 구성', 
    price: '45,000원', 
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800', 
    affiliateUrl: '#', 
    tag: '지역상생' 
  },
  { 
    id: 'ap2', 
    name: '천안 흥타령 명품 쌀 (10kg)', 
    description: '천안의 기름진 토양에서 자란 최고급 품종', 
    price: '38,000원', 
    imageUrl: 'https://images.unsplash.com/photo-1586201327693-86629f7bbec1?auto=format&fit=crop&q=80&w=800', 
    affiliateUrl: '#', 
    tag: '신선특산물' 
  }
];

export const GOODS_ITEMS: GoodsItem[] = [
  { 
    id: 'g1', 
    name: '상균아놀자tv 시그니처 머그', 
    description: '세상 사는 따뜻한 이야기를 담은 고품질 세라믹 머그컵입니다.',
    price: '15,000원', 
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', 
    isNew: true 
  },
  { 
    id: 'g2', 
    name: 'AI천안뉴스 기자단 다이어리', 
    description: '천안의 어제와 오늘을 기록하기 위한 프리미엄 기획 다이어리입니다.',
    price: '22,000원', 
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800', 
    isNew: true 
  },
  { 
    id: 'g3', 
    name: '천안의 숨결 시그니처 캔들', 
    description: '천안의 숲과 바람의 향을 담아 힐링을 선사하는 핸드메이드 소이 캔들입니다.',
    price: '18,000원', 
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', 
    isNew: true 
  },
  { 
    id: 'g4', 
    name: '프리미엄 린넨 에코백', 
    description: '환경을 생각하는 마음으로 제작된 튼튼하고 스타일리시한 린넨 소재 에코백입니다.',
    price: '12,000원', 
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', 
    isNew: false 
  },
  { 
    id: 'g5', 
    name: '천안 여행 기록 포토북', 
    description: '천안의 아름다운 명소 100곳을 담은 한정판 하드커버 포토북입니다.',
    price: '35,000원', 
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', 
    isNew: false 
  }
];

export const INITIAL_ADS: AdContent[] = [
  { 
    id: 'ad-top-left', 
    slot: 'top_left', 
    title: '광고 슬롯 문의(좌)', 
    subtitle: '010-3425-0755', 
    link: 'tel:010-3425-0755', 
    mediaType: 'image', 
    mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1974',
    actionType: 'link',
    opacity: 100
  }
];
