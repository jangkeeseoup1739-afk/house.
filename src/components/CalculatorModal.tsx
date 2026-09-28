import { useState } from 'react';
import { X, Calculator, ShieldCheck, HelpCircle } from 'lucide-react';
import { CURRENT_YEAR } from '../utils/date';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'tax' | 'brokerage';
}

export default function CalculatorModal({ isOpen, onClose, defaultTab = 'tax' }: CalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<'tax' | 'brokerage'>(defaultTab);

  // Tax Calculator State
  const [taxPropertyType, setTaxPropertyType] = useState<'apt' | 'officetel'>('apt');
  const [houseCount, setHouseCount] = useState<number>(1);
  const [isAdjustedArea, setIsAdjustedArea] = useState<boolean>(false);
  const [priceInManwon, setPriceInManwon] = useState<number>(75000); // 7억 5,000만원
  const [isOver85, setIsOver85] = useState<boolean>(false);
  const [isFirstHome, setIsFirstHome] = useState<boolean>(false);

  // Brokerage Calculator State
  const [dealType, setDealType] = useState<'buy' | 'jeonse' | 'monthly'>('buy');
  const [brokerPropertyType, setBrokerPropertyType] = useState<'house' | 'officetel' | 'commercial'>('house');
  const [dealAmountManwon, setDealAmountManwon] = useState<number>(60000); // 6억원
  const [monthlyRentManwon, setMonthlyRentManwon] = useState<number>(100); // 100만원

  if (!isOpen) return null;

  // --- Calculate Tax ---
  const calculateTax = () => {
    const priceWon = priceInManwon * 10000;
    if (priceWon <= 0) return { tax: 0, eduTax: 0, ruralTax: 0, discount: 0, total: 0, rate: 0 };

    if (taxPropertyType === 'officetel') {
      const tax = priceWon * 0.04;
      const eduTax = priceWon * 0.004;
      const ruralTax = priceWon * 0.002;
      return {
        tax,
        eduTax,
        ruralTax,
        discount: 0,
        total: tax + eduTax + ruralTax,
        rate: 4.6
      };
    }

    // Apartment / House Tax calculation
    let baseRate = 0.01;
    if (houseCount === 1) {
      if (priceInManwon <= 60000) {
        baseRate = 0.01;
      } else if (priceInManwon <= 90000) {
        // (취득가액 * 2/3억원 - 3) * 1%
        baseRate = ((priceInManwon / 10000) * (2 / 3) - 3) / 100;
      } else {
        baseRate = 0.03;
      }
    } else if (houseCount === 2) {
      baseRate = isAdjustedArea ? 0.08 : (priceInManwon <= 60000 ? 0.01 : priceInManwon <= 90000 ? ((priceInManwon / 10000) * (2 / 3) - 3) / 100 : 0.03);
    } else if (houseCount === 3) {
      baseRate = isAdjustedArea ? 0.12 : 0.08;
    } else {
      baseRate = 0.12;
    }

    let tax = priceWon * baseRate;
    let eduTaxRate = baseRate <= 0.03 ? baseRate * 0.1 : 0.004;
    let eduTax = priceWon * eduTaxRate;
    let ruralTax = isOver85 ? (baseRate >= 0.08 ? priceWon * 0.01 : priceWon * 0.002) : 0;

    let discount = 0;
    if (isFirstHome && houseCount === 1 && priceInManwon <= 120000) {
      // 생애최초 200만원 한도 감면
      discount = Math.min(2000000, tax);
      tax = tax - discount;
    }

    return {
      tax: Math.round(tax),
      eduTax: Math.round(eduTax),
      ruralTax: Math.round(ruralTax),
      discount: Math.round(discount),
      total: Math.round(tax + eduTax + ruralTax),
      rate: Number((baseRate * 100).toFixed(2))
    };
  };

  // --- Calculate Brokerage ---
  const calculateBrokerage = () => {
    let effectiveAmountWon = dealAmountManwon * 10000;
    if (dealType === 'monthly') {
      const converted = (dealAmountManwon + monthlyRentManwon * 100) * 10000;
      if (converted < 50000000) {
        effectiveAmountWon = (dealAmountManwon + monthlyRentManwon * 70) * 10000;
      } else {
        effectiveAmountWon = converted;
      }
    }

    let rate = 0.004;
    let limitWon = 0;

    if (brokerPropertyType === 'house') {
      if (dealType === 'buy') {
        if (effectiveAmountWon < 50000000) {
          rate = 0.006;
          limitWon = 250000;
        } else if (effectiveAmountWon < 200000000) {
          rate = 0.005;
          limitWon = 800000;
        } else if (effectiveAmountWon < 900000000) {
          rate = 0.004;
        } else if (effectiveAmountWon < 1200000000) {
          rate = 0.005;
        } else if (effectiveAmountWon < 1500000000) {
          rate = 0.006;
        } else {
          rate = 0.007;
        }
      } else {
        // 임대차 (전세/월세)
        if (effectiveAmountWon < 50000000) {
          rate = 0.005;
          limitWon = 200000;
        } else if (effectiveAmountWon < 100000000) {
          rate = 0.004;
          limitWon = 300000;
        } else if (effectiveAmountWon < 900000000) {
          rate = 0.003;
        } else if (effectiveAmountWon < 1200000000) {
          rate = 0.004;
        } else if (effectiveAmountWon < 1500000000) {
          rate = 0.005;
        } else {
          rate = 0.006;
        }
      }
    } else if (brokerPropertyType === 'officetel') {
      rate = dealType === 'buy' ? 0.005 : 0.004;
    } else {
      // 상가/업무/지식산업센터
      rate = 0.009;
    }

    let fee = effectiveAmountWon * rate;
    if (limitWon > 0 && fee > limitWon) {
      fee = limitWon;
    }

    const vat = fee * 0.1;
    return {
      standardAmountWon: effectiveAmountWon,
      ratePercent: (rate * 100).toFixed(2),
      fee: Math.round(fee),
      vat: Math.round(vat),
      totalFee: Math.round(fee + vat)
    };
  };

  const taxResult = calculateTax();
  const brokerResult = calculateBrokerage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{CURRENT_YEAR} 부동산 실전 계산기</h2>
              <p className="text-xs text-slate-500">최신 법정 세율 및 상한요율 기준 자동 산출</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('tax')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'tax'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            아파트·오피스텔 취득세 계산기
          </button>
          <button
            onClick={() => setActiveTab('brokerage')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'brokerage'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            부동산 중개수수료(복비) 계산기
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'tax' ? (
            <div className="space-y-5">
              {/* Type Select */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTaxPropertyType('apt')}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    taxPropertyType === 'apt'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  아파트 / 단독주택 (1~12%)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxPropertyType('officetel')}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    taxPropertyType === 'officetel'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  오피스텔 (4.6% 단일)
                </button>
              </div>

              {/* Price Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    취득가액 (매매대금)
                  </label>
                  <span className="text-sm font-bold text-blue-600">
                    {(priceInManwon / 10000).toFixed(1)}억 ({priceInManwon.toLocaleString()}만원)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="5000"
                    max="300000"
                    step="5000"
                    value={priceInManwon}
                    onChange={(e) => setPriceInManwon(Number(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                  {[30000, 60000, 90000, 120000, 150000, 200000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPriceInManwon(amt)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                        priceInManwon === amt
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {amt / 10000}억
                    </button>
                  ))}
                </div>
              </div>

              {taxPropertyType === 'apt' && (
                <>
                  {/* House Count */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                      취득 후 보유 주택 수
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setHouseCount(count)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            houseCount === count
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {count === 4 ? '4주택 이상' : `${count}주택`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAdjustedArea}
                        onChange={(e) => setIsAdjustedArea(e.target.checked)}
                        className="rounded text-blue-600 accent-blue-600"
                      />
                      <span>조정대상지역 소재</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isOver85}
                        onChange={(e) => setIsOver85(e.target.checked)}
                        className="rounded text-blue-600 accent-blue-600"
                      />
                      <span>전용 85㎡ 초과 (대형)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFirstHome}
                        onChange={(e) => setIsFirstHome(e.target.checked)}
                        className="rounded text-blue-600 accent-blue-600"
                      />
                      <span>생애최초 주택구입</span>
                    </label>
                  </div>
                </>
              )}

              {/* Result Card */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex justify-between items-baseline border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-400">총 예상 납부 세액</span>
                    <div className="text-2xl font-bold text-amber-400">
                      {taxResult.total.toLocaleString()}원
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">기본 취득세율</span>
                    <div className="text-sm font-semibold text-slate-200">{taxResult.rate}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 pt-1">
                  <div>
                    <div className="text-slate-400">취득세</div>
                    <div className="font-semibold text-white">{taxResult.tax.toLocaleString()}원</div>
                  </div>
                  <div>
                    <div className="text-slate-400">지방교육세</div>
                    <div className="font-semibold text-white">{taxResult.eduTax.toLocaleString()}원</div>
                  </div>
                  <div>
                    <div className="text-slate-400">농어촌특별세</div>
                    <div className="font-semibold text-white">{taxResult.ruralTax.toLocaleString()}원</div>
                  </div>
                  <div>
                    <div className="text-slate-400">생애최초 감면</div>
                    <div className="font-semibold text-emerald-400">-{taxResult.discount.toLocaleString()}원</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Brokerage Tab */}
              <div className="grid grid-cols-3 gap-2">
                {(['buy', 'jeonse', 'monthly'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDealType(type)}
                    className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      dealType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'buy' ? '매매 / 교환' : type === 'jeonse' ? '전세' : '월세'}
                  </button>
                ))}
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">부동산 유형</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'house', label: '주택(아파트·빌라)' },
                    { id: 'officetel', label: '주거용 오피스텔' },
                    { id: 'commercial', label: '상가·토지·지산' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBrokerPropertyType(item.id as any)}
                      className={`p-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        brokerPropertyType === item.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deal Amount */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    {dealType === 'monthly' ? '보증금' : '거래 금액'}
                  </label>
                  <span className="text-sm font-bold text-blue-600">
                    {(dealAmountManwon / 10000).toFixed(1)}억 ({dealAmountManwon.toLocaleString()}만원)
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="200000"
                  step="2000"
                  value={dealAmountManwon}
                  onChange={(e) => setDealAmountManwon(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {dealType === 'monthly' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-800">월세액</label>
                    <span className="text-sm font-bold text-blue-600">
                      {monthlyRentManwon.toLocaleString()}만원
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={monthlyRentManwon}
                    onChange={(e) => setMonthlyRentManwon(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Brokerage Result */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex justify-between items-baseline border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-400">총 중개보수 (부가세 10% 포함)</span>
                    <div className="text-2xl font-bold text-amber-400">
                      {brokerResult.totalFee.toLocaleString()}원
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">법정 상한요율</span>
                    <div className="text-sm font-semibold text-slate-200">
                      {brokerResult.ratePercent}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 pt-1">
                  <div>
                    <div className="text-slate-400">산정 기준금액</div>
                    <div className="font-semibold text-white">
                      {(brokerResult.standardAmountWon / 10000).toLocaleString()}만원
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">순수 중개수수료</div>
                    <div className="font-semibold text-white">
                      {brokerResult.fee.toLocaleString()}원
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">부가가치세 (10%)</div>
                    <div className="font-semibold text-white">
                      {brokerResult.vat.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">실제 거래 시 필수 참고사항</p>
              <p className="text-blue-800/90 mt-0.5">
                산출된 결과는 현행 법령 기준의 예상치이며, 개인별 다주택 특례, 임대사업자 등록 여부 및 중개인과의 실협의에 따라 차이가 있을 수 있습니다. 맞춤형 상세 상담은 직통 유선(010-8873-7258)으로 문의바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="tel:010-8873-7258"
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            세무·금융 원스톱 상담: <span className="font-bold text-blue-700 underline">010-8873-7258</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
