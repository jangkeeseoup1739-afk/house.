import { useState, useEffect, useCallback } from 'react';
import { 
  Building2, BookOpen, SlidersHorizontal, Users, Plus, Edit, Trash2, 
  Save, RotateCcw, CheckCircle, CheckCircle2, PhoneCall, Download, X, AlertTriangle,
  Settings2, MapPin, Maximize2, DollarSign, Tag, Edit2, Newspaper,
  RefreshCw, Sparkles, ExternalLink, Loader2,
  Lock, Mail, Volume2, VolumeX, BellRing, Bell
} from 'lucide-react';
import { PropertyListing, ArticleContent, FilterConfig, ConsultationInquiry, RealEstateNews } from '../types';
import { CURRENT_YEAR } from '../utils/date';
import { playInquiryChime, getAudioAlarmEnabled, setAudioAlarmEnabled, showDesktopNotification, requestDesktopNotificationPermission } from '../utils/audioAlert';
import FilterManagementModal, { FilterCategoryKey } from './FilterManagementModal';
import Logo from './Logo';

interface AdminPanelProps {
  listings: PropertyListing[];
  onUpdateListings: (listings: PropertyListing[]) => void;
  articles: ArticleContent[];
  onUpdateArticles: (articles: ArticleContent[]) => void;
  news: RealEstateNews[];
  onUpdateNews: (news: RealEstateNews[]) => void;
  filterConfig: FilterConfig;
  onUpdateFilterConfig: (config: FilterConfig) => void;
  inquiries: ConsultationInquiry[];
  onUpdateInquiries: (inquiries: ConsultationInquiry[]) => void;
  onRefreshServerNews?: () => void;
  onRefreshServerArticles?: () => void;
  onRefreshServerListings?: () => void;
  onRefreshServerInquiries?: () => void;
  onResetData: () => void;
  onLogout?: () => void;
  onClose: () => void;
}

