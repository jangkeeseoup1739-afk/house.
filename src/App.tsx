import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingConsultation from './components/FloatingConsultation';
import ListingFilter from './components/ListingFilter';
import ListingCard from './components/ListingCard';
import ListingDetailModal from './components/ListingDetailModal';
import ArticleCard from './components/ArticleCard';
import ArticleDetailModal from './components/ArticleDetailModal';
import CalculatorModal from './components/CalculatorModal';
import ConsultationModal from './components/ConsultationModal';
import NotificationModal from './components/NotificationModal';
import AdminPanel from './components/AdminPanel';
import AdminAuthModal from './components/AdminAuthModal';
import Logo from './components/Logo';
import { playInquiryChime, showDesktopNotification } from './utils/audioAlert';
import {
  PropertyListing,
  ArticleContent,
  RealEstateNews,
  NotificationItem,
  ConsultationInquiry,
  FilterState,
  FilterConfig,
  InfoCategory
} from './types';
import {
  loadListings,
  saveListings,
  loadArticles,
  saveArticles,
  loadNews,
  saveNews,
  loadNotifications,
  saveNotifications,
  loadFilterConfig,
  saveFilterConfig,
  loadInquiries,
  saveInquiries,
  resetAllData
} from './utils/storage';
import { 
  Building2, PhoneCall, Calculator, Search, CheckCircle2, 
  HelpCircle, ArrowRight, ShieldCheck, Newspaper, Sparkles, TrendingUp,
  RefreshCw, ExternalLink, Bell, X
} from 'lucide-react';
import { CURRENT_YEAR, YEAR_STR } from './utils/date';

