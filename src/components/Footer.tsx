import { Building2, PhoneCall, ShieldCheck, HelpCircle } from 'lucide-react';
import { CURRENT_YEAR } from '../utils/date';
import { InfoCategory } from '../types';
import Logo from './Logo';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'info' | 'presale' | 'news' | 'consultation') => void;
  onSelectInfoCategory: (cat: InfoCategory) => void;
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
}

export default function Footer({
  onSelectTab,
  onSelectInfoCategory,
  onOpenCalculator,
  onOpenAdmin
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-12 sm:mt-20">
      {/* Top Banner inside Footer */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800/80 py-6 sm:py-8 px-3.5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Real Estate Premium Advisory
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white">
              신규 분양정보 분석 & 사업자대출·세무 1:1 전담 컨설팅
            </h3>
            <p className="text-xs text-slate-300">
              복잡한 청약 제도와 금융 규제, 전문 자문위원과 함께 가장 유리한 솔루션을 찾으세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="tel:010-8873-7258"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>직통 전화: 010-8873-7258</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-8 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {/* Brand & Phone */}
        <div className="space-y-3">
          <Logo variant="compact" theme="dark" />
          <p className="text-xs text-slate-400 leading-relaxed">
            {CURRENT_YEAR} 최신 주택청약 제도 개편, 사업자 시설·운전자금 한도 심사, 취득세·양도세 세무 분석 및 수도권 랜드마크 신규 분양 정보를 한눈에 제공하는 종합 플랫폼입니다.
          </p>
          <div className="pt-1">
            <div className="text-[11px] text-slate-400">대표 상담 센터</div>
            <a href="tel:010-8873-7258" className="text-lg font-black text-amber-400 hover:underline">
              010-8873-7258
            </a>
            <div className="text-[11px] text-slate-400 mt-0.5">상담 시간: 평일·주말 09:00 ~ 21:00 (연중무휴)</div>
          </div>
        </div>

        {/* Info Categories */}
        <div className="space-y-2.5 sm:space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">부동산 핵심 정보</h4>
          <ul className="space-y-2 sm:space-y-1.5 text-xs">
            {(['부동산 상식', '청약', '대출·금융', '세금', '오피스텔', '지식산업센터'] as InfoCategory[]).map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    onSelectInfoCategory(cat);
                    onSelectTab('info');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  {cat} 가이드
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Tools */}
        <div className="space-y-2.5 sm:space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">빠른 서비스</h4>
          <ul className="space-y-2 sm:space-y-1.5 text-xs">
            <li>
              <button
                onClick={() => {
                  onSelectTab('presale');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors py-0.5 text-left"
              >
                신규 분양정보 검색
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onSelectTab('news');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors py-0.5 text-left"
              >
                {CURRENT_YEAR} 부동산 최신 뉴스
              </button>
            </li>
            <li>
              <button
                onClick={onOpenCalculator}
                className="hover:text-white transition-colors py-0.5 text-left"
              >
                아파트·오피스텔 취득세 계산기
              </button>
            </li>
            <li>
              <button
                onClick={onOpenCalculator}
                className="hover:text-white transition-colors py-0.5 text-left"
              >
                부동산 중개수수료(복비) 계산기
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onSelectTab('consultation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors py-0.5 text-left"
              >
                1:1 신속 맞춤 상담 접수
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Admin */}
        <div className="space-y-2.5 sm:space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">플랫폼 운영 & 관리</h4>
          <div className="space-y-1.5 text-xs text-slate-400">
            <p>신속 문의 접수: <a href="tel:010-8873-7258" className="hover:text-blue-400 font-medium transition-colors">010-8873-7258</a></p>
            <p>
              이메일 문의:{' '}
              <a
                href="mailto:jangkeeseoup1739@gmail.com?cc=budongsan1739@gmail.com&subject=%5B%EB%B6%80%EB%8F%99%EC%82%B0%20%ED%94%8C%EB%9E%AB%ED%8F%BC%5D%20%EB%B6%84%EC%96%91%20%EB%B0%8F%20%EC%83%81%EB%8B%B4%20%EB%AC%B8%EC%9D%98&body=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94%2C%20%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%A7%A4%EB%AC%BC%20%EB%B0%8F%20%EB%B6%84%EC%96%91%20%EA%B4%80%EB%A0%A8%20%EB%AC%B8%EC%9D%98%EB%93%9C%EB%A6%BD%EB%8B%88%EB%8B%A4.%0A%0A-%20%EC%84%B1%ED%95%A8%3A%0A-%20%EC%97%B0%EB%9D%BD%EC%B2%98%3A%0A-%20%EB%AC%B8%EC%9D%98%EB%82%B4%EC%9A%A9%3A"
                className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
                title="클릭 시 대표님 이메일로 바로 메일 작성창 열기"
              >
                jangkeeseoup1739@gmail.com
              </a>
              <span className="text-slate-500 mx-1">·</span>
              <a
                href="mailto:budongsan1739@gmail.com"
                className="text-slate-400 hover:text-blue-300 underline font-medium transition-colors"
                title="대표 관리자 이메일"
              >
                budongsan1739@gmail.com
              </a>
            </p>
            <p>실시간 상담 처리 시스템 연동 완료</p>
            <p>SSL 보안 암호화 통신 적용</p>
          </div>
          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors border border-slate-700 flex items-center gap-1.5 min-h-[38px]"
            >
              <span>관리자 CMS 모드 진입</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800/80 py-5 sm:py-6 px-3.5 sm:px-8 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left">
          <p className="leading-relaxed">
            본 사이트에서 제공하는 분양정보, 세율 및 대출 조건 등은 관련 법령 및 금융기관 정책에 따라 수시로 변동될 수 있으므로 실제 계약 전 전문가 상담(010-8873-7258)을 권장합니다.
          </p>
          <p className="shrink-0">© {CURRENT_YEAR} 부동산 정보 및 분양 플랫폼. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
