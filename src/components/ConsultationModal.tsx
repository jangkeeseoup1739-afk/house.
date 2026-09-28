import { useState } from 'react';
import { X, PhoneCall, CheckCircle2, Clock, MapPin, User, MessageSquare, Mail } from 'lucide-react';
import { CURRENT_YEAR } from '../utils/date';
import { ConsultationInquiry } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inquiry: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>) => void;
  initialPropertyTitle?: string;
  initialCategory?: string;
}

export default function ConsultationModal({
  isOpen,
  onClose,
  onSubmit,
  initialPropertyTitle,
  initialCategory = '신규분양'
}: ConsultationModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [interestRegion, setInterestRegion] = useState('경기 동탄/화성');
  const [preferredTime, setPreferredTime] = useState('언제나 통화 가능');
  const [message, setMessage] = useState(
    initialPropertyTitle ? `[${initialPropertyTitle}] 분양가 및 잔여 호실 상세 상담 희망합니다.` : ''
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onSubmit({
      name,
      phone,
      category,
      interestRegion,
      preferredTime,
      message
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setPhone('');
      setMessage('');
      onClose();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>신속 1:1 부동산 맞춤 상담</span>
          </div>
          <h2 className="text-xl font-bold">전문가 상담 및 매물 상세 문의</h2>
          <p className="text-xs text-slate-300 mt-1">
            담당 수석 컨설턴트 직통 연결: <a href="tel:010-8873-7258" className="font-bold text-amber-300 hover:underline">010-8873-7258</a>
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">상담 신청이 정상 접수되었습니다</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                기재해주신 연락처({phone})로 전문 상담원이 신속히 연락드리겠습니다.<br />
                긴급 문의는 직통 번호 <a href="tel:010-8873-7258" className="font-bold text-blue-600 underline">010-8873-7258</a>로 전화 주시면 즉시 연결됩니다.
              </p>
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col items-center justify-center gap-1.5">
                <span className="text-[11px] text-slate-400">대표 이메일(jangkeeseoup1739@gmail.com) 전송 연동</span>
                <a
                  href={`mailto:jangkeeseoup1739@gmail.com?subject=%5B%EB%B6%80%EB%8F%99%EC%82%B0%20%EC%83%81%EB%8B%B4%EC%A0%91%EC%88%98%5D%20${encodeURIComponent(name)}%20%EA%B3%A0%EA%B0%9D%EB%8B%98%20(${encodeURIComponent(phone)})&body=%5B%EA%B3%A0%EA%B0%9D%20%EC%83%81%EB%8B%B4%20%EC%A0%91%EC%88%98%20%EB%82%B4%EC%9A%A9%5D%0A-%20%EC%84%B1%ED%95%A8%3A%20${encodeURIComponent(name)}%0A-%20%EC%97%B0%EB%9D%BD%EC%B2%98%3A%20${encodeURIComponent(phone)}%0A-%20%EC%83%81%EB%8B%B4%EB%B6%84%EC%95%BC%3A%20${encodeURIComponent(category)}%0A-%20%EA%B4%80%EC%8B%AC%EC%A7%80%EC%97%AD%3A%20${encodeURIComponent(interestRegion)}%0A-%20%ED%9D%AC%EB%A7%9D%EC%8B%9C%EA%B0%84%3A%20${encodeURIComponent(preferredTime)}%0A-%20%EB%AC%B8%EC%9D%98%EB%82%B4%EC%9A%A9%3A%20${encodeURIComponent(message || '상세문의 없음')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors border border-indigo-200"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>대표 메일(jangkeeseoup1739@gmail.com)로 메일 바로 보내기</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* Quick Call Out Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-900">전화 바로 걸기</span>
              </div>
              <a
                href="tel:010-8873-7258"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
              >
                010-8873-7258 연결
              </a>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-800 mb-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>고객 성함 *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-800 mb-1">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                  <span>연락처 *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Category and Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">상담 희망 분야</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="신규분양">신규 분양정보 안내</option>
                  <option value="관심고객 알림신청">관심고객 등록 및 VIP 분양 알림</option>
                  <option value="사업자대출">{CURRENT_YEAR} 사업자대출·시설자금</option>
                  <option value="청약전략">청약 1순위 조건 및 가점전략</option>
                  <option value="세금상담">아파트·오피스텔 취득세 및 세무</option>
                  <option value="지식산업센터">지식산업센터 분양·입주</option>
                  <option value="기타상담">기타 부동산 일반 문의</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-800 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>관심 지역</span>
                </label>
                <select
                  value={interestRegion}
                  onChange={(e) => setInterestRegion(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="경기 동탄/화성">경기 동탄/화성</option>
                  <option value="서울 강남/서초">서울 강남/서초</option>
                  <option value="서울 마포/용산">서울 마포/용산</option>
                  <option value="경기 판교/분당">경기 판교/분당</option>
                  <option value="경기 평택/고덕">경기 평택/고덕</option>
                  <option value="인천 송도/청라">인천 송도/청라</option>
                  <option value="부산 해운대">부산 해운대</option>
                  <option value="기타지역">기타 지역</option>
                </select>
              </div>
            </div>

            {/* Preferred Time */}
            <div>
              <label className="flex items-center gap-1 font-semibold text-slate-800 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>희망 통화 시간</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['언제나 가능', '오전 (09~12시)', '오후 (13~18시)', '야간 (18~21시)'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPreferredTime(time)}
                    className={`py-2 px-1 text-center rounded-lg border transition-all ${
                      preferredTime === time
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiry Message */}
            <div>
              <label className="flex items-center gap-1 font-semibold text-slate-800 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>상세 문의 내용 (선택)</span>
              </label>
              <textarea
                rows={3}
                placeholder="관심 평형대, 희망 입주 시기, 대출 필요 한도 등을 자유롭게 적어주시면 더욱 정밀한 1:1 상담이 가능합니다."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              무료 1:1 맞춤 상담 신청하기
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              수집된 연락처는 상담 목적 외에 이용되지 않으며 철저히 보안 유지됩니다.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
