import { useState } from 'react';
import { CURRENT_YEAR, YEAR_STR } from '../utils/date';
import { 
  Building2, PhoneCall, Bell, Calculator, Settings, ChevronDown, 
  Menu, X, Sparkles, ShieldCheck 
} from 'lucide-react';
import { InfoCategory } from '../types';
import Logo from './Logo';

interface HeaderProps {
  currentTab: 'home' | 'info' | 'presale' | 'news' | 'consultation';
  onSelectTab: (tab: 'home' | 'info' | 'presale' | 'news' | 'consultation') => void;
  selectedInfoCategory: InfoCategory;
  onSelectInfoCategory: (cat: InfoCategory) => void;
  unreadNotificationCount: number;
  pendingInquiriesCount?: number;
  onOpenNotifications: () => void;
  onOpenCalculator: () => void;
  onOpenConsultation: () => void;
  onOpenAdmin: () => void;
}

export default function Header({
  currentTab,
  onSelectTab,
  selectedInfoCategory,
  onSelectInfoCategory,
  unreadNotificationCount,
  pendingInquiriesCount = 0,
  onOpenNotifications,
  onOpenCalculator,
  onOpenConsultation,
  onOpenAdmin
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);

  const infoSubmenus: InfoCategory[] = [
    '부동산 상식',
    '청약',
    '대출·금융',
    '세금',
    '오피스텔',
    '지식산업센터'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{CURRENT_YEAR} 청약·대출·세무 종합</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400 truncate">
              전국 신규 분양정보 정밀 검색 & 1:1 맞춤 컨설팅
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <a
              href="tel:010-8873-7258"
              className="flex items-center gap-1 font-extrabold text-amber-300 hover:text-white transition-colors text-xs"
            >
              <PhoneCall className="w-3 h-3 animate-pulse" />
              <span>010-8873-7258</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 font-medium transition-colors text-[11px] sm:text-xs"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>관리자</span>
              {pendingInquiriesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] leading-none animate-pulse">
                  {pendingInquiriesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 h-15 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center cursor-pointer group py-1"
        >
          <Logo variant="compact" />
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-slate-700">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-4 py-2 rounded-xl transition-all ${
              currentTab === 'home'
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            홈
          </button>

          {/* 부동산 정보 with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsInfoDropdownOpen(true)}
            onMouseLeave={() => setIsInfoDropdownOpen(false)}
          >
            <button
              onClick={() => onSelectTab('info')}
              className={`px-4 py-2 rounded-xl flex items-center gap-1 transition-all ${
                currentTab === 'info'
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>부동산 정보</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {isInfoDropdownOpen && (
              <div className="absolute top-full left-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                <button
                  onClick={() => {
                    onSelectInfoCategory('전체');
                    onSelectTab('info');
                    setIsInfoDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 text-slate-800"
                >
                  전체 가이드 모아보기
                </button>
                <div className="h-px bg-slate-100 my-1" />
                {infoSubmenus.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      onSelectInfoCategory(sub);
                      onSelectTab('info');
                      setIsInfoDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                      selectedInfoCategory === sub && currentTab === 'info'
                        ? 'text-blue-600 font-bold bg-blue-50/50'
                        : 'text-slate-600'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectTab('presale')}
            className={`px-4 py-2 rounded-xl transition-all ${
              currentTab === 'presale'
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            신규 분양정보
          </button>

          <button
            onClick={() => onSelectTab('news')}
            className={`px-4 py-2 rounded-xl transition-all ${
              currentTab === 'news'
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            부동산 뉴스
          </button>

          <button
            onClick={() => onSelectTab('consultation')}
            className={`px-4 py-2 rounded-xl transition-all ${
              currentTab === 'consultation'
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            상담문의
          </button>
        </nav>

        {/* Right CTA Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Real-time Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/40 transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="실시간 분양 및 정책 알림"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Calculator Button */}
          <button
            onClick={onOpenCalculator}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors min-h-[38px]"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>계산기</span>
          </button>

          {/* Fast Consultation Button */}
          <button
            onClick={onOpenConsultation}
            className="px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center gap-1 sm:gap-1.5 min-h-[38px]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>상담신청</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                onSelectTab('home');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-sm font-bold text-left min-h-[44px] flex items-center ${
                currentTab === 'home' ? 'bg-blue-50 text-blue-600 font-extrabold' : 'bg-slate-50 text-slate-800'
              }`}
            >
              홈
            </button>
            <button
              onClick={() => {
                onSelectTab('presale');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-sm font-bold text-left min-h-[44px] flex items-center ${
                currentTab === 'presale' ? 'bg-blue-50 text-blue-600 font-extrabold' : 'bg-slate-50 text-slate-800'
              }`}
            >
              신규 분양정보
            </button>
            <button
              onClick={() => {
                onSelectTab('info');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-sm font-bold text-left min-h-[44px] flex items-center ${
                currentTab === 'info' ? 'bg-blue-50 text-blue-600 font-extrabold' : 'bg-slate-50 text-slate-800'
              }`}
            >
              부동산 정보 가이드
            </button>
            <button
              onClick={() => {
                onSelectTab('news');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-sm font-bold text-left min-h-[44px] flex items-center ${
                currentTab === 'news' ? 'bg-blue-50 text-blue-600 font-extrabold' : 'bg-slate-50 text-slate-800'
              }`}
            >
              부동산 뉴스
            </button>
          </div>

          <div className="pt-1">
            <div className="text-xs font-bold text-slate-500 mb-2">정보 카테고리 바로가기</div>
            <div className="flex flex-wrap gap-1.5">
              {infoSubmenus.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    onSelectInfoCategory(sub);
                    onSelectTab('info');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 font-semibold min-h-[34px] flex items-center"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs sm:text-sm">
            <button
              onClick={() => {
                onOpenAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-between min-h-[42px] transition-colors hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>관리자 센터 (고객 상담 접수함)</span>
              </div>
              {pendingInquiriesCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black animate-pulse">
                  {pendingInquiriesCount}건 대기
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">관리 바로가기 →</span>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              <a
                href="tel:010-8873-7258"
                className="flex items-center gap-1.5 font-bold text-blue-600 min-h-[40px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>010-8873-7258 전화상담</span>
              </a>
              <button
                onClick={() => {
                  onOpenCalculator();
                  setIsMobileMenuOpen(false);
                }}
                className="text-slate-700 font-bold px-3 py-1.5 bg-slate-100 rounded-lg min-h-[38px]"
              >
                계산기 열기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
