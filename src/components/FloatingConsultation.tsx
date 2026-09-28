import { useState } from 'react';
import { PhoneCall, MessageSquare, Calculator, ChevronUp, Bell } from 'lucide-react';

interface FloatingConsultationProps {
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export default function FloatingConsultation({
  onOpenConsultation,
  onOpenCalculator,
  onOpenNotifications,
  unreadCount
}: FloatingConsultationProps) {
  const [isOpen, setIsOpen] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-5 z-40 flex flex-col items-end gap-2 sm:gap-2.5">
      {/* Quick Dial Pill */}
      <a
        href="tel:010-8873-7258"
        className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white pl-3 pr-3.5 sm:pl-3.5 sm:pr-4 py-2 sm:py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-xs font-bold border-2 border-white/40 group"
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-blue-700 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
          <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] sm:text-[10px] text-blue-200 font-medium leading-none">빠른 전화문의</span>
          <span className="text-xs sm:text-xs font-black text-amber-300 leading-tight">010-8873-7258</span>
        </div>
      </a>

      {/* Floating Action Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenCalculator}
          className="p-2.5 sm:p-3 bg-white text-slate-700 hover:text-blue-600 rounded-full shadow-lg border border-slate-200 hover:border-blue-300 transition-all hover:scale-105 min-w-[38px] min-h-[38px] flex items-center justify-center"
          title="세금·복비 계산기"
        >
          <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={onOpenNotifications}
          className="hidden sm:flex relative p-3 bg-white text-slate-700 hover:text-blue-600 rounded-full shadow-lg border border-slate-200 hover:border-blue-300 transition-all hover:scale-105 min-w-[38px] min-h-[38px] items-center justify-center"
          title="실시간 알림 센터"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenConsultation}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full shadow-lg font-extrabold text-xs sm:text-xs transition-all hover:scale-105 min-h-[38px]"
          title="1:1 맞춤 상담 신청"
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>1:1 상담접수</span>
        </button>

        <button
          onClick={scrollToTop}
          className="p-2.5 sm:p-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow-lg transition-all hover:scale-105 min-w-[38px] min-h-[38px] flex items-center justify-center"
          title="맨 위로"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
