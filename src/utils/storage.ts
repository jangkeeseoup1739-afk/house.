import { PropertyListing, ArticleContent, RealEstateNews, NotificationItem, ConsultationInquiry, FilterConfig } from '../types';
import { INITIAL_LISTINGS, INITIAL_ARTICLES, INITIAL_NEWS, INITIAL_NOTIFICATIONS, INITIAL_FILTER_CONFIG } from '../data/initialData';

const STORAGE_KEYS = {
  LISTINGS: 're_platform_listings_v1',
  ARTICLES: 're_platform_articles_v1',
  NEWS: 're_platform_news_v1',
  NOTIFICATIONS: 're_platform_notifications_v1',
  FILTER_CONFIG: 're_platform_filter_config_v1',
  INQUIRIES: 're_platform_inquiries_v1',
  ALERT_SUBSCRIPTION: 're_platform_subscription_v1'
};

export function loadListings(): PropertyListing[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load listings', e);
  }
  return INITIAL_LISTINGS;
}

export function saveListings(listings: PropertyListing[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  } catch (e) {
    console.error('Failed to save listings', e);
  }
}

export function loadArticles(): ArticleContent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load articles', e);
  }
  return INITIAL_ARTICLES;
}

export function saveArticles(articles: ArticleContent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to save articles', e);
  }
}

export function loadNews(): RealEstateNews[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load news', e);
  }
  return INITIAL_NEWS;
}

export function saveNews(news: RealEstateNews[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  } catch (e) {
    console.error('Failed to save news', e);
  }
}

export function loadNotifications(): NotificationItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load notifications', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(notifications: NotificationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function loadFilterConfig(): FilterConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FILTER_CONFIG);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load filter config', e);
  }
  return INITIAL_FILTER_CONFIG;
}

export function saveFilterConfig(config: FilterConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FILTER_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save filter config', e);
  }
}

export function loadInquiries(): ConsultationInquiry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load inquiries', e);
  }
  return [
    {
      id: 'inq-sample-1',
      name: '김태진',
      phone: '010-4521-8902',
      category: '신규분양',
      interestRegion: '경기 동탄/화성',
      propertyId: 'prop-1',
      preferredTime: '오후 2시 ~ 4시',
      message: '동탄 레이크 센트럴자이 84㎡A 분양가 및 계약금 납부 일정 상세 상담 요청합니다.',
      status: '접수대기',
      createdAt: '2026-09-21 14:30'
    },
    {
      id: 'inq-sample-2',
      name: '이수경 대표',
      phone: '010-9988-1234',
      category: '사업자대출',
      interestRegion: '경기 평택/고덕',
      preferredTime: '오전 10시 ~ 12시',
      message: '평택 고덕 에이스 지산 실입주 기업 시설자금대출 80% 가능 여부와 2026년 세제감면 조건 확인 희망합니다.',
      status: '상담진행중',
      adminMemo: '1차 통화 완료, 사업자등록증 확인 후 2금융 시설자금 연계 안내 예정',
      createdAt: '2026-09-20 11:15'
    }
  ];
}

export function saveInquiries(inquiries: ConsultationInquiry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save inquiries', e);
  }
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.LISTINGS);
  localStorage.removeItem(STORAGE_KEYS.ARTICLES);
  localStorage.removeItem(STORAGE_KEYS.NEWS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.FILTER_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
}
