import { useState } from 'react';
import { 
  X, Plus, Edit2, Trash2, Check, RotateCcw, 
  Building2, MapPin, Maximize2, DollarSign, Tag, Settings2 
} from 'lucide-react';
import { FilterConfig } from '../types';
import { INITIAL_FILTER_CONFIG } from '../data/initialData';

export type FilterCategoryKey = 'propertyTypes' | 'regions' | 'pyeongOptions' | 'priceOptions' | 'statusOptions';

interface FilterManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FilterConfig;
  onUpdateConfig: (newConfig: FilterConfig) => void;
  initialCategory?: FilterCategoryKey;
  onItemRenamed?: (category: FilterCategoryKey, oldName: string, newName: string) => void;
  onItemDeleted?: (category: FilterCategoryKey, deletedName: string) => void;
}

export default function FilterManagementModal({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  initialCategory = 'propertyTypes',
  onItemRenamed,
  onItemDeleted
}: FilterManagementModalProps) {
  const [activeTab, setActiveTab] = useState<FilterCategoryKey>(initialCategory);
  const [newInput, setNewInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  };

  const categories: {
    key: FilterCategoryKey;
    label: string;
    icon: any;
    placeholder: string;
    description: string;
  }[] = [
    {
      key: 'propertyTypes',
      label: '매물 유형',
      icon: Building2,
      placeholder: '예: 빌라/다세대, 타운하우스, 토지',
      description: '상단 필터 버튼에 표시되는 매물 종류 (아파트, 오피스텔 등)를 추가/수정/삭제합니다.'
    },
    {
      key: 'regions',
      label: '지역 선택',
      icon: MapPin,
      placeholder: '예: 경기 부천/원미, 충남 천안, 대구 수성구',
      description: '지역 선택 드롭다운에 표시되는 시/도/구역 목록을 관리합니다.'
    },
    {
      key: 'pyeongOptions',
      label: '평수 (면적)',
      icon: Maximize2,
      placeholder: '예: 50평 이상 초대형, 15평 미만 소형',
      description: '공급/전용 면적 기준 평수 구간 옵션을 관리합니다.'
    },
    {
      key: 'priceOptions',
      label: '가격대 (분양가)',
      icon: DollarSign,
      placeholder: '예: 1억 이하 소액, 15억 이상 초고가',
      description: '분양가 및 매매가 가격대 필터 옵션을 관리합니다.'
    },
    {
      key: 'statusOptions',
      label: '분양 상태',
      icon: Tag,
      placeholder: '예: 선착순 동호지정, 사전의향서 접수중',
      description: '분양 진행 상태 단계(분양예정, 분양중 등) 옵션을 관리합니다.'
    }
  ];

  const currentCategoryInfo = categories.find((c) => c.key === activeTab)!;
  const currentList = config[activeTab] || [];

  // Add Item
  const handleAdd = () => {
    const val = newInput.trim();
    if (!val) {
      showNotice('추가할 항목 이름을 입력해주세요.');
      return;
    }
    if (currentList.includes(val)) {
      showNotice('이미 존재하는 항목입니다.');
      return;
    }

    const updatedList = [...currentList, val];
    const updatedConfig = { ...config, [activeTab]: updatedList };
    onUpdateConfig(updatedConfig);
    setNewInput('');
    showNotice(`'${val}' 항목이 추가되었습니다.`);
  };

  // Start Edit
  const handleStartEdit = (index: number, val: string) => {
    setEditingIndex(index);
    setEditingValue(val);
  };

  // Save Edit
  const handleSaveEdit = (index: number) => {
    const trimmed = editingValue.trim();
    if (!trimmed) {
      showNotice('항목 이름을 입력해주세요.');
      return;
    }
    const oldName = currentList[index];
    if (trimmed === oldName) {
      setEditingIndex(null);
      return;
    }
    if (currentList.includes(trimmed)) {
      showNotice('이미 존재하는 이름입니다.');
      return;
    }

    const updatedList = [...currentList];
    updatedList[index] = trimmed;
    const updatedConfig = { ...config, [activeTab]: updatedList };
    onUpdateConfig(updatedConfig);

    if (onItemRenamed) {
      onItemRenamed(activeTab, oldName, trimmed);
    }

    setEditingIndex(null);
    showNotice(`'${oldName}'이(가) '${trimmed}'(으)로 수정되었습니다.`);
  };

  // Delete Item
  const handleDelete = (index: number, val: string) => {
    if (val === '전체') {
      showNotice("'전체' 항목은 기본 필터 기준이므로 삭제할 수 없습니다.");
      return;
    }

    const updatedList = currentList.filter((_, i) => i !== index);
    const updatedConfig = { ...config, [activeTab]: updatedList };
    onUpdateConfig(updatedConfig);

    if (onItemDeleted) {
      onItemDeleted(activeTab, val);
    }

    showNotice(`'${val}' 항목이 삭제되었습니다.`);
  };

  // Reset category or all to defaults
  const handleResetDefaults = () => {
    onUpdateConfig(INITIAL_FILTER_CONFIG);
    showNotice('기본 필터 옵션으로 복원되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">필터 항목 설정 (추가·수정·삭제)</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">
                매물 유형, 지역, 평수, 가격대, 분양 상태 옵션을 자유롭게 편집하세요.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        {message && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 sm:px-6 py-2 text-xs font-semibold text-blue-700 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-2.5 sm:px-4 pt-2 gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.key;
            const count = (config[cat.key] || []).length;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveTab(cat.key);
                  setEditingIndex(null);
                  setNewInput('');
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap border-t border-x shrink-0 min-h-[40px] ${
                  isActive
                    ? 'bg-white text-blue-600 border-slate-200 -mb-px shadow-xs'
                    : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-xs">
          {/* Active Category Description */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-700 space-y-1">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <span>{currentCategoryInfo.label} 편집</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {currentCategoryInfo.description}
            </p>
          </div>

          {/* New Item Input Bar */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">
              새 {currentCategoryInfo.label} 항목 추가
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder={currentCategoryInfo.placeholder}
                className="flex-1 px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white min-h-[42px]"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 min-h-[42px]"
              >
                <Plus className="w-4 h-4" />
                <span>항목 추가</span>
              </button>
            </div>
          </div>

          {/* Current Items List with Edit/Delete */}
          <div className="space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">
                현재 등록된 항목 ({currentList.length}개)
              </label>
              <span className="text-[10px] sm:text-[11px] text-slate-400">
                연필 버튼(수정) · 휴지통 버튼(삭제)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentList.map((item, idx) => {
                const isEditing = editingIndex === idx;
                const isAll = item === '전체';

                if (isEditing) {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border-2 border-amber-400 shadow-xs"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(idx);
                          if (e.key === 'Escape') setEditingIndex(null);
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg border border-amber-300 text-xs bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(idx)}
                        className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        title="수정 완료"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingIndex(null)}
                        className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
                        title="취소"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isAll
                        ? 'bg-slate-100/70 border-slate-200 text-slate-500'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs truncate max-w-[170px]">
                        {item}
                      </span>
                      {isAll && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/80 px-1.5 py-0.2 rounded">
                          기본 고정
                        </span>
                      )}
                    </div>

                    {!isAll && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(idx, item)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="이름 수정"
                          aria-label="이름 수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(idx, item)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="항목 삭제"
                          aria-label="항목 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본 필터 옵션으로 전체 복원</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
