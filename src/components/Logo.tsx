interface LogoProps {
  variant?: 'full' | 'compact' | 'symbol';
  className?: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export default function Logo({ variant = 'full', className = '', theme = 'light', size = 'md' }: LogoProps) {
  const isDark = theme === 'dark';
  const primaryText = isDark ? '#FFFFFF' : '#0B2038';
  const subText = isDark ? '#CBD5E1' : '#1E293B';
  const captionText = isDark ? '#94A3B8' : '#64748B';
  const goldColor = '#C89745';
  const navyAccent = '#15325B';

  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-auto h-9 sm:h-10 ${className}`}
        aria-label="HOUSE & ASSET Logo Symbol"
      >
        <defs>
          <linearGradient id="goldGradSymbol" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFB362" />
            <stop offset="50%" stopColor="#C4943E" />
            <stop offset="100%" stopColor="#A47427" />
          </linearGradient>
          <linearGradient id="navyGradSymbol" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B3B68" />
            <stop offset="100%" stopColor="#0B1E38" />
          </linearGradient>
        </defs>

        {/* --- Letter H (Navy) --- */}
        {/* Left column of H */}
        <path
          d="M 12 18 L 36 18 L 36 102 L 12 102 Z"
          fill="url(#navyGradSymbol)"
        />
        {/* Serifs on left column top & bottom */}
        <path d="M 8 18 L 40 18 L 40 23 L 8 23 Z" fill="url(#navyGradSymbol)" />
        <path d="M 8 97 L 40 97 L 40 102 L 8 102 Z" fill="url(#navyGradSymbol)" />

        {/* Right column of H */}
        <path
          d="M 68 18 L 86 18 L 86 102 L 68 102 Z"
          fill="url(#navyGradSymbol)"
        />
        <path d="M 64 18 L 90 18 L 90 23 L 64 23 Z" fill="url(#navyGradSymbol)" />
        <path d="M 64 97 L 90 97 L 90 102 L 64 102 Z" fill="url(#navyGradSymbol)" />

        {/* House roof integrated into H */}
        <path
          d="M 50 36 L 80 57 L 74 61 L 50 44 L 26 61 L 20 57 Z"
          fill="url(#goldGradSymbol)"
        />
        {/* House body/windows */}
        <rect x="40" y="60" width="8" height="8" rx="1" fill="url(#goldGradSymbol)" />
        <rect x="52" y="60" width="8" height="8" rx="1" fill="url(#goldGradSymbol)" />
        <rect x="40" y="72" width="8" height="8" rx="1" fill="url(#goldGradSymbol)" />
        <rect x="52" y="72" width="8" height="8" rx="1" fill="url(#goldGradSymbol)" />

        {/* --- Letter A (Gold) with right sweep --- */}
        {/* Peak of A */}
        <path
          d="M 100 20 L 132 102 L 115 102 L 100 58 L 85 102 L 70 102 Z"
          fill="url(#goldGradSymbol)"
        />
        {/* Elegant Swoosh across A */}
        <path
          d="M 72 88 Q 112 60 152 74 Q 115 69 82 92 Z"
          fill="url(#goldGradSymbol)"
        />

        {/* Skyline / Buildings on upper right */}
        <path d="M 126 34 L 136 24 L 136 60 L 126 60 Z" fill="#2E4A71" />
        <path d="M 138 22 L 148 30 L 148 60 L 138 60 Z" fill="#1C3558" />
        <path d="M 150 38 L 157 44 L 157 60 L 150 60 Z" fill="#4B668D" />
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Vector Mark */}
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 sm:h-12 w-auto shrink-0"
        >
          <defs>
            <linearGradient id="goldGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFB362" />
              <stop offset="50%" stopColor="#C4943E" />
              <stop offset="100%" stopColor="#A47427" />
            </linearGradient>
            <linearGradient id="navyGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B3B68" />
              <stop offset="100%" stopColor="#0B1E38" />
            </linearGradient>
          </defs>

          {/* Letter H */}
          <path d="M 12 18 L 36 18 L 36 102 L 12 102 Z" fill="url(#navyGradCompact)" />
          <path d="M 8 18 L 40 18 L 40 23 L 8 23 Z" fill="url(#navyGradCompact)" />
          <path d="M 8 97 L 40 97 L 40 102 L 8 102 Z" fill="url(#navyGradCompact)" />

          <path d="M 68 18 L 86 18 L 86 102 L 68 102 Z" fill="url(#navyGradCompact)" />
          <path d="M 64 18 L 90 18 L 90 23 L 64 23 Z" fill="url(#navyGradCompact)" />
          <path d="M 64 97 L 90 97 L 90 102 L 64 102 Z" fill="url(#navyGradCompact)" />

          {/* House icon inside H */}
          <path d="M 50 36 L 80 57 L 74 61 L 50 44 L 26 61 L 20 57 Z" fill="url(#goldGradCompact)" />
          <rect x="40" y="60" width="8" height="8" rx="1" fill="url(#goldGradCompact)" />
          <rect x="52" y="60" width="8" height="8" rx="1" fill="url(#goldGradCompact)" />
          <rect x="40" y="72" width="8" height="8" rx="1" fill="url(#goldGradCompact)" />
          <rect x="52" y="72" width="8" height="8" rx="1" fill="url(#goldGradCompact)" />

          {/* Letter A & Swoosh */}
          <path d="M 100 20 L 132 102 L 115 102 L 100 58 L 85 102 L 70 102 Z" fill="url(#goldGradCompact)" />
          <path d="M 72 88 Q 112 60 152 74 Q 115 69 82 92 Z" fill="url(#goldGradCompact)" />

          {/* Skyline */}
          <path d="M 126 34 L 136 24 L 136 60 L 126 60 Z" fill="#2E4A71" />
          <path d="M 138 22 L 148 30 L 148 60 L 138 60 Z" fill="#1C3558" />
          <path d="M 150 38 L 157 44 L 157 60 L 150 60 Z" fill="#4B668D" />
        </svg>

        {/* Text Lockup */}
        <div className="flex flex-col justify-center select-none">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              style={{ color: primaryText }}
              className="text-base sm:text-lg font-black tracking-tight font-serif"
            >
              HOUSE <span style={{ color: goldColor }}>&</span> ASSET
            </span>
          </div>
          <span
            style={{ color: subText }}
            className="text-[10px] sm:text-[11px] font-bold tracking-widest mt-0.5"
          >
            하 우 스 앤 에 셋
          </span>
        </div>
      </div>
    );
  }

  // variant === 'full' (Complete Logo with Brand Name, Korean Title, Tagline and Sub-caption)
  const isHero = size === 'hero';

  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* 1. Monogram Symbol H & A */}
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-auto transition-all duration-300 drop-shadow-sm ${
          isHero
            ? 'h-20 sm:h-28 md:h-36 lg:h-44'
            : size === 'lg'
            ? 'h-18 sm:h-22 md:h-26'
            : 'h-14 sm:h-16'
        }`}
        aria-label="HOUSE & ASSET Logo Symbol"
      >
        <defs>
          <linearGradient id="goldGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFB362" />
            <stop offset="50%" stopColor="#C4943E" />
            <stop offset="100%" stopColor="#A47427" />
          </linearGradient>
          <linearGradient id="navyGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B3B68" />
            <stop offset="100%" stopColor="#0B1E38" />
          </linearGradient>
        </defs>

        {/* H Column Left */}
        <path d="M 12 18 L 36 18 L 36 102 L 12 102 Z" fill="url(#navyGradFull)" />
        <path d="M 8 18 L 40 18 L 40 23 L 8 23 Z" fill="url(#navyGradFull)" />
        <path d="M 8 97 L 40 97 L 40 102 L 8 102 Z" fill="url(#navyGradFull)" />

        {/* H Column Right */}
        <path d="M 68 18 L 86 18 L 86 102 L 68 102 Z" fill="url(#navyGradFull)" />
        <path d="M 64 18 L 90 18 L 90 23 L 64 23 Z" fill="url(#navyGradFull)" />
        <path d="M 64 97 L 90 97 L 90 102 L 64 102 Z" fill="url(#navyGradFull)" />

        {/* House shape */}
        <path d="M 50 36 L 80 57 L 74 61 L 50 44 L 26 61 L 20 57 Z" fill="url(#goldGradFull)" />
        <rect x="40" y="60" width="8" height="8" rx="1" fill="url(#goldGradFull)" />
        <rect x="52" y="60" width="8" height="8" rx="1" fill="url(#goldGradFull)" />
        <rect x="40" y="72" width="8" height="8" rx="1" fill="url(#goldGradFull)" />
        <rect x="52" y="72" width="8" height="8" rx="1" fill="url(#goldGradFull)" />

        {/* A letter */}
        <path d="M 100 20 L 132 102 L 115 102 L 100 58 L 85 102 L 70 102 Z" fill="url(#goldGradFull)" />
        {/* Elegant Swoosh */}
        <path d="M 72 88 Q 112 60 152 74 Q 115 69 82 92 Z" fill="url(#goldGradFull)" />

        {/* Skyline */}
        <path d="M 126 34 L 136 24 L 136 60 L 126 60 Z" fill="#2E4A71" />
        <path d="M 138 22 L 148 30 L 148 60 L 138 60 Z" fill="#1C3558" />
        <path d="M 150 38 L 157 44 L 157 60 L 150 60 Z" fill="#4B668D" />
      </svg>

      {/* 2. Primary English Title */}
      <h2
        style={{ color: primaryText }}
        className={`font-black tracking-tight font-serif transition-all duration-300 ${
          isHero
            ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-3 sm:mt-5 md:mt-6'
            : size === 'lg'
            ? 'text-2xl sm:text-4xl mt-3'
            : 'text-2xl sm:text-3xl font-extrabold mt-2'
        }`}
      >
        HOUSE <span style={{ color: goldColor }}>&</span> ASSET
      </h2>

      {/* 3. Korean Subtitle with rule lines */}
      <div
        className={`flex items-center gap-2 sm:gap-4 w-full justify-center transition-all duration-300 ${
          isHero
            ? 'max-w-xs sm:max-w-md md:max-w-2xl my-2 sm:my-3.5 md:my-5'
            : size === 'lg'
            ? 'max-w-sm sm:max-w-md my-2'
            : 'max-w-xs my-1.5'
        }`}
      >
        <span className={`h-[1px] sm:h-[1.5px] flex-1 ${isDark ? 'bg-amber-500/40' : 'bg-gradient-to-r from-transparent via-amber-600/40 to-amber-600/70'}`}></span>
        <span
          style={{ color: subText }}
          className={`font-black tracking-[0.25em] sm:tracking-[0.45em] md:tracking-[0.55em] whitespace-nowrap transition-all duration-300 ${
            isHero
              ? 'text-xs sm:text-base md:text-xl lg:text-2xl'
              : size === 'lg'
              ? 'text-xs sm:text-base'
              : 'text-xs sm:text-sm'
          }`}
        >
          하 우 스 앤 에 셋
        </span>
        <span className={`h-[1px] sm:h-[1.5px] flex-1 ${isDark ? 'bg-amber-500/40' : 'bg-gradient-to-l from-transparent via-amber-600/40 to-amber-600/70'}`}></span>
      </div>

      {/* 4. Korean Slogan */}
      <p
        style={{ color: subText }}
        className={`font-semibold tracking-tight transition-all duration-300 ${
          isHero
            ? 'text-sm sm:text-lg md:text-2xl lg:text-3xl mt-1 sm:mt-2 text-slate-800'
            : size === 'lg'
            ? 'text-xs sm:text-base mt-1'
            : 'text-xs sm:text-sm font-medium mt-1'
        }`}
      >
        부동산과 자산을 쉽게 이해하는 곳
      </p>

      {/* 5. Bottom English Sub-caption */}
      <p
        style={{ color: captionText }}
        className={`uppercase font-semibold tracking-wider transition-all duration-300 ${
          isHero
            ? 'text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.18em] sm:tracking-[0.3em] md:tracking-[0.4em] mt-2.5 sm:mt-4 md:mt-6 text-slate-500'
            : size === 'lg'
            ? 'text-[10px] sm:text-xs tracking-[0.2em] mt-2'
            : 'text-[10px] tracking-[0.25em] mt-2'
        }`}
      >
        REAL ESTATE &middot; FINANCE &middot; YOUR BETTER TOMORROW
      </p>
    </div>
  );
}
