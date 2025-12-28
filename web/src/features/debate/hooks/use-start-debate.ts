/**
 * 토론 시작 및 실시간 스트리밍 훅
 */
import { useState, useCallback, useRef } from 'react';
import type { DebateLog, VerdictResult, DebateStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface UseStartDebateOptions {
  onLogReceived?: (log: DebateLog) => void;
  onComplete?: (result: VerdictResult) => void;
  onError?: (error: Error) => void;
}

interface UseStartDebateReturn {
  status: DebateStatus;
  logs: DebateLog[];
  verdict: VerdictResult | null;
  error: Error | null;
  selectedAgents: any[];
  startDebate: (symbol: string) => Promise<void>;
  reset: () => void;
}

export const useStartDebate = (
  options?: UseStartDebateOptions,
): UseStartDebateReturn => {
  const [status, setStatus] = useState<DebateStatus>('idle');
  const [logs, setLogs] = useState<DebateLog[]>([]);
  const [verdict, setVerdict] = useState<VerdictResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const verdictIdRef = useRef<number | null>(null);

  const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };

  const startDebate = useCallback(
    async (symbol: string) => {
      const token = getAccessToken();
      if (!token) {
        const err = new Error('로그인이 필요합니다.');
        setError(err);
        setStatus('error');
        options?.onError?.(err);
        return;
      }

      // 초기화
      setStatus('starting');
      setLogs([]);
      setVerdict(null);
      setError(null);
      setSelectedAgents([]);

      try {
        // 1. 토론 시작 API 호출 (즉시 verdictId 반환)
        const response = await fetch(`${API_BASE_URL}/debate/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ symbol }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '토론을 시작할 수 없습니다.');
        }

        const { verdictId, selectedAgents: agents } = await response.json();
        verdictIdRef.current = verdictId;
        setSelectedAgents(agents || []);

        // 2. SSE 스트리밍 연결
        setStatus('streaming');
        const eventSource = new EventSource(
          `${API_BASE_URL}/debate/${verdictId}/stream?token=${token}`,
        );
        eventSourceRef.current = eventSource;

        // 로그 이벤트 핸들러
        eventSource.addEventListener('log', (event) => {
          try {
            const log: DebateLog = JSON.parse(event.data);
            setLogs((prev) => {
              // 중복 방지
              const exists = prev.some((l) => l.id === log.id);
              if (exists) return prev;
              return [...prev, log];
            });
            options?.onLogReceived?.(log);
          } catch (e) {
            console.error('Failed to parse log:', e);
          }
        });

        // 완료 이벤트 핸들러
        eventSource.addEventListener('complete', async (event) => {
          try {
            // 완료 이벤트 데이터 (사용하지 않지만 파싱 확인)
            JSON.parse(event.data);

            // 최종 verdict 조회
            const verdictResponse = await fetch(
              `${API_BASE_URL}/debate/${verdictId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (verdictResponse.ok) {
              const fullVerdict: VerdictResult = await verdictResponse.json();
              setVerdict(fullVerdict);
              options?.onComplete?.(fullVerdict);
            }

            setStatus('completed');
            eventSource.close();
            eventSourceRef.current = null;
          } catch (e) {
            console.error('Failed to handle complete:', e);
          }
        });

        // 에러 이벤트 핸들러
        eventSource.addEventListener('error', (event: MessageEvent) => {
          try {
            if (event.data) {
              const errorData = JSON.parse(event.data);
              const err = new Error(
                errorData.error || '토론 중 오류가 발생했습니다.',
              );
              setError(err);
              setStatus('error');
              options?.onError?.(err);
            }
          } catch {
            // SSE 연결 에러 (파싱 실패)
          }
          eventSource.close();
          eventSourceRef.current = null;
        });

        // 타임아웃 이벤트 핸들러
        eventSource.addEventListener('timeout', () => {
          setStatus('completed');
          eventSource.close();
          eventSourceRef.current = null;
        });

        // 일반 에러 핸들러 (연결 끊김 등)
        eventSource.onerror = async () => {
          // 연결이 끊어지면 완료된 것으로 처리
          if (eventSourceRef.current) {
            eventSource.close();
            eventSourceRef.current = null;
            setStatus('completed');

            // 최종 결과 조회
            try {
              const response = await fetch(
                `${API_BASE_URL}/debate/${verdictId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (response.ok) {
                const fullVerdict: VerdictResult = await response.json();
                setVerdict(fullVerdict);
                options?.onComplete?.(fullVerdict);
              }
            } catch (e) {
              console.error('Failed to fetch final result:', e);
            }
          }
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('알 수 없는 오류');
        setError(error);
        setStatus('error');
        options?.onError?.(error);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    verdictIdRef.current = null;
    setStatus('idle');
    setLogs([]);
    setVerdict(null);
    setError(null);
    setSelectedAgents([]);
  }, []);

  return {
    status,
    logs,
    verdict,
    error,
    selectedAgents,
    startDebate,
    reset,
  };
};
