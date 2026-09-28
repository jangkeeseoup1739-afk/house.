export type PropertyType = '전체' | '아파트' | '오피스텔' | '지식산업센터' | '상가/업무';
export type PresaleStatus = '전체' | '분양예정' | '분양중' | '마감임박' | '분양완료';

export interface PropertyListing {
  id: string;
  title: string;
  subtitle: string;
  propertyType: '아파트' | '오피스텔' | '지식산업센터' | '상가/업무';
  region: string; // e.g. '서울 강남', '경기 화성/동탄', '인천 송도'
  regionCategory: string; // e.g. '서울', '경기', '인천', '지방'
  pyeong: number; // e.g. 34
  pyeongGroup: '20평 이하' | '20~30평' | '30~40평' | '40평 이상';
  price: number; // in 억 원, e.g. 5.8
  priceDisplay: string; // e.g. "5억 8,000만원"
  priceGroup: '3억 이하' | '3억~6억' | '6억~10억' | '10억 이상';
  status: '분양예정' | '분양중' | '마감임박' | '분양완료';
  totalHouseholds: string; // e.g. "1,420세대"
  moveInDate: string; // e.g. "2027.06"
  constructorCompany: string; // e.g. "현대건설"
  address: string;
  imageUrl: string;
  highlights: string[];
  description: string;
  floorPlanTypes: string[];
  contactPhone: string;
  isHot?: boolean;
  createdAt: string;
}

export type InfoCategory = '전체' | '부동산 상식' | '청약' | '대출·금융' | '세금' | '오피스텔' | '지식산업센터';

export interface ArticleContent {
  id: string;
  category: '부동산 상식' | '청약' | '대출·금융' | '세금' | '오피스텔' | '지식산업센터';
  subCategory?: string;
  title: string;
  summary: string;
  sections: {
    heading: string;
    body: string;
    points?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    callout?: string;
  }[];
  tags: string[];
  author: string;
  date: string;
  views: number;
  featured?: boolean;
}

export interface ConsultationInquiry {
  id: string;
  name: string;
  phone: string;
  category: string;
  interestRegion: string;
  propertyId?: string;
  preferredTime: string;
  message: string;
  status: '접수대기' | '상담진행중' | '상담완료';
  adminMemo?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: '분양' | '대출/금융' | '청약' | '공지';
  date: string;
  isRead: boolean;
  targetId?: string;
}

export interface RealEstateNews {
  id: string;
  title: string;
  publisher: string;
  date: string;
  summary: string;
  category: string;
  badge?: string;
  readTime: string;
  link?: string;
  source?: 'rss' | 'ai' | 'manual';
}

export interface FilterState {
  keyword: string;
  propertyType: string;
  region: string;
  pyeongGroup: string;
  priceGroup: string;
  status: string;
}

export interface FilterConfig {
  regions: string[];
  propertyTypes: string[];
  pyeongOptions: string[];
  priceOptions: string[];
  statusOptions: string[];
}
