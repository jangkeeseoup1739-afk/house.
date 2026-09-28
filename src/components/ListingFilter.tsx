import { useState } from 'react';
import { 
  Search, RotateCcw, SlidersHorizontal, Settings2, Plus, 
  MapPin, Maximize2, DollarSign, Tag 
} from 'lucide-react';
import { FilterState, FilterConfig } from '../types';
import FilterManagementModal, { FilterCategoryKey } from './FilterManagementModal';

interface ListingFilterProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  config: FilterConfig;
  onUpdateConfig?: (config: FilterConfig) => void;
  totalCount: number;
}

export default function ListingFilter({
  filter,
  onChange,
  config,
  onUpdateConfig,
  totalCount
}: ListingFilterProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [manageInitialCategory, setManageInitialCategory] = useState<FilterCategoryKey>('propertyTypes');

  const isFiltered =
    filter.keyword !== '' ||
    filter.propertyType !== '전체' ||
    filter.region !== '전체' ||
    filter.pyeongGroup !== '전체' ||
    filter.priceGroup !== '전체' ||
    filter.status !== '전체';

  const handleReset = () => {
    onChange({
      keyword: '',
      propertyType: '전체',
      region: '전체',
      pyeongGroup: '전체',
      priceGroup: '전체',
      status: '전체'
    });
  };

  const openManager = (category: FilterCategoryKey) => {
    setManageInitialCategory(category);
    setIsManageModalOpen(true);
  };

  // When an item is renamed in the manager
  const handleItemRenamed = (category: FilterCategoryKey, oldName: string, newName: string) => {
    if (category === 'propertyTypes' && filter.propertyType === oldName) {
      onChange({ ...filter, propertyType: newName });
    } else if (category === 'regions' && filter.region === oldName) {
      onChange({ ...filter, region: newName });
    } else if (category === 'pyeongOptions' && filter.pyeongGroup === oldName) {
      onChange({ ...filter, pyeongGroup: newName });
    } else if (category === 'priceOptions' && filter.priceGroup === oldName) {
      onChange({ ...filter, priceGroup: newName });
    } else if (category === 'statusOptions' && filter.status === oldName) {
      onChange({ ...filter, status: newName });
    }
  };

  // When an item is deleted in the manager
  const handleItemDeleted = (category: FilterCategoryKey, deletedName: string) => {
    if (category === 'propertyTypes' && filter.propertyType === deletedName) {
      onChange({ ...filter, propertyType: '전체' });
    } else if (category === 'regions' && filter.region === deletedName) {
      onChange({ ...filter, region: '전체' });
    } else if (category === 'pyeongOptions' && filter.pyeongGroup === deletedName) {
      onChange({ ...filter, pyeongGroup: '전체' });
    } else if (category === 'priceOptions' && filter.priceGroup === deletedName) {
      onChange({ ...filter, priceGroup: '전체' });
    } else if (category === 'statusOptions' && filter.status === deletedName) {
      onChange({ ...filter, status: '전체' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="단지명, 시공사(자이, 래미안 등), 지역명 검색..."
            value={filter.keyword}
            onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 bg-slate-50/70 hover:bg-white transition-colors"
          />
          {filter.keyword && (
            <button
              type="button"
              onClick={() => onChange({ ...filter, keyword: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              title="검색어 지우기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Results count, Reset, and Filter Item Management Button */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 px-1 text-xs sm:text-sm">
            검색 결과 <span className="text-blue-600 font-bold">{totalCount}</span>개
          </span>

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {isFiltered && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>초기화</span>
              </button>
            )}

            {/* Direct Filter Management Button */}
            {onUpdateConfig && (
              <button
                type="button"
                onClick={() => openManager('propertyTypes')}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 font-bold text-xs transition-all shadow-2xs hover:scale-102"
                title="사진 속 매물 유형, 지역, 평수, 가격대, 분양 상태 항목을 추가/수정/삭제합니다"
              >
                <Settings2 className="w-3.5 h-3.5 text-blue-600" />
                <span>필터 항목 설정</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Property Type Pills Row */}
      <div className="pt-1">
        <div className="flex items-center justify-between gap-2 mb-2 text-xs sm:text-sm font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>매물 유형</span>
          </div>
          
          {onUpdateConfig && (
            <button
              type="button"
              onClick={() => openManager('propertyTypes')}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <Plus className="w-3 h-3" />
              <span>유형 추가/관리</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
          {config.propertyTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...filter, propertyType: type })}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[38px] flex items-center shrink-0 ${
                filter.propertyType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Filters: Region, Pyeong, Price, Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-3 border-t border-slate-100 text-xs sm:text-sm">
        {/* Region */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">지역 선택</span>
            </label>
            {onUpdateConfig && (
              <button
                type="button"
                onClick={() => openManager('regions')}
                className="text-[11px] sm:text-xs text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                title="지역 추가/수정/삭제"
              >
                <Plus className="w-3 h-3" />
                <span>관리</span>
              </button>
            )}
          </div>
          <select
            value={filter.region}
            onChange={(e) => onChange({ ...filter, region: e.target.value })}
            className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
          >
            {config.regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>

        {/* Pyeong */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1 text-xs sm:text-sm">
              <Maximize2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">평수 (면적)</span>
            </label>
            {onUpdateConfig && (
              <button
                type="button"
                onClick={() => openManager('pyeongOptions')}
                className="text-[11px] sm:text-xs text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                title="평수 옵션 추가/수정/삭제"
              >
                <Plus className="w-3 h-3" />
                <span>관리</span>
              </button>
            )}
          </div>
          <select
            value={filter.pyeongGroup}
            onChange={(e) => onChange({ ...filter, pyeongGroup: e.target.value })}
            className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
          >
            {config.pyeongOptions.map((pyeong) => (
              <option key={pyeong} value={pyeong}>
                {pyeong}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1 text-xs sm:text-sm">
              <DollarSign className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">가격대 (분양가)</span>
            </label>
            {onUpdateConfig && (
              <button
                type="button"
                onClick={() => openManager('priceOptions')}
                className="text-[11px] sm:text-xs text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                title="가격대 옵션 추가/수정/삭제"
              >
                <Plus className="w-3 h-3" />
                <span>관리</span>
              </button>
            )}
          </div>
          <select
            value={filter.priceGroup}
            onChange={(e) => onChange({ ...filter, priceGroup: e.target.value })}
            className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
          >
            {config.priceOptions.map((pr) => (
              <option key={pr} value={pr}>
                {pr}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1 text-xs sm:text-sm">
              <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">분양 상태</span>
            </label>
            {onUpdateConfig && (
              <button
                type="button"
                onClick={() => openManager('statusOptions')}
                className="text-[11px] sm:text-xs text-blue-600 hover:underline flex items-center gap-0.5 shrink-0"
                title="분양 상태 옵션 추가/수정/삭제"
              >
                <Plus className="w-3 h-3" />
                <span>관리</span>
              </button>
            )}
          </div>
          <select
            value={filter.status}
            onChange={(e) => onChange({ ...filter, status: e.target.value })}
            className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
          >
            {config.statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Management Modal */}
      {onUpdateConfig && (
        <FilterManagementModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          config={config}
          onUpdateConfig={onUpdateConfig}
          initialCategory={manageInitialCategory}
          onItemRenamed={handleItemRenamed}
          onItemDeleted={handleItemDeleted}
        />
      )}
    </div>
  );
}