export default function App() {
  // --- Persistent State ---
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [articles, setArticles] = useState<ArticleContent[]>([]);
  const [news, setNews] = useState<RealEstateNews[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    regions: ['전체'],
    propertyTypes: ['전체'],
    pyeongOptions: ['전체'],
    priceOptions: ['전체'],
    statusOptions: ['전체']
  });
  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>([]);
  const [newInquiryAlarm, setNewInquiryAlarm] = useState<ConsultationInquiry | null>(null);
  const knownInquiryIdsRef = useRef<Set<string>>(new Set());
  const isFirstInquiryCheckRef = useRef<boolean>(true);

  // Auto real-time status & fetching state
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [isSyncingArticles, setIsSyncingArticles] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Fetch real-time AI news from server
  const fetchServerNews = useCallback(async () => {
    try {
      setIsSyncingNews(true);
      const res = await fetch('/api/news/realtime');
      if (res.ok) {
        const data = await res.json();
        if (data.news && Array.isArray(data.news) && data.news.length > 0) {
          setNews(data.news);
          saveNews(data.news);
        }
      }
    } catch (err) {
      console.warn('Silent news fetch fallback:', err);
    } finally {
      setIsSyncingNews(false);
    }
  }, []);

  // Fetch real-time AI articles from server
  const fetchServerArticles = useCallback(async () => {
    try {
      setIsSyncingArticles(true);
      const res = await fetch('/api/articles/realtime');
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          saveArticles(data.articles);
        }
      }
    } catch (err) {
      console.warn('Silent articles fetch fallback:', err);
    } finally {
      setIsSyncingArticles(false);
    }
  }, []);

  // Fetch real-time presale listings from server
  const fetchServerListings = useCallback(async () => {
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        if (data.listings && Array.isArray(data.listings) && data.listings.length > 0) {
          setListings(data.listings);
          saveListings(data.listings);
        }
      }
    } catch (err) {
      console.warn('Silent listings fetch fallback:', err);
    }
  }, []);

  // Fetch inquiries from server with Real-time Alarm & Audio chime detection
  const fetchServerInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/consultation/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries && Array.isArray(data.inquiries)) {
          // If not first check on initial load, detect brand new pending inquiries
          if (!isFirstInquiryCheckRef.current) {
            const newlyArrived = data.inquiries.filter(
              (inq: ConsultationInquiry) =>
                inq.status === '접수대기' && !knownInquiryIdsRef.current.has(inq.id)
            );
            if (newlyArrived.length > 0) {
              // Sound the audio chime ("띵~동! 🔔") and trigger desktop notification
              playInquiryChime();
              showDesktopNotification(
                '🔔 [신규 고객 상담 도착!]',
                `${newlyArrived[0].name} (${newlyArrived[0].phone}) - ${newlyArrived[0].category} / ${newlyArrived[0].interestRegion}`
              );
              setNewInquiryAlarm(newlyArrived[0]);
              showToast(`🔔 [신규 고객 상담 도착!] ${newlyArrived[0].name} (${newlyArrived[0].phone})`);
            }
          }

          knownInquiryIdsRef.current = new Set(data.inquiries.map((i: ConsultationInquiry) => i.id));
          isFirstInquiryCheckRef.current = false;
          setInquiries(data.inquiries);
          saveInquiries(data.inquiries);
        }
      }
    } catch (e) {
      console.warn('Silent inquiries fetch error:', e);
    }
  }, []);

  // Load initial local data & fetch real-time updates
  useEffect(() => {
    setListings(loadListings());
    setArticles(loadArticles());
    setNews(loadNews());
    setNotifications(loadNotifications());
    setFilterConfig(loadFilterConfig());
    setInquiries(loadInquiries());

    // Auto-sync daily automated updates from server
    fetchServerNews();
    fetchServerArticles();
    fetchServerListings();
    fetchServerInquiries();

    // Auto-poll inquiries every 4 seconds for live real-time chime alarm
    const inquiryAlarmInterval = setInterval(() => {
      fetchServerInquiries();
    }, 4000);

    return () => clearInterval(inquiryAlarmInterval);
  }, [fetchServerNews, fetchServerArticles, fetchServerListings, fetchServerInquiries]);

  // Save changes to localStorage and sync to server
  const updateListings = (newListings: PropertyListing[]) => {
    setListings(newListings);
    saveListings(newListings);
    fetch('/api/listings/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listings: newListings })
    }).catch((e) => console.warn('Server listing sync error:', e));
  };

  const updateArticles = (newArticles: ArticleContent[]) => {
    setArticles(newArticles);
    saveArticles(newArticles);
  };

  const updateNews = (newNews: RealEstateNews[]) => {
    setNews(newNews);
    saveNews(newNews);
  };

  const updateFilterConfig = (newConfig: FilterConfig) => {
    setFilterConfig(newConfig);
    saveFilterConfig(newConfig);
  };

  const updateInquiries = (newInquiries: ConsultationInquiry[]) => {
    setInquiries(newInquiries);
    saveInquiries(newInquiries);
  };

  const handleResetData = () => {
    resetAllData();
    setListings(loadListings());
    setArticles(loadArticles());
    setNews(loadNews());
    setNotifications(loadNotifications());
    setFilterConfig(loadFilterConfig());
    setInquiries(loadInquiries());
  };

  // --- Navigation & Filter State ---
  const [currentTab, setCurrentTab] = useState<'home' | 'info' | 'presale' | 'news' | 'consultation'>('home');
  const [selectedInfoCategory, setSelectedInfoCategory] = useState<InfoCategory>('전체');

  const [filter, setFilter] = useState<FilterState>({
    keyword: '',
    propertyType: '전체',
    region: '전체',
    pyeongGroup: '전체',
    priceGroup: '전체',
    status: '전체'
  });

  // --- Modals State ---
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleContent | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorInitialTab, setCalculatorInitialTab] = useState<'tax' | 'brokerage'>('tax');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [consultationPreload, setConsultationPreload] = useState<{ title?: string; category?: string }>({});

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // Admin access control
  const handleOpenAdmin = () => {
    const isAuth = sessionStorage.getItem('re_admin_auth') === 'true';
    if (isAuth) {
      setIsAdminOpen(true);
      fetchServerInquiries();
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    sessionStorage.setItem('re_admin_auth', 'true');
    setIsAdminAuthOpen(false);
    setIsAdminOpen(true);
    fetchServerInquiries();
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('re_admin_auth');
    setIsAdminOpen(false);
    showToast('관리자 세션이 안전하게 종료(잠금)되었습니다.');
  };

  // --- Handle Consultation Submit ---
  const handleConsultationSubmit = async (inquiryData: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: ConsultationInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: '접수대기',
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Safely persist to server database
    try {
      await fetch('/api/consultation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      });
    } catch (err) {
      console.warn('Failed to send consultation to server:', err);
    }

    const updated = [newInquiry, ...inquiries];
    updateInquiries(updated);
    knownInquiryIdsRef.current.add(newInquiry.id);
    playInquiryChime();
    showDesktopNotification(
      '🔔 [신규 고객 상담 접수!]',
      `${newInquiry.name} (${newInquiry.phone}) - ${newInquiry.category} / ${newInquiry.interestRegion}`
    );
    setNewInquiryAlarm(newInquiry);
    showToast('🔔 상담 및 관심고객 접수가 완료되었습니다! (알람음 발생)');
  };

  // --- Handle Custom Alert Subscription ---
  const handleSubscribeAlert = async (
    phoneOrPref: string | { phone: string; preferredRegion?: string; preferredCategory?: string; memo?: string },
    regionArg?: string
  ) => {
    let phone = '';
    let region = '서울/수도권 전체';
    let category = '신규분양';
    let memo = '';

    if (typeof phoneOrPref === 'string') {
      phone = phoneOrPref;
      if (regionArg) region = regionArg;
    } else {
      phone = phoneOrPref.phone;
      if (phoneOrPref.preferredRegion) region = phoneOrPref.preferredRegion;
      if (phoneOrPref.preferredCategory) category = phoneOrPref.preferredCategory;
      if (phoneOrPref.memo) memo = phoneOrPref.memo;
    }

    const alertInquiry: ConsultationInquiry = {
      id: `alert-${Date.now()}`,
      name: 'VIP 맞춤알림 신청자',
      phone: phone,
      category,
      interestRegion: region,
      preferredTime: '새 분양 알림 발생 즉시',
      message: `[VIP 맞춤알림 구독신청] 희망지역: ${region} / 분야: ${category}${memo ? ` / 특이사항: ${memo}` : ''}`,
      status: '접수대기',
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Safely persist to server database
    try {
      await fetch('/api/consultation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertInquiry)
      });
    } catch (err) {
      console.warn('Failed to send VIP alert to server:', err);
    }

    const updated = [alertInquiry, ...inquiries];
    updateInquiries(updated);
    knownInquiryIdsRef.current.add(alertInquiry.id);
    playInquiryChime();
    showDesktopNotification(
      '🔔 [VIP 맞춤알림 구독 접수!]',
      `${alertInquiry.name} (${alertInquiry.phone}) - ${alertInquiry.interestRegion}`
    );
    setNewInquiryAlarm(alertInquiry);
    showToast('🔔 VIP 맞춤알림 등록이 완료되었습니다! (알람음 발생)');
  };

  // --- Notification Unread Counter ---
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const handleMarkNotificationsAsRead = () => {
    const readAll = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(readAll);
    saveNotifications(readAll);
  };

  const handleRemoveNotification = (id: string) => {
    const filtered = notifications.filter((n) => n.id !== id);
    setNotifications(filtered);
    saveNotifications(filtered);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  // --- Filtered Listings Computation ---
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (filter.region !== '전체' && item.region !== filter.region) return false;
      if (filter.propertyType !== '전체' && item.propertyType !== filter.propertyType) return false;
      if (filter.pyeongGroup !== '전체' && item.pyeongGroup !== filter.pyeongGroup) return false;
      if (filter.priceGroup !== '전체' && item.priceGroup !== filter.priceGroup) return false;
      if (filter.status !== '전체' && item.status !== filter.status) return false;

      if (filter.keyword.trim() !== '') {
        const keyword = filter.keyword.trim().toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(keyword);
        const matchLocation = (item.address || '').toLowerCase().includes(keyword);
        const matchDeveloper = (item.constructorCompany || '').toLowerCase().includes(keyword);
        const matchDesc = item.description.toLowerCase().includes(keyword);
        const matchTags = (item.highlights || []).some((t) => t.toLowerCase().includes(keyword));
        if (!matchTitle && !matchLocation && !matchDeveloper && !matchDesc && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [listings, filter]);

  // --- Filtered Articles Computation ---
  const filteredArticles = useMemo(() => {
    if (selectedInfoCategory === '전체') return articles;
    return articles.filter((a) => a.category === selectedInfoCategory);
  }, [articles, selectedInfoCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-[9999] bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-sm animate-in slide-in-from-top-5 duration-300">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedInfoCategory={selectedInfoCategory}
        onSelectInfoCategory={(cat) => setSelectedInfoCategory(cat)}
        unreadNotificationCount={unreadNotificationCount}
        pendingInquiriesCount={inquiries.filter((i) => i.status === '접수대기').length}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenConsultation={() => {
          setConsultationPreload({ category: '청약' });
          setIsConsultationModalOpen(true);
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Body Switcher */}
      <main className="flex-1">
        {/* ===================== VIEW 1: HOME ===================== */}
        {currentTab === 'home' && (
          <div className="space-y-12 sm:space-y-16 pb-12">
            {/* 1. Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 sm:pt-12 pb-12 sm:pb-20 px-3.5 sm:px-8">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
              
              <div className="max-w-5xl lg:max-w-6xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
                {/* Top Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-bold shadow-sm backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{CURRENT_YEAR} 부동산 금융 규제 완화 & 수도권 신규 분양 오픈</span>
                </div>

                {/* White Framed Logo Box */}
                <div className="w-full max-w-4xl lg:max-w-5xl mx-auto bg-white text-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 lg:p-16 border border-slate-100 shadow-2xl shadow-slate-950/40 relative overflow-hidden transition-all duration-300">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
                  <Logo variant="full" size="hero" theme="light" className="w-full relative z-10" />
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
                  부동산 정보부터 신규 분양까지<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                    한눈에 비교하고 바로 상담받으세요
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed px-1">
                  {CURRENT_YEAR}년 청약 1순위 인정액 개편, 사업자 시설·운전자금 한도 심사 기준, 아파트·오피스텔 취득세 계산 및 수도권 랜드마크 분양정보를 실시간 제공합니다.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl p-1.5 sm:p-2 shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-slate-900">
                  <div className="flex items-center gap-2.5 px-3 flex-1 w-full min-h-[44px]">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="지역명(동탄, 강남 등) 또는 단지명을 검색해보세요"
                      value={filter.keyword}
                      onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setCurrentTab('presale');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="w-full py-2 text-xs sm:text-sm focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('presale');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <span>매물 검색</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Two Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs">
                  <a
                    href="tel:010-8873-7258"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-all shadow-lg hover:scale-105 min-h-[42px]"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>신속 상담 직통: 010-8873-7258</span>
                  </a>
                  <button
                    onClick={() => {
                      setCalculatorInitialTab('tax');
                      setIsCalculatorOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/20 min-h-[42px]"
                  >
                    <Calculator className="w-4 h-4 text-blue-400" />
                    <span>취득세 실시간 계산</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. 6 Category Shortcut Cards */}
            <section className="max-w-7xl mx-auto px-3.5 sm:px-8 -mt-6 sm:-mt-10 relative z-20">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                  {
                    name: '대출·금융',
                    desc: `${CURRENT_YEAR} 사업자대출 조건`,
                    cat: '대출·금융',
                    bg: 'bg-blue-50/90 hover:bg-blue-100/90 border-blue-200 text-blue-950',
                    badge: 'bg-blue-600 text-white',
                    descColor: 'text-blue-700'
                  },
                  {
                    name: '청약',
                    desc: '1순위 조건·통장 가입',
                    cat: '청약',
                    bg: 'bg-indigo-50/90 hover:bg-indigo-100/90 border-indigo-200 text-indigo-950',
                    badge: 'bg-indigo-600 text-white',
                    descColor: 'text-indigo-700'
                  },
                  {
                    name: '세금',
                    desc: '아파트·오피스텔 취득세',
                    cat: '세금',
                    bg: 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-200 text-amber-950',
                    badge: 'bg-amber-600 text-white',
                    descColor: 'text-amber-800'
                  },
                  {
                    name: '부동산 상식',
                    desc: '중개보수·계약금 플로우',
                    cat: '부동산 상식',
                    bg: 'bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200 text-emerald-950',
                    badge: 'bg-emerald-600 text-white',
                    descColor: 'text-emerald-700'
                  },
                  {
                    name: '오피스텔',
                    desc: '주택수 포함 여부 총정리',
                    cat: '오피스텔',
                    bg: 'bg-sky-50/90 hover:bg-sky-100/90 border-sky-200 text-sky-950',
                    badge: 'bg-sky-600 text-white',
                    descColor: 'text-sky-700'
                  },
                  {
                    name: '지식산업센터',
                    desc: '세제감면·시설자금 80%',
                    cat: '지식산업센터',
                    bg: 'bg-violet-50/90 hover:bg-violet-100/90 border-violet-200 text-violet-950',
                    badge: 'bg-violet-600 text-white',
                    descColor: 'text-violet-700'
                  }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedInfoCategory(item.cat as InfoCategory);
                      setCurrentTab('info');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border-2 ${item.bg} shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-left flex flex-col justify-between min-h-[96px] sm:min-h-[110px] group cursor-pointer`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm sm:text-base font-extrabold tracking-tight">{item.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badge}`}>바로가기</span>
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold mt-2 line-clamp-1 ${item.descColor}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Essential Guides Section */}
            <section className="max-w-7xl mx-auto px-3.5 sm:px-8 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3 sm:pb-4">
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">Essential Guides</div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {CURRENT_YEAR} 부동산 핵심 정보 & 실전 가이드
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedInfoCategory('전체');
                    setCurrentTab('info');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs sm:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>가이드 전체보기 ({articles.length}건)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {articles.slice(0, 6).map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={(a) => setSelectedArticle(a)}
                  />
                ))}
              </div>
            </section>

            {/* 4. New Presale Listings Section */}
            <section className="max-w-7xl mx-auto px-3.5 sm:px-8 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3 sm:pb-4">
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">New Presale Listings</div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">신규 분양정보 추천 매물</h2>
                </div>
                <button
                  onClick={() => {
                    setCurrentTab('presale');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs sm:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>정밀 필터 매물 검색 바로가기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {listings.slice(0, 3).map((item) => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    onSelect={(l: PropertyListing) => setSelectedListing(l)}
                    onQuickInquire={(l: PropertyListing) => {
                      setConsultationPreload({ title: l.title, category: '신규분양' });
                      setIsConsultationModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </section>

            {/* 5. Real Estate Tax & Fee Banner */}
            <section className="max-w-7xl mx-auto px-3.5 sm:px-8">
              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                <div className="space-y-2 sm:space-y-3 text-center lg:text-left">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {CURRENT_YEAR} 최신 세법 반영
                  </span>
                  <h3 className="text-xl sm:text-3xl font-extrabold leading-snug">
                    아파트·오피스텔 취득세와<br className="hidden sm:inline" />
                    부동산 중개수수료를 3초 만에 산출하세요
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                    생애최초 200만원 감면, 다주택자 중과세율, 85㎡ 초과 농특세 및 매매·전세·월세별 법정 상한 복비까지 정확하게 계산해드립니다.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setCalculatorInitialTab('tax');
                      setIsCalculatorOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md min-h-[44px]"
                  >
                    취득세 계산기 실행
                  </button>
                  <button
                    onClick={() => {
                      setCalculatorInitialTab('brokerage');
                      setIsCalculatorOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all min-h-[44px]"
                  >
                    중개수수료 계산기
                  </button>
                </div>
              </div>
            </section>

            {/* 6. Real Estate News Section */}
            <section className="max-w-7xl mx-auto px-3.5 sm:px-8 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">실시간 부동산 뉴스 & 시장 브리핑</h2>
                </div>
                <button
                  onClick={() => {
                    setCurrentTab('news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs sm:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>뉴스 전체보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {news.slice(0, 4).map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-blue-600">{item.publisher}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.date}</span>
                      <span className="font-medium text-blue-500 group-hover:underline">기사 보기</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===================== VIEW 2: INFO / GUIDE ===================== */}
        {currentTab === 'info' && (
          <div className="max-w-7xl mx-auto px-3.5 sm:px-8 py-8 sm:py-12 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>체계적인 부동산·금융 필수 지식</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                부동산 정보 및 금융 칼럼
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                복잡한 청약 가점 계산, 무주택 조건, 사업자 시설·운전자금 조달법, 취득세·양도세 절세 전략까지 
                검증된 실전 노하우를 제공합니다.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
              {(['전체', '부동산 상식', '청약', '대출·금융', '세금', '오피스텔', '지식산업센터'] as InfoCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedInfoCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                      selectedInfoCategory === cat
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSelect={(a: ArticleContent) => setSelectedArticle(a)}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">해당 카테고리의 가이드가 아직 없습니다.</h4>
                <p className="text-xs text-slate-500 mt-1">곧 새로운 실전 분석 가이드가 업데이트될 예정입니다.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== VIEW 3: PRESALE LISTINGS ===================== */}
        {currentTab === 'presale' && (
          <div className="max-w-7xl mx-auto px-3.5 sm:px-8 py-8 sm:py-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>실시간 전국 신규 분양정보</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  신규 분양 프로젝트 검색
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                  지역, 주택 유형, 평형, 분양가, 공급방식에 맞게 정교하게 필터링하여 원하는 분양 건을 즉시 확인하세요.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCalculatorOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>자금 조달 계산기</span>
                </button>
              </div>
            </div>

            {/* Filter Bar Component */}
            <ListingFilter
              filter={filter}
              onChange={setFilter}
              config={filterConfig}
              onUpdateConfig={updateFilterConfig}
              totalCount={filteredListings.length}
            />

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={(l: PropertyListing) => setSelectedListing(l)}
                  onQuickInquire={(l: PropertyListing) => {
                    setConsultationPreload({ title: l.title, category: '청약' });
                    setIsConsultationModalOpen(true);
                  }}
                />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">검색 조건에 맞는 분양 매물이 없습니다.</h3>
                <p className="text-sm text-slate-500 mt-1">
                  선택하신 필터 조건을 재설정하거나 다른 검색어를 입력해 보세요.
                </p>
                <button
                  onClick={() => {
                    setFilter({
                      keyword: '',
                      propertyType: '전체',
                      region: '전체',
                      pyeongGroup: '전체',
                      priceGroup: '전체',
                      status: '전체'
                    });
                  }}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================== VIEW 4: NEWS ROOM ===================== */}
        {currentTab === 'news' && (
          <div className="max-w-7xl mx-auto px-3.5 sm:px-8 py-8 sm:py-12 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                  <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
                  <span>실시간 데일리 브리핑</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  부동산 & 금융 실시간 뉴스룸
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                  국토교통부 주요 고시, 한국은행 기준금리, 시중은행 대출 규제, 청약 홈 속보를 가장 빠르게 전달합니다.
                </p>
              </div>

              <button
                onClick={fetchServerNews}
                disabled={isSyncingNews}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingNews ? 'animate-spin' : ''}`} />
                <span>{isSyncingNews ? '뉴스 수집 중...' : '최신 뉴스 업데이트'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-blue-700">{item.publisher}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-200">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 hover:text-blue-600 transition-colors leading-snug">
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.readTime || '3분 소요'}</span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>기사 원문</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== VIEW 5: CONSULTATION HUB ===================== */}
        {currentTab === 'consultation' && (
          <div className="max-w-4xl mx-auto px-3.5 sm:px-8 py-8 sm:py-12 space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>1:1 프리미엄 자산 & 분양 컨설팅</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                전문가 상담 및 관심고객 접수
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                궁금하신 분양 건, 대출 조달 자금 분석, 세무 상담 내용을 남겨주시면 
                <strong> 하우스 앤 에셋</strong> 전문 상담위원이 신속하고 정확하게 안내해 드립니다.
              </p>
            </div>

            {/* Direct Phone Call Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700">
              <div>
                <div className="text-xs text-amber-300 font-semibold mb-1">빠른 전화 상담을 원하시나요?</div>
                <div className="text-xl sm:text-2xl font-black">대표 직통 무료 상담 전화</div>
                <div className="text-xs text-slate-400 mt-1">평일·주말 09:00 ~ 21:00 연중무휴 상담 지원</div>
              </div>

              <a
                href="tel:010-8873-7258"
                className="px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg flex items-center gap-2 shadow-lg transition-transform active:scale-[0.98] shrink-0"
              >
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <span>010-8873-7258</span>
              </a>
            </div>

            {/* In-page Full Consultation Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span>온라인 상담 접수 양식</span>
                <span className="text-xs font-normal text-slate-500">(접수 즉시 010-8873-7258 배정)</span>
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const name = formData.get('name') as string;
                  const phone = formData.get('phone') as string;
                  const category = formData.get('category') as any;
                  const interestRegion = formData.get('interestRegion') as string;
                  const preferredTime = formData.get('preferredTime') as string;
                  const message = formData.get('message') as string;

                  if (!phone) {
                    alert('연락처는 필수 입력 항목입니다.');
                    return;
                  }

                  handleConsultationSubmit({
                    name: name || '관심고객',
                    phone,
                    category,
                    interestRegion,
                    preferredTime,
                    message
                  });

                  form.reset();
                }}
                className="space-y-4 sm:space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      고객명 / 기업체명
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="예: 홍길동 또는 (주)에셋코리아"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      연락처 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="예: 010-1234-5678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      상담 분야
                    </label>
                    <select
                      name="category"
                      defaultValue="청약"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="청약">청약·분양</option>
                      <option value="대출·금융">대출·자금조달</option>
                      <option value="세금">세무·절세</option>
                      <option value="오피스텔">오피스텔</option>
                      <option value="지식산업센터">지식산업센터</option>
                      <option value="일반상담">기타 부동산 일반</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      관심 지역
                    </label>
                    <input
                      name="interestRegion"
                      type="text"
                      placeholder="예: 경기 평택, 동탄, 서울 강남 등"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      희망 상담 시간대
                    </label>
                    <select
                      name="preferredTime"
                      defaultValue="언제나 가능"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="언제나 가능">언제나 가능</option>
                      <option value="오전 (09:00 ~ 12:00)">오전 (09:00 ~ 12:00)</option>
                      <option value="오후 (12:00 ~ 15:00)">오후 (12:00 ~ 15:00)</option>
                      <option value="늦은오후 (15:00 ~ 18:00)">늦은오후 (15:00 ~ 18:00)</option>
                      <option value="야간/퇴근후 (18:00 ~ 21:00)">야간/퇴근후 (18:00 ~ 21:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    상담 문의 내용 및 세부 요청사항
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="관심 있으신 분양 단지명, 희망 평형대, 대출 필요 금액이나 사업자 현황을 남겨주시면 더욱 맞춤화된 전문 분석을 준비해 연락드립니다."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/20 transition-all active:scale-[0.99]"
                  >
                    전문가 상담 신청 완료하기
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2.5">
                    제출하신 개인정보는 1:1 상담 및 맞춤형 분양정보 제공 목적 외에는 사용되지 않습니다.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Floating Speed Actions (1:1 Consultation, Calculator, Call) */}
      <FloatingConsultation
        onOpenConsultation={() => {
          setConsultationPreload({ category: '일반상담' });
          setIsConsultationModalOpen(true);
        }}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        unreadCount={notifications.filter((n) => !n.isRead).length}
      />

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectInfoCategory={(cat) => setSelectedInfoCategory(cat)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ===================== MODALS ===================== */}

      {/* 1. Property Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onOpenConsultation={(l) => {
          setConsultationPreload({ title: l.title, category: '청약' });
          setIsConsultationModalOpen(true);
        }}
      />

      {/* 2. Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenConsultation={(category) => {
          setConsultationPreload({ category });
          setIsConsultationModalOpen(true);
        }}
      />

      {/* 3. Real Estate Financial Calculator Modal */}
      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        defaultTab={calculatorInitialTab}
      />

      {/* 4. Consultation & Customer Inquiry Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        initialPropertyTitle={consultationPreload.title}
        initialCategory={consultationPreload.category}
        onClose={() => setIsConsultationModalOpen(false)}
        onSubmit={handleConsultationSubmit}
      />

      {/* 5. Real-time Notification & VIP Alert Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        notifications={notifications}
        onClose={() => setIsNotificationModalOpen(false)}
        onMarkAsRead={(id: string) => {
          const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
          setNotifications(updated);
          saveNotifications(updated);
        }}
        onSelectTarget={(targetId, category) => {
          if (category === 'presale' || category === 'listing') {
            const found = listings.find((l) => l.id === targetId);
            if (found) setSelectedListing(found);
          } else if (category === 'article' || category === 'info') {
            const found = articles.find((a) => a.id === targetId);
            if (found) setSelectedArticle(found);
          }
        }}
        onSubscribeAlert={handleSubscribeAlert}
      />

      {/* 6. Admin CMS Modal */}
      {isAdminOpen && (
        <AdminPanel
          listings={listings}
          onUpdateListings={updateListings}
          articles={articles}
          onUpdateArticles={updateArticles}
          news={news}
          onUpdateNews={updateNews}
          filterConfig={filterConfig}
          onUpdateFilterConfig={updateFilterConfig}
          inquiries={inquiries}
          onUpdateInquiries={updateInquiries}
          onRefreshServerNews={fetchServerNews}
          onRefreshServerArticles={fetchServerArticles}
          onRefreshServerListings={fetchServerListings}
          onRefreshServerInquiries={fetchServerInquiries}
          onResetData={handleResetData}
          onLogout={handleAdminLogout}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* 7. Real-time Customer Inquiry Alarm Popup Banner */}
      {newInquiryAlarm && (
        <div className="fixed top-5 right-4 sm:top-6 sm:right-6 z-[99999] max-w-sm w-full bg-slate-900/98 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 animate-in slide-in-from-top-4 duration-300 ring-4 ring-amber-400/20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span>신규 고객 상담 접수! (띵-동 🔔)</span>
            </div>
            <button
              onClick={() => setNewInquiryAlarm(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2.5 text-xs space-y-1.5 text-slate-200 bg-slate-800/90 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px]">고객 성함: </span>
                <strong className="text-white text-sm font-black">{newInquiryAlarm.name}</strong>
              </div>
              <a
                href={`tel:${newInquiryAlarm.phone}`}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                title="고객에게 직통 전화 걸기"
              >
                <PhoneCall className="w-3 h-3" />
                <span>바로통화</span>
              </a>
            </div>
            <p><strong>연락처:</strong> <a href={`tel:${newInquiryAlarm.phone}`} className="text-amber-300 font-bold underline">{newInquiryAlarm.phone}</a></p>
            <p><strong>상담분야:</strong> <span className="text-blue-300">{newInquiryAlarm.category}</span> / <strong>희망지역:</strong> {newInquiryAlarm.interestRegion}</p>
            {newInquiryAlarm.message && (
              <p className="text-slate-300 line-clamp-2 bg-black/30 p-1.5 rounded-lg text-[11px]"><strong>문의:</strong> {newInquiryAlarm.message}</p>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                setNewInquiryAlarm(null);
                handleOpenAdmin();
              }}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs text-center transition-all shadow-md"
            >
              관리자 모드에서 즉시 확인
            </button>
            <button
              onClick={() => playInquiryChime()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700 flex items-center gap-1"
              title="알람음(띵동) 다시 듣기"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>소리</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. Admin Security Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />
    </div>
  );
}
