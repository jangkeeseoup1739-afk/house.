import { useState } from 'react';
import { X, Bell, Check, Sparkles, Send, ShieldCheck, Mail } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onSelectTarget?: (targetId: string, category: string) => void;
  onSubscribeAlert: (phone: string, region: string) => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onSelectTarget,
  onSubscribeAlert
}: NotificationModalProps) {
  const [subPhone, setSubPhone] = useState('');
  const [subRegion, setSubRegion] = useState('서울/수도권 전체');
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subPhone) return;
    onSubscribeAlert(subPhone, subRegion);
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setSubPhone('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">실시간 분양 & 금융 알림 센터</h2>
              <p className="text-xs text-slate-500">최신 신규 분양 오픈 및 금융 정책 소식을 빠르게 확인하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom SMS / Push Alert Subscription Box */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>관심고객 등록 & VIP 실시간 분양 알림</span>
          </div>
          <p className="text-xs text-slate-200 mb-3">
            원하는 지역의 관심고객으로 등록하시면 신규 분양 오픈 및 파격 조건 변경(무이자, 계약금 정액제) 소식을 가장 먼저 받아보실 수 있습니다.
          </p>

          {isSubscribed ? (
            <div className="space-y-2 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-100 text-xs font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>관심고객 등록 및 알림 신청이 완료되었습니다! 최신 매물 등록 시 우선 발송됩니다.</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-emerald-400/30 text-[11px]">
                <span className="text-emerald-200">대표 이메일 접수: jangkeeseoup1739@gmail.com</span>
                <a
                  href={`mailto:jangkeeseoup1739@gmail.com?subject=%5B%EA%B4%80%EC%8B%AC%EA%B3%A0%EA%B0%9D%20%EC%95%8C%EB%A6%BC%EC%8B%A0%EC%B2%AD%5D%20(${encodeURIComponent(subPhone)})&body=%5B%EA%B4%80%EC%8B%AC%EA%B3%A0%EA%B0%9D%20%EB%93%B1%EB%A1%9D%20%EC%95%8C%EB%A6%BC%5D%0A-%20%EC%97%B0%EB%9D%BD%EC%B2%98%3A%20${encodeURIComponent(subPhone)}%0A-%20%EA%B4%80%EC%8B%AC%EC%A7%80%EC%97%AD%3A%20${encodeURIComponent(subRegion)}%0A-%20%EC%A0%91%EC%88%98%EC%9D%BC%EC%8B%9C%3A%20${encodeURIComponent(new Date().toLocaleString())}`}
                  className="underline hover:text-white flex items-center gap-1 font-bold text-amber-300"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>대표 메일로 바로 보내기</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <select
                value={subRegion}
                onChange={(e) => setSubRegion(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="수도권 전체" className="text-slate-900">수도권 전체</option>
                <option value="서울 주요권역" className="text-slate-900">서울 주요권역 (강남·마포)</option>
                <option value="경기 동탄/판교" className="text-slate-900">경기 남부 (동탄·판교)</option>
                <option value="경기 평택/고덕" className="text-slate-900">평택 고덕·지산</option>
                <option value="인천 송도/청라" className="text-slate-900">인천 경제자유구역</option>
              </select>
              <input
                type="tel"
                placeholder="휴대폰 번호 (010-0000-0000)"
                value={subPhone}
                onChange={(e) => setSubPhone(e.target.value)}
                required
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/10 text-white placeholder-slate-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap min-h-[38px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>관심고객 등록</span>
              </button>
            </form>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>최근 도착한 알림 ({notifications.length}건)</span>
            <span className="text-[11px] text-slate-400">클릭 시 상세 이동</span>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">새로운 알림이 없습니다.</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  if (item.targetId && onSelectTarget) {
                    onSelectTarget(item.targetId, item.category);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.isRead
                    ? 'bg-slate-50/60 border-slate-200 text-slate-600'
                    : 'bg-blue-50/50 border-blue-200 shadow-sm text-slate-900'
                } hover:border-blue-400 hover:bg-blue-50/80`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.category === '분양'
                          ? 'bg-blue-100 text-blue-700'
                          : item.category === '대출/금융'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold">{item.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">{item.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>신속 전화 상담: <a href="tel:010-8873-7258" className="font-bold text-blue-600 underline">010-8873-7258</a></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
