/**
 * AI 투자 토론 패널 컴포넌트
 * 실시간 스트리밍 + 의견 기반 색상 + 모던 UI
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
  Users,
  Zap,
  BarChart3,
  Target,
  Repeat,
  LineChart,
  Gem,
  Sprout,
  Star,
  Coins,
  Crown,
  Shield,
  Crosshair,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStartDebate } from '../hooks';
import type { DebateLog, VerdictResult, DebateStatus } from '../types';

interface DebatePanelProps {
  symbol: string;
  onStatusChange?: (status: DebateStatus) => void;
}

// 의견별 색상 스키마
const decisionStyles = {
  BUY: {
    bg: 'bg-gradient-to-br from-emerald-500/20 to-green-600/10',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
    badge: 'bg-transparent border border-emerald-500 text-emerald-500',
    icon: TrendingUp,
  },
  SELL: {
    bg: 'bg-gradient-to-br from-rose-500/20 to-red-600/10',
    border: 'border-rose-500/40',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/20',
    badge: 'bg-transparent border border-rose-500 text-rose-500',
    icon: TrendingDown,
  },
  HOLD: {
    bg: 'bg-gradient-to-br from-amber-500/20 to-yellow-600/10',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
    badge: 'bg-transparent border border-amber-500 text-amber-500',
    icon: Minus,
  },
};

// 에이전트 아이콘 매핑 (lucide-react 아이콘 사용)
const agentIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  technical_analyst: BarChart3,
  trend_follower: LineChart,
  contrarian_investor: Repeat,
  momentum_trader: Zap,
  final_verdict: Scale,
  value_investor: Gem,
  growth_analyst: Sprout,
  quality_analyst: Star,
  cashflow_expert: Coins,
  dividend_aristocrat: Crown,
  risk_manager: Shield,
  hedge_strategist: Crosshair,
  valuation_critic: Target,
  balanced_analyst: Users,
};

export const DebatePanel = ({ symbol, onStatusChange }: DebatePanelProps) => {
  const { status, logs, verdict, error, selectedAgents, startDebate, reset } =
    useStartDebate();
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // 상태 변경 시 부모에게 알림
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // 새 로그가 추가되면 스크롤 (최신이 위에 있으므로 맨 위로)
  useEffect(() => {
    if (logs.length > 0 && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = 0;
    }
  }, [logs.length]);

  const handleStartDebate = () => {
    startDebate(symbol);
    setIsExpanded(true);
  };

  const isLoading = status === 'starting';
  const isStreaming = status === 'streaming';

  // 의견 통계 계산
  const stats = logs.reduce(
    (acc, log) => {
      if (log.decision) acc[log.decision]++;
      return acc;
    },
    { BUY: 0, SELL: 0, HOLD: 0 } as Record<string, number>,
  );

  // 고유 에이전트 수 계산
  const uniqueAgents = new Set(logs.map((log) => log.agentId)).size;

  return (
    <section className="pt-6 border-t border-border/30">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              AI 투자 심의 위원회
              {isStreaming && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground">
              {symbol} 종목에 대한 AI 에이전트 토론
            </p>
          </div>
        </div>

        {status === 'idle' && (
          <Button
            onClick={handleStartDebate}
            className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25"
          >
            <Zap className="w-4 h-4" />
            토론 시작
          </Button>
        )}

        {(status === 'completed' || status === 'error') && (
          <Button onClick={reset} variant="outline" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            다시 분석
          </Button>
        )}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-600/5"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
            <Loader2 className="w-8 h-8 animate-spin text-violet-400 relative z-10" />
          </div>
          <p className="mt-4 text-muted-foreground font-medium">
            AI 에이전트들을 소집하고 있습니다...
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {symbol} 데이터 분석 중
          </p>
        </motion.div>
      )}

      {/* 선택된 에이전트 표시 */}
      {selectedAgents &&
        selectedAgents.length > 0 &&
        (status === 'streaming' || status === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-foreground">
                선별된 전문가 패널
              </h3>
              <span className="text-xs text-muted-foreground">
                ({selectedAgents.length}명)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedAgents.map((agent: any) => {
                const IconComponent = agentIcons[agent.agentId] || Users;
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border/50 hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.specialization}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

      {/* 에러 상태 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10"
        >
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span className="text-rose-300">{error.message}</span>
        </motion.div>
      )}

      {/* 실시간 토론 영역 */}
      {(isStreaming || (status === 'completed' && logs.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 의견 현황 바 - 맨 위 */}
          {logs.length > 0 && (
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-card/80 to-card/60 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-medium text-muted-foreground">
                  {uniqueAgents}명 참여
                </span>
              </div>
              <div className="flex items-center gap-3">
                {(['BUY', 'SELL', 'HOLD'] as const).map((decision) => {
                  const count = stats[decision];
                  const style = decisionStyles[decision];
                  const Icon = style.icon;

                  if (count === 0) return null;

                  return (
                    <div key={decision} className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                      <span className={`text-xs font-bold ${style.text}`}>
                        {decision}
                      </span>
                      <span className={`text-xs font-medium ${style.text}`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 최종 결정 카드 - 의견 현황 바 다음 */}
          {verdict && status === 'completed' && (
            <FinalVerdictCard verdict={verdict} />
          )}

          {/* 토론 로그 스트림 - 최신이 위로, 스크롤 제거 */}
          <div ref={logsContainerRef} className="space-y-3">
            {/* 스트리밍 중일 때 로딩 인디케이터 맨 위에 */}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-4 rounded-xl border border-violet-500/30 bg-violet-500/5"
              >
                <Loader2 className="w-4 h-4 animate-spin text-violet-400 mr-2" />
                <span className="text-sm text-muted-foreground">
                  다음 에이전트 대기 중...
                </span>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {[...logs].reverse().map((log, index) => (
                <AgentCard
                  key={log.id || index}
                  log={log}
                  isNew={isStreaming && index === 0}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </section>
  );
};

// 에이전트 카드 컴포넌트
const AgentCard = ({ log, isNew }: { log: DebateLog; isNew: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const decision = log.decision || extractDecision(log.message);
  const style = decision ? decisionStyles[decision] : null;
  const AgentIcon = agentIcons[log.agentId] || MessageSquare;
  const DecisionIcon = style?.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        relative p-4 rounded-xl border backdrop-blur-sm
        bg-card border-border
        ${
          isNew
            ? 'ring-2 ring-violet-500/50 shadow-lg shadow-violet-500/20'
            : ''
        }
        hover:bg-card/90 hover:shadow-md
        transition-all duration-200
      `}
    >
      {/* 새 발언 인디케이터 */}
      {isNew && (
        <div className="absolute -top-2 -right-2">
          <span className="flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500" />
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* 아이콘 */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted border border-border">
            <AgentIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 헤더 */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
              {log.agentRole}
            </span>
            <span className="text-xs text-muted-foreground/70">
              턴 {log.turn}
            </span>
            {decision && DecisionIcon && (
              <div
                className={`
                flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full
                ${style?.badge}
                shadow-sm
              `}
              >
                <DecisionIcon className="w-3 h-3" />
                {decision}
                {log.confidence && (
                  <span className="ml-0.5">{log.confidence}%</span>
                )}
              </div>
            )}
          </div>

          {/* 요약 */}
          <p className="text-sm leading-relaxed text-foreground">
            {log.summary || log.message.slice(0, 100)}
          </p>

          {/* 상세 내용 토글 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                접기
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                상세 분석
              </>
            )}
          </button>

          {/* 상세 내용 */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {log.message}
                  </p>
                  <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                    <span>토큰: {(log.tokensUsed || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// 최종 결정 카드
const FinalVerdictCard = ({ verdict }: { verdict: VerdictResult }) => {
  const style = decisionStyles[verdict.decision];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      className={`
        relative overflow-hidden p-6 rounded-2xl border-2
        ${style.bg} ${style.border}
        shadow-2xl ${style.glow}
      `}
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${
            style.badge.split(' ')[0]
          }`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl ${
            style.badge.split(' ')[0]
          }`}
        />
      </div>

      <div className="relative z-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${style.badge} shadow-lg`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                최종 결정
              </p>
              <h3 className={`text-3xl font-black ${style.text}`}>
                {verdict.decision}
              </h3>
            </div>
          </div>

          {/* 신뢰도 */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              신뢰도
            </p>
            <p className={`text-3xl font-black ${style.text}`}>
              {verdict.confidence}%
            </p>
          </div>
        </div>

        {/* 목표가 - 값이 있고 유효한 경우만 표시 */}
        {verdict.targetPrice != null && verdict.targetPrice > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-background/40 border border-border/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className={`w-4 h-4 ${style.text}`} />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                목표 주가
              </p>
            </div>
            <p className={`text-2xl font-bold ${style.text}`}>
              ${Number(verdict.targetPrice).toFixed(2)}
            </p>
          </div>
        )}

        {/* 토큰 사용량 */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-4 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">
              총 {(verdict.totalTokens || 0).toLocaleString()} 토큰
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>입력 {(verdict.promptTokens || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>출력 {(verdict.completionTokens || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 메시지에서 결정 추출 (백업용)
const extractDecision = (message: string): 'BUY' | 'SELL' | 'HOLD' | null => {
  const upper = message.toUpperCase();
  if (upper.includes('BUY')) return 'BUY';
  if (upper.includes('SELL')) return 'SELL';
  if (upper.includes('HOLD')) return 'HOLD';
  return null;
};
