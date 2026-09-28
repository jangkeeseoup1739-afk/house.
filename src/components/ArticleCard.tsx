import { BookOpen, Eye, Calendar, Tag, ChevronRight, Sparkles } from 'lucide-react';
import { ArticleContent } from '../types';

interface ArticleCardProps {
  article: ArticleContent;
  onSelect: (article: ArticleContent) => void;
}

export default function ArticleCard({ article, onSelect }: ArticleCardProps) {
  const isAIGenerated = article.author?.includes('AI') || article.subCategory?.includes('AI') || article.id?.startsWith('art-ai-');

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case '대출·금융':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '청약':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '세금':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case '지식산업센터':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case '오피스텔':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      onClick={() => onSelect(article)}
      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(article.category)}`}>
              {article.category} {article.subCategory && `· ${article.subCategory}`}
            </span>
            {isAIGenerated && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                AI 분석
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {article.views.toLocaleString()}회
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
          {article.summary}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{article.date}</span>
        </div>

        <div className="flex items-center gap-1 text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
          <span>전문 읽기</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