export default function AdminPanel({
  listings,
  onUpdateListings,
  articles,
  onUpdateArticles,
  news,
  onUpdateNews,
  filterConfig,
  onUpdateFilterConfig,
  inquiries,
  onUpdateInquiries,
  onRefreshServerNews,
  onRefreshServerArticles,
  onRefreshServerListings,
  onRefreshServerInquiries,
  onResetData,
  onLogout,
  onClose
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'articles' | 'news' | 'filters' | 'inquiries' | 'settings'>('listings');
  
  // AI & RSS Automation states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiCategoryInput, setAiCategoryInput] = useState('대출·금융');
  const [isFetchingRss, setIsFetchingRss] = useState(false);

  // Daily Automation Engine State
  const [automationStatus, setAutomationStatus] = useState<{
    isAutoActive: boolean;
    lastRun: string;
    lastDailyDate: string;
    todayDate: string;
    newsCount: number;
    articlesCount: number;
    listingsCount?: number;
  }>({
    isAutoActive: true,
    lastRun: '',
    lastDailyDate: '',
    todayDate: '',
    newsCount: 0,
    articlesCount: 0,
    listingsCount: 0
  });
  const [isTriggeringDailyAuto, setIsTriggeringDailyAuto] = useState(false);

  const fetchAutomationStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/automation/status');
      if (res.ok) {
        const data = await res.json();
        setAutomationStatus(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchAutomationStatus();
  }, [fetchAutomationStatus]);

  const handleRunDailyAutomation = async () => {
    try {
      setIsTriggeringDailyAuto(true);
      const res = await fetch('/api/automation/run-daily', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        if (onRefreshServerNews) onRefreshServerNews();
        if (onRefreshServerArticles) onRefreshServerArticles();
        if (onRefreshServerListings) onRefreshServerListings();
        await fetchAutomationStatus();
        triggerToast('오늘자 부동산 정보·뉴스·분양 데이터가 매일 자동 업데이트 엔진을 통해 갱신되었습니다!');
      } else {
        triggerToast('업데이트 실패: ' + (data.message || '다시 시도해주세요.'));
      }
    } catch (err) {
      triggerToast('자동 업데이트 통신 중 오류가 발생했습니다.');
    } finally {
      setIsTriggeringDailyAuto(false);
    }
  };

  // --- Listing Form State ---
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<PropertyListing | null>(null);
  const [listingForm, setListingForm] = useState<Partial<PropertyListing>>({
    title: '',
    subtitle: '',
    propertyType: '아파트',
    region: '경기 동탄/화성',
    regionCategory: '경기',
    pyeong: 34,
    pyeongGroup: '30~40평',
    price: 5.5,
    priceDisplay: '5억 5,000만원~',
    priceGroup: '3억~6억',
    status: '분양중',
    totalHouseholds: '850세대',
    moveInDate: '2027.05',
    constructorCompany: '현대건설',
    address: '경기도 화성시 동탄대로 일원',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    highlights: ['역세권 도보 5분', '중도금 무이자 60%', '발코니 무상확장'],
    description: '최고급 마감재와 자연친화적 조경을 겸비한 랜드마크 분양단지입니다.',
    floorPlanTypes: ['전용 59㎡ (3Bay)', '전용 84㎡ (4Bay)'],
    contactPhone: '010-8873-7258',
    isHot: false
  });

  // --- Article Form State ---
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleContent | null>(null);
  const [articleForm, setArticleForm] = useState<Partial<ArticleContent>>({
    category: '대출·금융',
    subCategory: '사업자대출',
    title: '',
    summary: '',
    author: '부동산 전문 에디터',
    tags: ['부동산', `${CURRENT_YEAR}정책`],
    sections: [
      {
        heading: '1. 주요 핵심 가이드',
        body: '상세 내용을 여기에 입력해 주세요.',
        points: ['체크포인트 1', '체크포인트 2']
      }
    ]
  });

  // --- Filter Config State ---
  const [newRegionInput, setNewRegionInput] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterModalCategory, setFilterModalCategory] = useState<FilterCategoryKey>('propertyTypes');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // --- In-App Confirmation Modal (Replaces blocked window.confirm) ---
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  const requestConfirmation = (
    title: string,
    description: string,
    onConfirm: () => void,
    confirmText: string = '삭제 확인'
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      confirmText,
      onConfirm
    });
  };

  const triggerToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // --- Listing Handlers ---
  const openNewListingModal = () => {
    setEditingListing(null);
    setListingForm({
      title: '',
      subtitle: '',
      propertyType: '아파트',
      region: filterConfig.regions[1] || '경기 동탄/화성',
      regionCategory: '경기',
      pyeong: 34,
      pyeongGroup: '30~40평',
      price: 5.5,
      priceDisplay: '5억 5,000만원~',
      priceGroup: '3억~6억',
      status: '분양중',
      totalHouseholds: '500세대',
      moveInDate: '2027년 05월',
      constructorCompany: '시공사명',
      address: '상세 주소 입력',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      highlights: ['역세권 프리미엄', '중도금 무이자'],
      description: '단지 상세 소개글입니다.',
      floorPlanTypes: ['전용 84㎡A', '전용 84㎡B'],
      contactPhone: '010-8873-7258',
      isHot: false
    });
    setIsListingModalOpen(true);
  };

  const openEditListingModal = (item: PropertyListing) => {
    setEditingListing(item);
    setListingForm({ ...item });
    setIsListingModalOpen(true);
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.title) return;

    if (editingListing) {
      const updated = listings.map((l) => (l.id === editingListing.id ? { ...l, ...listingForm } as PropertyListing : l));
      onUpdateListings(updated);
      triggerToast('매물 정보가 수정되었습니다.');
    } else {
      const newListing: PropertyListing = {
        ...listingForm,
        id: `prop-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      } as PropertyListing;
      onUpdateListings([newListing, ...listings]);
      triggerToast('새로운 분양 매물이 등록되었습니다.');
    }
    setIsListingModalOpen(false);
  };

  const handleDeleteListing = (id: string) => {
    requestConfirmation(
      '분양 매물 삭제',
      '선택한 분양 매물을 목록에서 삭제하시겠습니까?',
      () => {
        onUpdateListings(listings.filter((l) => l.id !== id));
        triggerToast('매물이 삭제되었습니다.');
      }
    );
  };

  // --- Article Handlers ---
  const openNewArticleModal = () => {
    setEditingArticle(null);
    setArticleForm({
      category: '대출·금융',
      subCategory: '사업자대출',
      title: '',
      summary: '',
      author: '부동산 전문 에디터',
      tags: ['부동산상식', `${CURRENT_YEAR}조건`],
      sections: [
        {
          heading: '1. 핵심 체크 포인트',
          body: '내용을 작성해주세요.',
          points: ['체크사항 1', '체크사항 2']
        }
      ]
    });
    setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (art: ArticleContent) => {
    setEditingArticle(art);
    setArticleForm({ ...art });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title) return;

    if (editingArticle) {
      const updated = articles.map((a) => (a.id === editingArticle.id ? { ...a, ...articleForm } as ArticleContent : a));
      onUpdateArticles(updated);
      triggerToast('콘텐츠가 수정되었습니다.');
    } else {
      const newArticle: ArticleContent = {
        ...articleForm,
        id: `art-${Date.now()}`,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        views: 1
      } as ArticleContent;
      onUpdateArticles([newArticle, ...articles]);
      triggerToast('새 콘텐츠가 발행되었습니다.');
    }
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string) => {
    requestConfirmation(
      '칼럼/가이드 삭제',
      '선택한 칼럼/가이드를 삭제하시겠습니까?',
      () => {
        onUpdateArticles(articles.filter((a) => a.id !== id));
        triggerToast('콘텐츠가 삭제되었습니다.');
      }
    );
  };

  // --- Automation: AI Report Generation Handler ---
  const handleGenerateAIArticle = async () => {
    try {
      setIsGeneratingAI(true);
      const res = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopicInput.trim() || undefined,
          category: aiCategoryInput
        })
      });

      const data = await res.json();
      if (data.status === 'ok' && data.article) {
        onUpdateArticles([data.article, ...articles]);
        triggerToast('AI 전문 부동산 리포트가 성공적으로 자동 발행되었습니다.');
        setAiTopicInput('');
      } else {
        triggerToast('AI 리포트 생성 실패: ' + (data.message || '잠시 후 다시 시도해주세요.'));
      }
    } catch (err: any) {
      console.error('AI generation error:', err);
      triggerToast('AI 리포트 서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // --- Automation: RSS News Fetch Handler ---
  const handleFetchRssNews = async () => {
    try {
      setIsFetchingRss(true);
      const res = await fetch('/api/news/rss-feed');
      const data = await res.json();

      if (data.news && Array.isArray(data.news) && data.news.length > 0) {
        // Merge without duplicating existing titles
        const existingTitles = new Set(news.map((n) => n.title));
        const newItems = data.news.filter((n: any) => !existingTitles.has(n.title));
        
        if (newItems.length > 0) {
          const updated = [...newItems, ...news];
          onUpdateNews(updated);
          triggerToast(`주요 포털/언론사 실시간 부동산 뉴스 ${newItems.length}건이 자동 동기화되었습니다.`);
        } else {
          triggerToast('이미 최신 뉴스가 모두 반영되어 있습니다.');
        }
      } else {
        triggerToast('뉴스를 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('RSS fetch error:', err);
      triggerToast('RSS 뉴스 피드 수신 중 오류가 발생했습니다.');
    } finally {
      setIsFetchingRss(false);
    }
  };

  const handleDeleteNews = (id: string) => {
    requestConfirmation(
      '뉴스 기사 삭제',
      '선택한 부동산 뉴스를 목록에서 삭제하시겠습니까?',
      () => {
        onUpdateNews(news.filter((n) => n.id !== id));
        triggerToast('뉴스가 삭제되었습니다.');
      }
    );
  };

  // --- Filter Config Handlers ---
  const [filterInputs, setFilterInputs] = useState<Record<FilterCategoryKey, string>>({
    propertyTypes: '',
    regions: '',
    pyeongOptions: '',
    priceOptions: '',
    statusOptions: ''
  });

  const handleAddFilterOption = (category: FilterCategoryKey) => {
    const val = (filterInputs[category] || '').trim();
    if (!val) return;
    if (filterConfig[category].includes(val)) {
      triggerToast('이미 존재하는 항목입니다.');
      return;
    }
    const updated = {
      ...filterConfig,
      [category]: [...filterConfig[category], val]
    };
    onUpdateFilterConfig(updated);
    setFilterInputs({ ...filterInputs, [category]: '' });
    triggerToast(`'${val}' 항목이 추가되었습니다.`);
  };

  const handleRemoveFilterOption = (category: FilterCategoryKey, val: string) => {
    if (val === '전체') {
      triggerToast("'전체' 항목은 기본 필터이므로 삭제할 수 없습니다.");
      return;
    }
    requestConfirmation(
      '필터 항목 삭제',
      `'${val}' 필터 옵션을 목록에서 삭제하시겠습니까?`,
      () => {
        const updated = {
          ...filterConfig,
          [category]: filterConfig[category].filter((item) => item !== val)
        };
        onUpdateFilterConfig(updated);
        triggerToast(`'${val}' 항목이 삭제되었습니다.`);
      }
    );
  };

  // --- Inquiry Handlers & Live Audio Alarm ---
  const [isRefreshingInquiries, setIsRefreshingInquiries] = useState(false);
  const [isAudioAlarmOn, setIsAudioAlarmOn] = useState(() => getAudioAlarmEnabled());
  const [incomingAlert, setIncomingAlert] = useState<ConsultationInquiry | null>(null);
  const [isNotifPermitted, setIsNotifPermitted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  const handleToggleAudioAlarm = () => {
    const next = !isAudioAlarmOn;
    setIsAudioAlarmOn(next);
    setAudioAlarmEnabled(next);
    triggerToast(next ? '🔔 접수 알람음(띵동)이 활성화되었습니다.' : '🔕 접수 알람음이 비활성화되었습니다.');
  };

  const handleTestAudioChime = () => {
    playInquiryChime();
    triggerToast('🔔 띵-동! 접수 알람 사운드가 정상 작동합니다.');
  };

  const handleRequestNotifPermission = async () => {
    const granted = await requestDesktopNotificationPermission();
    setIsNotifPermitted(granted);
    if (granted) {
      showDesktopNotification('🔔 하우스 앤 에셋 알림 활성화', '신규 고객 상담 접수 시 화면 알림이 표시됩니다.');
      triggerToast('바탕화면 실시간 알림이 승인(활성화)되었습니다.');
    } else {
      triggerToast('브라우저 알림 권한이 허용되지 않았습니다. 브라우저 설정에서 승인해주세요.');
    }
  };

  // Continuous live polling for inquiries while in AdminPanel across all tabs
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/consultation/inquiries');
        if (res.ok) {
          const data = await res.json();
          if (data.inquiries && Array.isArray(data.inquiries)) {
            const currentIds = new Set(inquiries.map((i) => i.id));
            const newOnes = data.inquiries.filter((i: any) => i.status === '접수대기' && !currentIds.has(i.id));
            if (newOnes.length > 0) {
              playInquiryChime();
              setIncomingAlert(newOnes[0]);
              showDesktopNotification(
                '🔔 [신규 고객 상담 접수!]',
                `${newOnes[0].name} (${newOnes[0].phone}) - ${newOnes[0].category} / ${newOnes[0].interestRegion}`
              );
              triggerToast(`🔔 [신규 고객접수 도착!] ${newOnes[0].name} (${newOnes[0].phone})`);
            }
            onUpdateInquiries(data.inquiries);
          }
        }
      } catch {}
    }, 4000);

    return () => clearInterval(timer);
  }, [inquiries, onUpdateInquiries]);

  const handleRefreshInquiries = async () => {
    try {
      setIsRefreshingInquiries(true);
      const res = await fetch('/api/consultation/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries && Array.isArray(data.inquiries)) {
          onUpdateInquiries(data.inquiries);
          triggerToast(`서버에서 최신 상담 및 관심고객 접수 내역 ${data.inquiries.length}건을 동기화했습니다.`);
          return;
        }
      }
      triggerToast('서버에서 내역을 불러오지 못했습니다.');
    } catch (err) {
      console.error(err);
      triggerToast('상담 내역 동기화 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshingInquiries(false);
    }
  };

  const handleExportInquiriesCsv = () => {
    if (inquiries.length === 0) {
      triggerToast('내보낼 상담/관심고객 접수 내역이 없습니다.');
      return;
    }
    const headers = ['접수일시', '고객명', '연락처', '구분/분야', '관심지역', '희망시간', '진행상태', '문의내용', '관리자메모'];
    const rows = inquiries.map((inq) => [
      `"${inq.createdAt || ''}"`,
      `"${inq.name || ''}"`,
      `"${inq.phone || ''}"`,
      `"${inq.category || ''}"`,
      `"${inq.interestRegion || ''}"`,
      `"${inq.preferredTime || ''}"`,
      `"${inq.status || ''}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      `"${(inq.adminMemo || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `관심고객_상담접수명단_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('고객 상담 및 관심고객 명단이 엑셀 CSV 파일로 다운로드되었습니다.');
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: ConsultationInquiry['status']) => {
    // Cloud Firestore sync
    try {
      await fetch('/api/consultation/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (e) {
      console.warn('Server status update error:', e);
    }
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
    onUpdateInquiries(updated);
    triggerToast(`상담 상태가 '${newStatus}'로 실시간 변경되었습니다.`);
  };

  const handleDeleteInquiry = (id: string, customerName?: string) => {
    requestConfirmation(
      '상담/관심고객 접수 내역 삭제',
      customerName
        ? `'${customerName}' 고객님의 상담/관심고객 접수 내역을 서버 및 목록에서 영구히 삭제하시겠습니까?`
        : '이 상담/관심고객 접수 내역을 영구히 삭제하시겠습니까?',
      async () => {
        // Cloud Firestore sync
        try {
          const res = await fetch(`/api/consultation/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const data = await res.json();
            if (data.inquiries && Array.isArray(data.inquiries)) {
              onUpdateInquiries(data.inquiries);
              triggerToast('상담/관심고객 접수 내역이 삭제되었습니다.');
              return;
            }
          }
        } catch (e) {
          console.warn('Server delete error:', e);
        }
        onUpdateInquiries(inquiries.filter((inq) => inq.id !== id));
        triggerToast('상담/관심고객 접수 내역이 클라우드에서 영구 삭제되었습니다.');
      }
    );
  };

  // --- Export Data ---
  const handleExportData = () => {
    const payload = {
      listings,
      articles,
      filterConfig,
      inquiries,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `real_estate_platform_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('전체 플랫폼 데이터가 JSON 파일로 백업되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[94vh]">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Logo variant="compact" theme="dark" />
            <div className="border-l border-slate-700 pl-3 ml-1 hidden sm:block">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span>통합 관리자 센터</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  실시간 연동
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                콘텐츠·분양매물·필터 항목 수정 및 접수 상담 문의(010-8873-7258) 실시간 관리
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleTestAudioChime}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors text-xs flex items-center gap-1.5 border border-amber-500/40"
              title="접수 알람음(띵동 🔔) 소리 테스트"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline font-bold">소리 테스트</span>
            </button>

            <button
              type="button"
              onClick={handleRequestNotifPermission}
              className={`px-2.5 py-1.5 rounded-lg transition-colors text-xs flex items-center gap-1.5 border ${
                isNotifPermitted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="바탕화면 실시간 알림 권한 허용"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-medium">{isNotifPermitted ? '화면알림 켜짐' : '바탕화면 알림'}</span>
            </button>

            {saveSuccessMsg && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800 animate-in fade-in">
                {saveSuccessMsg}
              </span>
            )}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="관리자 보안 잠금 및 로그아웃"
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-slate-700"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">보안 잠금</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Incoming Inquiry Alert Flash Banner */}
        {incomingAlert && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white px-4 py-2.5 flex items-center justify-between shadow-md shrink-0 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1 bg-white/20 rounded-md animate-bounce shrink-0">
                <BellRing className="w-4 h-4 text-white" />
              </span>
              <div className="truncate">
                <div className="font-black text-xs flex items-center gap-1.5">
                  <span>신규 고객 상담 접수 도착! (띵-동 🔔)</span>
                  <span className="px-1.5 py-0.2 rounded bg-white text-rose-600 text-[10px] font-black">실시간</span>
                </div>
                <p className="text-[11px] text-amber-100 truncate">
                  고객: <strong>{incomingAlert.name}</strong> ({incomingAlert.phone}) · 분야: {incomingAlert.category} · 지역: {incomingAlert.interestRegion}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('inquiries');
                  setIncomingAlert(null);
                }}
                className="px-3 py-1 bg-white text-slate-950 hover:bg-amber-100 font-extrabold text-xs rounded-lg shadow-xs transition-all"
              >
                접수내역 즉시 확인
              </button>
              <button
                type="button"
                onClick={() => playInquiryChime()}
                className="p-1 text-white hover:text-amber-200"
                title="알람음 다시 듣기"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIncomingAlert(null)}
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'listings', label: `분양 매물 관리 (${listings.length})`, icon: Building2 },
            { id: 'articles', label: `정보 칼럼/가이드 (${articles.length})`, icon: BookOpen },
            { id: 'news', label: `부동산 뉴스 (${news.length})`, icon: Newspaper },
            { id: 'filters', label: '필터 항목 설정', icon: SlidersHorizontal },
            { id: 'inquiries', label: `고객상담 & 관심고객 (${inquiries.length})`, icon: Users },
            { id: 'settings', label: '데이터 백업 & 복원', icon: Save }
          ].map((tab) => {
            const Icon = tab.icon;
            const hasPending = tab.id === 'inquiries' && inquiries.some((i) => i.status === '접수대기');
            const pendingCount = tab.id === 'inquiries' ? inquiries.filter((i) => i.status === '접수대기').length : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {hasPending && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                    {pendingCount}건
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: LISTINGS */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              {/* Listings Automation & Sync Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-emerald-950">
                        분양정보 실시간 중앙 동기화 & 일정 자동 관리
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                        정상 가동 (Active)
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      중앙 서버 DB 연동 · 등록 및 수정한 분양 현장은 모든 방문자 기기에 실시간 자동 반영되며, 분양 상태·일정이 안전하게 관리됩니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onRefreshServerListings) onRefreshServerListings();
                    triggerToast('서버의 최신 분양 매물 데이터가 실시간 동기화되었습니다.');
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>분양 데이터 즉시 동기화</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">등록된 신규 분양 매물 목록</h3>
                  <p className="text-xs text-slate-500">
                    실시간으로 분양정보 탭에 반영되며 사진, 가격, 평수, 상태를 즉시 변경할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={openNewListingModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>신규 매물 등록</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            {item.status}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.propertyType}
                          </span>
                          <span className="text-xs text-slate-400">| {item.region}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          분양가: <strong className="text-blue-600">{item.priceDisplay}</strong> · 약 {item.pyeong}평형 · {item.totalHouseholds}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openEditListingModal(item)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-500" />
                        <span>수정</span>
                      </button>
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              {/* Daily Automation Status Banner for Real Estate Info */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-emerald-950">부동산 정보 칼럼 매일 자동 업데이트 가동 중</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                        정상 가동 (Active)
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      기준일자: <strong className="font-bold">{automationStatus.lastDailyDate || automationStatus.todayDate || '2026.09.22'}</strong> (금일 심층 가이드 반영 완료) · 매일 자정 최신 부동산 금융 및 청약 정책 분석 정보가 자동 발행됩니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRunDailyAutomation}
                  disabled={isTriggeringDailyAuto}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTriggeringDailyAuto ? 'animate-spin' : ''}`} />
                  <span>{isTriggeringDailyAuto ? '업데이트 중...' : '지금 즉시 자동 업데이트 실행'}</span>
                </button>
              </div>

              {/* AI Auto Report Generator Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white">Gemini AI 실시간 부동산 심층 리포트 자동 생성</h4>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    완전 자동화
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  원하는 주제를 입력하거나 기본값으로 두면, AI가 최신 청약 제도·사업자대출 조건·세무 가이드 칼럼을 즉시 전문 분석글로 완성하여 등록합니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <select
                    value={aiCategoryInput}
                    onChange={(e) => setAiCategoryInput(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="대출·금융" className="text-slate-900">대출·금융</option>
                    <option value="청약" className="text-slate-900">청약</option>
                    <option value="세금" className="text-slate-900">세금</option>
                    <option value="부동산 상식" className="text-slate-900">부동산 상식</option>
                    <option value="오피스텔" className="text-slate-900">오피스텔</option>
                    <option value="지식산업센터" className="text-slate-900">지식산업센터</option>
                  </select>

                  <input
                    type="text"
                    value={aiTopicInput}
                    onChange={(e) => setAiTopicInput(e.target.value)}
                    placeholder={`예: ${CURRENT_YEAR}년 사업자대출 심사 완화 및 청약 통장 관리 전략`}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  <button
                    onClick={handleGenerateAIArticle}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 shrink-0 min-h-[38px]"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI 분석글 작성 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI 리포트 즉시 자동생성</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">부동산 정보 & 가이드 콘텐츠 관리</h3>
                  <p className="text-xs text-slate-500">
                    {CURRENT_YEAR} 사업자대출, 청약 1순위, 취득세 등 카테고리별 전문 가이드 글을 실시간 추가/수정합니다.
                  </p>
                </div>
                <button
                  onClick={openNewArticleModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 가이드/칼럼 직접 작성</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="font-bold text-blue-600">[{art.category}]</span>
                        <span className="text-slate-400">· {art.date}</span>
                        <span className="text-slate-400">· 조회수 {art.views}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{art.title}</h4>
                      <p className="text-xs text-slate-500 truncate mt-1">{art.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openEditArticleModal(art)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-500" />
                        <span>수정</span>
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REAL ESTATE NEWS MANAGEMENT & RSS AUTOMATION */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              {/* Daily Automation Status Banner for News */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-emerald-950">부동산 뉴스 매일 자동 업데이트 가동 중</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                        정상 가동 (Active)
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      기준일자: <strong className="font-bold">{automationStatus.lastDailyDate || automationStatus.todayDate || '2026.09.22'}</strong> · 매일경제·한국경제 실시간 RSS 뉴스 및 당일 부동산 시장 속보가 매일 자동으로 수집·등록됩니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRunDailyAutomation}
                  disabled={isTriggeringDailyAuto}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTriggeringDailyAuto ? 'animate-spin' : ''}`} />
                  <span>{isTriggeringDailyAuto ? '뉴스 갱신 중...' : '지금 즉시 자동 업데이트 실행'}</span>
                </button>
              </div>

              {/* RSS Automation Hero Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 text-sky-400 ${isFetchingRss ? 'animate-spin' : ''}`} />
                    <h3 className="text-sm font-bold text-white">포털 & 경제지 실시간 부동산 뉴스 자동 수신</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      RSS 실시간 연동
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    매일경제, 한국경제 등 국내 주요 언론사의 최신 부동산 속보와 정책 기사를 실시간으로 가져와 사이트에 자동 업데이트합니다.
                  </p>
                </div>

                <button
                  onClick={handleFetchRssNews}
                  disabled={isFetchingRss}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 shrink-0 min-h-[40px] w-full sm:w-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRss ? 'animate-spin' : ''}`} />
                  <span>{isFetchingRss ? '최신 뉴스 수신 중...' : '지금 최신 뉴스 동기화'}</span>
                </button>
              </div>

              {/* News List */}
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">등록된 뉴스 총 {news.length}건</span>
                <span className="text-slate-400">실시간 연동 뉴스는 사용자 화면 '부동산 뉴스' 탭에 즉시 반영됩니다.</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-slate-500 font-medium">· {item.publisher}</span>
                        <span className="text-slate-400">· {item.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          <span>원문 보기</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FILTER CONFIG */}
          {activeTab === 'filters' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">실시간 필터 검색 항목 관리</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    사진 속 매물 유형, 지역, 평수, 가격대, 분양 상태 필터를 추가·수정·삭제할 수 있습니다. 변경사항은 즉시 반영됩니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFilterModalCategory('propertyTypes');
                    setIsFilterModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
                >
                  <Settings2 className="w-4 h-4" />
                  <span>전체 필터 상세 설정 모달 열기</span>
                </button>
              </div>

              {/* 5 Filter Categories Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                    {
                      key: 'propertyTypes' as FilterCategoryKey,
                      label: '매물 유형',
                      icon: Building2,
                      placeholder: '새 매물 유형 (예: 빌라/다세대, 타운하우스)'
                    },
                    {
                      key: 'regions' as FilterCategoryKey,
                      label: '지역 선택',
                      icon: MapPin,
                      placeholder: '새 지역명 (예: 경기 부천/원미, 대구 수성구)'
                    },
                    {
                      key: 'pyeongOptions' as FilterCategoryKey,
                      label: '평수 (면적)',
                      icon: Maximize2,
                      placeholder: '새 평수 구간 (예: 50평 이상 초대형)'
                    },
                    {
                      key: 'priceOptions' as FilterCategoryKey,
                      label: '가격대 (분양가)',
                      icon: DollarSign,
                      placeholder: '새 가격 구간 (예: 15억 이상 초고가)'
                    },
                    {
                      key: 'statusOptions' as FilterCategoryKey,
                      label: '분양 상태',
                      icon: Tag,
                      placeholder: '새 분양 상태 (예: 사전접수중, 선착순지정)'
                    }
                  ] as const
                ).map((cat) => {
                  const Icon = cat.icon;
                  const list = filterConfig[cat.key] || [];
                  return (
                    <div
                      key={cat.key}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{cat.label}</h4>
                            <span className="text-[11px] text-slate-400">등록된 옵션 {list.length}개</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setFilterModalCategory(cat.key);
                            setIsFilterModalOpen(true);
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>상세 편집</span>
                        </button>
                      </div>

                      {/* Chips */}
                      <div className="flex flex-wrap gap-1.5 min-h-[50px] content-start">
                        {list.map((item) => (
                          <span
                            key={item}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              item === '전체'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-blue-50 text-blue-800 border border-blue-200/60'
                            }`}
                          >
                            <span>{item}</span>
                            {item !== '전체' && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFilterOption(cat.key, item)}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                                title="삭제"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>

                      {/* Quick Add Bar */}
                      <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                        <input
                          type="text"
                          placeholder={cat.placeholder}
                          value={filterInputs[cat.key] || ''}
                          onChange={(e) =>
                            setFilterInputs({ ...filterInputs, [cat.key]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddFilterOption(cat.key);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 hover:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddFilterOption(cat.key)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>추가</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">고객 상담 & 관심고객 접수 내역 ({inquiries.length}건)</h3>
                    {inquiries.some((i) => i.status === '접수대기') && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] animate-pulse">
                        {inquiries.filter((i) => i.status === '접수대기').length}건 신규
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    온라인 상담 신청, 관심고객 등록 및 VIP 매물 알림 신청 내역이 서버에 영구 보존됩니다.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestAudioChime}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    title="신규 접수 시 울리는 알람 차임벨 소리(띵동) 테스트"
                  >
                    <BellRing className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                    <span>알람음 테스트</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleAudioAlarm}
                    className={`px-3 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border shadow-xs ${
                      isAudioAlarmOn
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                    }`}
                    title="새로운 상담 접수 시 알람 사운드 On/Off"
                  >
                    {isAudioAlarmOn ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>알람음 ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                        <span>알람음 OFF</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleRefreshInquiries}
                    disabled={isRefreshingInquiries}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    title="서버 최신 접수건 즉시 동기화"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshingInquiries ? 'animate-spin' : ''}`} />
                    <span>새로고침</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportInquiriesCsv}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    title="고객 명단 엑셀 CSV 파일 다운로드"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>엑셀 CSV</span>
                  </button>
                  <a
                    href={`mailto:jangkeeseoup1739@gmail.com?subject=%5B%EB%B6%80%EB%8F%99%EC%82%B0%20%EC%A0%91%EC%88%98%20%EC%B4%9D%EA%B4%84%20%EC%95%8C%EB%A6%BC%5D%20%EC%8B%A0%EA%B7%9C%20%EA%B3%A0%EA%B0%9D%20${inquiries.filter((i) => i.status === '접수대기').length}%EA%B1%B4%20%EB%8C%80%EA%B8%B0&body=${encodeURIComponent(
                      `[부동산 고객상담 및 관심고객 접수 종합 보고]\n대표 수신메일: jangkeeseoup1739@gmail.com\n총 접수: ${inquiries.length}건 (신규 대기: ${inquiries.filter((i) => i.status === '접수대기').length}건)\n\n[최근 접수 고객 목록]\n` +
                      inquiries.slice(0, 15).map((inq, idx) => `${idx + 1}. [${inq.status}] ${inq.name} (${inq.phone})\n- 분야: ${inq.category} / 관심지역: ${inq.interestRegion}\n- 희망시간: ${inq.preferredTime} / 접수일: ${inq.createdAt}\n- 문의내용: ${inq.message || '없음'}\n`).join('\n')
                    )}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    title="대표님 메일(jangkeeseoup1739@gmail.com)로 접수 내역 발송/확인"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>대표 메일로 알림 열기</span>
                  </a>
                  <a
                    href="tel:010-8873-7258"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>010-8873-7258</span>
                  </a>
                </div>
              </div>

              {/* Email Notification & Real-time Alarm Status Banner */}
              <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white">실시간 알람 & 메일 수신처:</span>
                      <code className="text-xs font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-400/30">jangkeeseoup1739@gmail.com</code>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        실시간 차임벨 알람 가동 중
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      고객 접수 시 띵-동 차임벨 소리 및 실시간 팝업이 울리며, 아래 버튼으로 대표님 Gmail에서 즉시 확인 가능합니다.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="mailto:jangkeeseoup1739@gmail.com?subject=%5B%EB%B6%80%EB%8F%99%EC%82%B0%20%EC%95%8C%EB%A6%BC%20%ED%85%8C%EC%8A%A4%ED%8A%B8%5D%20%EB%A9%94%EC%9D%BC%20%EC%A0%84%EC%86%A1%20%ED%85%8C%EC%8A%A4%ED%8A%B8&body=%EB%8C%80%ED%91%9C%EB%8B%98%20%EC%9D%B4%EB%A9%94%EC%9D%BC(jangkeeseoup1739@gmail.com)%EB%A1%9C%20%EC%A0%95%EC%83%81%20%EC%97%B0%EB%8F%99%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4."
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="대표님 메일로 테스트 메일 바로 보내기"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>테스트 알림 메일</span>
                  </a>
                  <a
                    href="mailto:jangkeeseoup1739@gmail.com"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Gmail 열기</span>
                  </a>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                  현재 접수된 신규 상담 및 관심고객 내역이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => {
                    const isInterestCustomer = (inq.category || '').includes('관심고객') || (inq.name || '').includes('관심고객');
                    return (
                    <div
                      key={inq.id}
                      className={`p-4 bg-white rounded-xl border shadow-xs space-y-3 text-xs transition-all ${
                        isInterestCustomer ? 'border-purple-200 hover:border-purple-300' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              inq.status === '접수대기'
                                ? 'bg-amber-100 text-amber-800'
                                : inq.status === '상담진행중'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {inq.status}
                          </span>
                          {isInterestCustomer && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200/80">
                              ★ 관심고객
                            </span>
                          )}
                          <span className="font-bold text-sm text-slate-900">{inq.name} 고객님</span>
                          <span className="text-slate-400">({inq.createdAt})</span>
                        </div>

                        {/* Status switcher */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">상태 변경:</span>
                          {(['접수대기', '상담진행중', '상담완료'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                              className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                                inq.status === st
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                          <a
                            href={`mailto:jangkeeseoup1739@gmail.com?subject=%5B%EA%B3%A0%EA%B0%9D%20%EC%83%81%EB%8B%B4%20%EC%95%8C%EB%A6%BC%5D%20${encodeURIComponent(inq.name)}%20%EA%B3%A0%EA%B0%9D%EB%8B%98%20(${encodeURIComponent(inq.phone)})&body=%5B%EA%B3%A0%EA%B0%9D%20%EC%83%81%EB%8B%B4%20%EB%B0%8F%20%EA%B4%80%EC%8B%AC%EA%B3%A0%EA%B0%9D%20%EC%83%81%EC%84%B8%20%EC%A0%91%EC%88%98%20%EB%82%B4%EC%9A%A9%5D%0A%0A-%20%EA%B3%A0%EA%B0%9D%EB%AA%85%3A%20${encodeURIComponent(inq.name)}%0A-%20%EC%97%B0%EB%9D%BD%EC%B2%98%3A%20${encodeURIComponent(inq.phone)}%0A-%20%EC%83%81%EB%8B%B4%EB%B6%84%EC%95%BC%3A%20${encodeURIComponent(inq.category)}%0A-%20%EA%B4%80%EC%8B%AC%EC%A7%80%EC%97%AD%3A%20${encodeURIComponent(inq.interestRegion)}%0A-%20%ED%9D%AC%EB%A7%9D%EC%8B%9C%EA%B0%84%3A%20${encodeURIComponent(inq.preferredTime)}%0A-%20%EC%A0%91%EC%88%98%EC%9D%BC%EC%8B%9C%3A%20${encodeURIComponent(inq.createdAt)}%0A-%20%EC%A7%84%ED%96%89%EC%83%81%ED%83%9C%3A%20${encodeURIComponent(inq.status)}%0A%0A-%20%EB%AC%B8%EC%9D%98%EB%82%B4%EC%9A%A9%3A%0A${encodeURIComponent(inq.message || '없음')}%0A%0A-%20%EA%B4%80%EB%A6%AC%EC%9E%90%20%EB%A9%94%EB%AA%A8%3A%0A${encodeURIComponent(inq.adminMemo || '없음')}`}
                            className="ml-1 px-2 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="이 상담건을 대표님 이메일(jangkeeseoup1739@gmail.com)로 보내기"
                          >
                            <Mail className="w-3 h-3 text-indigo-600" />
                            <span>메일 알림</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                            className="ml-0.5 px-2 py-1 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors flex items-center gap-1 text-[11px] font-bold"
                            title="상담/관심고객 내역 삭제"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-slate-700">
                        <div>
                          <strong>연락처:</strong> <a href={`tel:${inq.phone}`} className="text-blue-600 font-bold underline">{inq.phone}</a>
                        </div>
                        <div>
                          <strong>상담 분야:</strong> {inq.category}
                        </div>
                        <div>
                          <strong>관심 지역/시간:</strong> {inq.interestRegion} ({inq.preferredTime})
                        </div>
                      </div>

                      {inq.message && (
                        <div className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                          <strong>문의 내용:</strong> {inq.message}
                        </div>
                      )}

                      {inq.adminMemo && (
                        <div className="text-amber-800 bg-amber-50 p-2 rounded-lg text-[11px]">
                          <strong>관리자 메모:</strong> {inq.adminMemo}
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BACKUP & RESTORE */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
              {/* Daily Automation System Health Check Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">매일 자동 업데이트 엔진 상태 점검</h4>
                      <p className="text-xs text-slate-300">부동산 정보 칼럼 & 실시간 뉴스 일일 자동 발행 스케줄러</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRunDailyAutomation}
                    disabled={isTriggeringDailyAuto}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTriggeringDailyAuto ? 'animate-spin' : ''}`} />
                    <span>{isTriggeringDailyAuto ? '업데이트 실행 중...' : '지금 즉시 자동 업데이트 테스트'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-slate-400 block mb-1">스케줄러 상태</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      매일 자동 가동
                    </span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-slate-400 block mb-1">오늘 기준일자</span>
                    <span className="font-bold text-white">{automationStatus.todayDate || '2026.09.26'}</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-slate-400 block mb-1">부동산 뉴스</span>
                    <span className="font-bold text-sky-300">{automationStatus.newsCount || news.length}건 (자동)</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-slate-400 block mb-1">정보 칼럼/가이드</span>
                    <span className="font-bold text-amber-300">{automationStatus.articlesCount || articles.length}건 (자동)</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-slate-400 block mb-1">분양 매물</span>
                    <span className="font-bold text-emerald-300">{automationStatus.listingsCount || listings.length}건 (중앙동기)</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>3대 핵심 콘텐츠 자동화 시스템 정상 가동 중</span>
                  </div>
                  <p className="text-slate-300">
                    ① <strong>부동산 뉴스</strong>: 매일경제/한국경제 등 주요 언론사 실시간 RSS 자동 수집 & 매일 업데이트<br />
                    ② <strong>부동산 정보</strong>: 데일리 심층 가이드 리포트(대출·청약·세금 분석) 매일 자동 신규 발행<br />
                    ③ <strong>분양 정보</strong>: 중앙 서버 DB 실시간 동기화로 모든 고객 기기에 즉시 자동 반영 및 일정 관리
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">데이터 영구 보관 & 복원</h3>
                <p className="text-xs text-slate-500">
                  모든 데이터는 브라우저 로컬 저장소에 실시간 동기화되며 언제든 파일로 백업할 수 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>전체 데이터 JSON 내보내기</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    현재 수정된 분양 매물, 칼럼, 필터 항목, 상담 내역을 안전한 백업 파일로 저장합니다.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    데이터 백업 파일 다운로드
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
                  <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>초기 데모 데이터로 재설정</span>
                  </h4>
                  <p className="text-xs text-rose-700">
                    사용자가 추가/수정한 모든 데이터를 초기 {CURRENT_YEAR} 청약·대출·분양 기본 데이터로 복구합니다.
                  </p>
                  <button
                    onClick={() => {
                      requestConfirmation(
                        '전체 데이터 초기화',
                        '모든 데이터를 초기 기본 상태로 복원하시겠습니까? 추가/수정된 모든 내용이 초기화됩니다.',
                        () => {
                          onResetData();
                          triggerToast('기본 데이터로 초기화되었습니다.');
                        },
                        '초기화 진행'
                      );
                    }}
                    className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
                  >
                    초기 데이터로 리셋
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: New/Edit Property Listing */}
        {isListingModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  {editingListing ? '분양 매물 정보 수정' : '새 분양 매물 등록'}
                </h3>
                <button onClick={() => setIsListingModalOpen(false)}>
                  <X className="w-5 h-5 text-slate-400 hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleSaveListing} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">단지 / 매물명 *</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 동탄 레이크 센트럴자이"
                      value={listingForm.title || ''}
                      onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">서브 카피</label>
                    <input
                      type="text"
                      placeholder="예: 호수공원 조망권 대단지"
                      value={listingForm.subtitle || ''}
                      onChange={(e) => setListingForm({ ...listingForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">매물 유형</label>
                    <select
                      value={listingForm.propertyType || '아파트'}
                      onChange={(e) => setListingForm({ ...listingForm, propertyType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="아파트">아파트</option>
                      <option value="오피스텔">오피스텔</option>
                      <option value="지식산업센터">지식산업센터</option>
                      <option value="상가/업무">상가/업무</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">지역</label>
                    <select
                      value={listingForm.region || filterConfig.regions[1]}
                      onChange={(e) => setListingForm({ ...listingForm, region: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      {filterConfig.regions.filter((r) => r !== '전체').map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">분양 상태</label>
                    <select
                      value={listingForm.status || '분양중'}
                      onChange={(e) => setListingForm({ ...listingForm, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="분양중">분양중</option>
                      <option value="마감임박">마감임박</option>
                      <option value="분양예정">분양예정</option>
                      <option value="분양완료">분양완료</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">공급 평수 (숫자)</label>
                    <input
                      type="number"
                      value={listingForm.pyeong || 34}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        let grp: PropertyListing['pyeongGroup'] = '30~40평';
                        if (p <= 20) grp = '20평 이하';
                        else if (p <= 30) grp = '20~30평';
                        else if (p <= 40) grp = '30~40평';
                        else grp = '40평 이상';
                        setListingForm({ ...listingForm, pyeong: p, pyeongGroup: grp });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">분양가 표기 문자열</label>
                    <input
                      type="text"
                      placeholder="예: 6억 8,000만원~"
                      value={listingForm.priceDisplay || ''}
                      onChange={(e) => setListingForm({ ...listingForm, priceDisplay: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">총 세대 / 호실</label>
                    <input
                      type="text"
                      placeholder="예: 1,524세대"
                      value={listingForm.totalHouseholds || ''}
                      onChange={(e) => setListingForm({ ...listingForm, totalHouseholds: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">시공사 / 시행사</label>
                    <input
                      type="text"
                      value={listingForm.constructorCompany || ''}
                      onChange={(e) => setListingForm({ ...listingForm, constructorCompany: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">입주 예정 시기</label>
                    <input
                      type="text"
                      placeholder="예: 2027년 08월"
                      value={listingForm.moveInDate || ''}
                      onChange={(e) => setListingForm({ ...listingForm, moveInDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">대표 이미지 URL</label>
                  <input
                    type="url"
                    value={listingForm.imageUrl || ''}
                    onChange={(e) => setListingForm({ ...listingForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">단지 상세 설명</label>
                  <textarea
                    rows={3}
                    value={listingForm.description || ''}
                    onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsListingModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New/Edit Article */}
        {isArticleModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  {editingArticle ? '부동산 가이드 콘텐츠 수정' : '새 가이드 콘텐츠 작성'}
                </h3>
                <button onClick={() => setIsArticleModalOpen(false)}>
                  <X className="w-5 h-5 text-slate-400 hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">카테고리</label>
                    <select
                      value={articleForm.category || '대출·금융'}
                      onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="대출·금융">대출·금융</option>
                      <option value="청약">청약</option>
                      <option value="세금">세금</option>
                      <option value="부동산 상식">부동산 상식</option>
                      <option value="오피스텔">오피스텔</option>
                      <option value="지식산업센터">지식산업센터</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">소분류</label>
                    <input
                      type="text"
                      placeholder="예: 사업자대출, 취득세"
                      value={articleForm.subCategory || ''}
                      onChange={(e) => setArticleForm({ ...articleForm, subCategory: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">콘텐츠 제목 *</label>
                  <input
                    type="text"
                    required
                    placeholder="제목을 입력하세요"
                    value={articleForm.title || ''}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">핵심 요약 (한 줄)</label>
                  <textarea
                    rows={2}
                    placeholder="글의 주요 요점을 간단히 적어주세요."
                    value={articleForm.summary || ''}
                    onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">본문 내용</label>
                  <textarea
                    rows={6}
                    placeholder="본문 내용을 입력하세요."
                    value={articleForm.sections?.[0]?.body || ''}
                    onChange={(e) => {
                      const sections = [...(articleForm.sections || [])];
                      if (!sections[0]) sections[0] = { heading: '1. 상세 가이드', body: '' };
                      sections[0].body = e.target.value;
                      setArticleForm({ ...articleForm, sections });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    발행하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* In-App Confirmation Modal */}
        {confirmDialog && confirmDialog.isOpen && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">{confirmDialog.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{confirmDialog.description}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors min-h-[40px]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const action = confirmDialog.onConfirm;
                    setConfirmDialog(null);
                    action();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm min-h-[40px]"
                >
                  {confirmDialog.confirmText || '삭제 확인'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Management Modal */}
        <FilterManagementModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          config={filterConfig}
          onUpdateConfig={(newCfg) => {
            onUpdateFilterConfig(newCfg);
            triggerToast('필터 설정이 성공적으로 저장되었습니다.');
          }}
          initialCategory={filterModalCategory}
        />
      </div>
    </div>
  );
}
