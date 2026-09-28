import { X, MapPin, Building2, Calendar, PhoneCall, Check, ExternalLink, Sparkles } from 'lucide-react';
import { PropertyListing } from '../types';

interface ListingDetailModalProps {
  listing: PropertyListing | null;
  onClose: () => void;
  onOpenConsultation: (listing: PropertyListing) => void;
}

export default function ListingDetailModal({
  listing,
  onClose,
  onOpenConsultation
}: ListingDetailModalProps) {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
              {listing.status}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
              {listing.propertyType}
            </span>
            <span className="text-xs text-slate-500 font-medium">단지 고유코드 #{listing.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
          {/* Main Visual */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-md bg-slate-900">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                {listing.region} 프리미엄
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold leading-snug">{listing.title}</h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2">{listing.subtitle}</p>
            </div>
          </div>

          {/* Pricing & Key Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 font-medium">분양 공급가</span>
              <div className="text-base sm:text-lg font-black text-blue-600 mt-0.5">{listing.priceDisplay}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">공급 평형</span>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">약 {listing.pyeong}평형</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">총 세대 / 호실</span>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{listing.totalHouseholds}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">입주 예정일</span>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">{listing.moveInDate}</div>
            </div>
          </div>

          {/* Detailed Info Table */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5 sm:mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>사업개요 및 상세스펙</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-white">
                <div className="p-3 flex justify-between border-b border-slate-100">
                  <span className="text-slate-500">시공 / 시행</span>
                  <span className="font-semibold text-slate-900">{listing.constructorCompany}</span>
                </div>
                <div className="p-3 flex justify-between border-b border-slate-100">
                  <span className="text-slate-500">사업지 위치</span>
                  <span className="font-semibold text-slate-900 text-right">{listing.address}</span>
                </div>
                <div className="p-3 flex justify-between border-b border-slate-100 sm:border-b-0">
                  <span className="text-slate-500">매물 유형</span>
                  <span className="font-semibold text-slate-900">{listing.propertyType}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">분양 상태</span>
                  <span className="font-semibold text-blue-600">{listing.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights & Premium */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5 sm:mb-3">단지 핵심 프리미엄</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {listing.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">상세 안내</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Floor Plans Available */}
          {listing.floorPlanTypes && listing.floorPlanTypes.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">공급 타입 안내</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
                {listing.floorPlanTypes.map((type, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Call To Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 w-full sm:w-auto justify-center sm:justify-start">
            <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
            <span>분양 직통 문의:</span>
            <a href="tel:010-8873-7258" className="font-extrabold text-blue-700 hover:underline text-sm">
              010-8873-7258
            </a>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:010-8873-7258"
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all min-h-[44px]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>전화연결</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation(listing);
              }}
              className="flex-1 sm:flex-initial px-5 py-3 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <span>1:1 상담 예약 접수</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
