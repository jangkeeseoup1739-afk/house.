import { MapPin, Building2, Calendar, PhoneCall, ArrowUpRight } from 'lucide-react';
import { PropertyListing } from '../types';

interface ListingCardProps {
  listing: PropertyListing;
  onSelect: (listing: PropertyListing) => void;
  onQuickInquire: (listing: PropertyListing) => void;
}

export default function ListingCard({ listing, onSelect, onQuickInquire }: ListingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '분양중':
        return 'bg-blue-600 text-white';
      case '마감임박':
        return 'bg-rose-600 text-white animate-pulse';
      case '분양예정':
        return 'bg-amber-500 text-white';
      case '분양완료':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(listing)}>
        <img
          src={listing.imageUrl}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm ${getStatusColor(listing.status)}`}>
            {listing.status}
          </span>
          <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white">
            {listing.propertyType}
          </span>
          {listing.isHot && (
            <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-400 text-slate-950">
              추천
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>{listing.region}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 sm:space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3
              onClick={() => onSelect(listing)}
              className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
            >
              {listing.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">{listing.subtitle}</p>

          {/* Pricing & Key Numbers */}
          <div className="mt-2.5 sm:mt-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">공급 분양가</span>
              <div className="text-lg sm:text-xl font-black text-blue-600 tracking-tight">{listing.priceDisplay}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">면적/규모</span>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                약 {listing.pyeong}평형 <span className="font-normal text-slate-500">({listing.totalHouseholds})</span>
              </div>
            </div>
          </div>

          {/* Highlights tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {listing.highlights.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium"
              >
                #{item}
              </span>
            ))}
          </div>

          {/* Details list */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{listing.constructorCompany}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">입주 {listing.moveInDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onSelect(listing)}
            className="flex-1 min-h-[42px] py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>상세정보</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onQuickInquire(listing)}
            className="flex-1 min-h-[42px] py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>상담문의</span>
          </button>
        </div>
      </div>
    </div>
  );
}
