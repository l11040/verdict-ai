/**
 * 다크 테마 브랜딩 영역 컴포넌트
 * 코드 스플릿팅을 위한 별도 컴포넌트
 */
export const ParticleBackground = () => {
  return (
    <div className="flex flex-1 items-center justify-center relative overflow-hidden bg-neutral-950">
      {/* 주황색 그라데이션 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-3xl" />
      </div>
      
      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 text-center px-8 sm:px-12 max-w-2xl">
        {/* 로고 */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-8 shadow-lg shadow-primary/50 animate-in fade-in duration-300">
          <span className="text-3xl font-bold text-white">V</span>
        </div>
        
        {/* 태그라인 */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight animate-in fade-in duration-300">
          Verdict AI
        </h2>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed animate-in fade-in duration-300">
          20인의 AI 에이전트가 치열한 토론을 거쳐
        </p>
        <p className="text-base sm:text-lg text-primary-300 font-medium leading-relaxed animate-in fade-in duration-300">
          최적의 매수·매도 평결을 내리는
        </p>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed animate-in fade-in duration-300">
          개인화 투자 심의 위원회
        </p>
      </div>
    </div>
  );
};

