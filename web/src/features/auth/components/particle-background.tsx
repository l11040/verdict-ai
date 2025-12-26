/**
 * 다크 테마 브랜딩 영역 컴포넌트
 * 코드 스플릿팅을 위한 별도 컴포넌트
 */
export const ParticleBackground = () => {
  return (
    <div className="flex flex-1 items-center justify-center relative overflow-hidden bg-neutral-950">
      {/* 미묘한 그라데이션 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 text-center px-8 sm:px-12 max-w-2xl">
        {/* 로고 */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-800 rounded-2xl mb-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-3xl font-bold text-white">V</span>
        </div>
        
        {/* 태그라인 */}
        <p className="text-xl sm:text-2xl text-neutral-400 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          스마트한 의사결정을 위한 AI 플랫폼
        </p>
      </div>
    </div>
  );
};

