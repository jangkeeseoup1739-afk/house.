import { X, Calendar, Eye, Share2, PhoneCall, CheckCircle2, Bookmark, Calculator } from 'lucide-react';
import { ArticleContent } from '../types';

interface ArticleDetailModalProps {
  article: ArticleContent | null;
  onClose: () => void;
  onOpenConsultation: (category: string) => void;
  onOpenCalculator?: () => void;
}

export default function ArticleDetailModal({
  article,
  onClose,
  onOpenConsultation,
  onOpenCalculator
}: ArticleDetailModalProps) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-600 text-white">
              {article.category}
            </span>
            {article.subCategory && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                {article.subCategory}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-slate-800">
          {/* Article Title & Meta */}
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-slate-400 border-b border-slate-100 pb-3 sm:pb-4">
              <span>작성: {article.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                조회 {article.views.toLocaleString()}회
              </span>
            </div>
          </div>

          {/* Lead Summary */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
            💡 <span className="font-bold">핵심 요약:</span> {article.summary}
          </div>

          {/* Main Sections */}
          <div className="space-y-5 sm:space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
            {article.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5 sm:space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-1 border-l-4 border-blue-600 pl-2.5 sm:pl-3">
                  {sec.heading}
                </h3>
                <p className="whitespace-pre-line text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {sec.body}
                </p>

                {/* Key Points list */}
                {sec.points && sec.points.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    {sec.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-slate-800">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Table */}
                {sec.table && (
                  <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <tr>
                          {sec.table.headers.map((h, i) => (
                            <th key={i} className="p-2 sm:p-2.5 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 sm:p-2.5 font-medium text-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Callout */}
                {sec.callout && (
                  <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                    {sec.callout}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-3 sm:pt-4 border-t border-slate-100">
            {article.tags.map((tag, i) => (
              <span key={i} className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                #{tag}
              </span>
            ))}
          </div>

          {/* Calculator Quick Action for Tax / Brokerage articles */}
          {(article.category === '세금' || article.title.includes('계산')) && onOpenCalculator && (
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div>
                <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>내 취득세 / 중개보수 3초 만에 직접 계산해보기</span>
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                  취득가액과 주택수만 입력하면 세액이 자동 계산됩니다.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenCalculator();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm whitespace-nowrap transition-colors min-h-[40px]"
              >
                계산기 열기
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 w-full sm:w-auto justify-center sm:justify-start">
            <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
            <span>이 분야 전문가 1:1 직통:</span>
            <a href="tel:010-8873-7258" className="font-extrabold text-blue-700 hover:underline text-sm">
              010-8873-7258
            </a>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenConsultation(article.category);
              }}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <span>전문가 상담 신청하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
