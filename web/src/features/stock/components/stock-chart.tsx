/**
 * 주식 차트 컴포넌트 (D3 - 미니멀 디자인)
 */
import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { useChartData } from '../hooks/use-chart-data';
import { useCurrencyStore } from '@/stores/currency-store';
import { formatCurrencyAmount } from '@/lib/currency';

interface StockChartProps {
  symbol: string | null;
  startDate?: string;
  endDate?: string;
  height?: number;
}

type Period = '3M' | '6M' | '1Y' | '3Y' | '5Y';

export const StockChart = ({
  symbol,
  startDate: propStartDate,
  endDate: propEndDate,
  height = 500,
}: StockChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currency, exchangeRate } = useCurrencyStore();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1Y');

  // 기간에 따른 날짜 계산
  const { startDate, endDate } = useMemo(() => {
    if (propStartDate && propEndDate) {
      return { startDate: propStartDate, endDate: propEndDate };
    }

    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start: Date;

    switch (selectedPeriod) {
      case '3M':
        start = new Date(today);
        start.setMonth(today.getMonth() - 3);
        break;
      case '6M':
        start = new Date(today);
        start.setMonth(today.getMonth() - 6);
        break;
      case '1Y':
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
        break;
      case '3Y':
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 3);
        break;
      case '5Y':
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 5);
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end,
    };
  }, [selectedPeriod, propStartDate, propEndDate]);

  const {
    data: chartData,
    isLoading,
    error,
  } = useChartData({
    symbol,
    startDate,
    endDate,
  });

  // 차트 데이터 준비 (가격 + 볼륨, 주말 및 휴일 제외)
  const preparedData = useMemo(() => {
    if (!chartData?.data) return [];

    const filtered = chartData.data
      .map((item) => {
        // 날짜 파싱 (YYYY-MM-DD 형식 또는 Date 객체)
        let date: Date;
        if (typeof item.date === 'string') {
          date = new Date(item.date + 'T00:00:00'); // 시간대 명시
        } else {
          date = new Date(item.date);
        }

        return {
          date,
          close: item.close,
          volume: item.volume,
        };
      })
      .filter((item) => {
        // 유효한 날짜인지 확인
        if (isNaN(item.date.getTime())) {
          return false;
        }

        // 주말 제외 (0 = 일요일, 6 = 토요일)
        const dayOfWeek = item.date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          return false;
        }

        // 거래량이 0이거나 없는 경우 제외 (휴일일 가능성)
        const volume = Number(item.volume);
        if (!volume || volume === 0 || isNaN(volume)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime()) // 날짜 순서 정렬
      .map((item, index) => ({
        ...item,
        index, // 인덱스 할당
      }));

    return filtered;
  }, [chartData]);

  // 차트 그리기
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !preparedData.length)
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // 기존 차트 제거

    const priceChartHeight = height * 0.9; // 가격 차트 높이 (90%)
    const volumeChartHeight = height * 0.1; // 볼륨 차트 높이 (10%)
    const margin = { top: 35, right: 0, bottom: 0, left: 0 }; // 패딩 제거 (top은 툴팁용)
    const width = containerRef.current.clientWidth;
    const priceChartAreaHeight = priceChartHeight - margin.top;
    const volumeChartAreaHeight = volumeChartHeight; // margin.bottom 제거

    // 거래일 인덱스 기반 스케일 (주말/공휴일 빈 공간 제거)
    const xScale = d3
      .scaleLinear()
      .domain([0, preparedData.length - 1])
      .range([0, width]);

    const yPriceScale = d3
      .scaleLinear()
      .domain(
        d3.extent(
          preparedData,
          (d: { date: Date; close: number; volume: number }) => d.close,
        ) as [number, number],
      )
      .nice()
      .range([priceChartAreaHeight, 0]);

    const yVolumeScale = d3
      .scaleLinear()
      .domain([0, d3.max(preparedData, (d) => d.volume) || 0])
      .nice()
      .range([volumeChartAreaHeight, 0]); // 바닥에 딱 붙도록

    // 가격 차트 그룹
    const priceG = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 볼륨 차트 그룹
    const volumeG = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${priceChartHeight})`);

    // 가격 라인 생성 (인덱스 기반)
    const priceLine = d3
      .line<{ date: Date; close: number; volume: number }>()
      .x((_d, i) => xScale(i))
      .y((d) => yPriceScale(d.close))
      .curve(d3.curveMonotoneX);

    // 가격 라인 경로
    const pricePath = priceG
      .append('path')
      .datum(preparedData)
      .attr('fill', 'none')
      .attr('stroke', '#f97316')
      .attr('stroke-width', 1.5)
      .attr('d', priceLine)
      .style('filter', 'drop-shadow(0 1px 2px rgba(249, 115, 22, 0.2))')
      .style('opacity', 0);

    // 가격 라인 애니메이션 (더 부드럽게)
    const totalLength = pricePath.node()?.getTotalLength() || 0;
    if (totalLength > 0) {
      pricePath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)
        .style('opacity', 1);
    } else {
      pricePath.style('opacity', 1);
    }

    // 볼륨 막대 차트 (인덱스 기반)
    const barWidth = width / preparedData.length;
    volumeG
      .selectAll('.volume-bar')
      .data(preparedData)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'volume-bar')
            .attr('fill', '#6b7280')
            .attr('opacity', 0)
            .attr('x', (_d, i) => xScale(i) - barWidth / 2)
            .attr('y', (d) => yVolumeScale(d.volume))
            .attr('width', barWidth * 0.8)
            .attr('height', (d) =>
              Math.max(0, volumeChartAreaHeight - yVolumeScale(d.volume)),
            )
            .call((enter) =>
              enter.transition().duration(300).style('opacity', 0.6),
            ),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(200)
              .attr('x', (_d, i) => xScale(i) - barWidth / 2)
              .attr('y', (d) => yVolumeScale(d.volume))
              .attr('width', barWidth * 0.8)
              .attr('height', (d) =>
                Math.max(0, volumeChartAreaHeight - yVolumeScale(d.volume)),
              ),
          ),
        (exit) =>
          exit.call((exit) =>
            exit.transition().duration(150).style('opacity', 0).remove(),
          ),
      );

    // 수직선 (호버 시 표시)
    const verticalLine = priceG
      .append('line')
      .attr('class', 'vertical-line')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0)
      .attr('y1', 0)
      .attr('y2', priceChartAreaHeight);

    // 볼륨 차트에도 수직선
    const volumeVerticalLine = volumeG
      .append('line')
      .attr('class', 'volume-vertical-line')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0)
      .attr('y1', 0)
      .attr('y2', volumeChartAreaHeight);

    // 툴팁 그룹
    const tooltip = priceG
      .append('g')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    const tooltipText = tooltip.append('text').attr('text-anchor', 'middle');

    // 호버 영역 (가격 차트)
    const hoverArea = priceG
      .append('rect')
      .attr('class', 'hover-area')
      .attr('width', width)
      .attr('height', priceChartAreaHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    // 마우스 이동 이벤트
    hoverArea.on('mousemove', (event: MouseEvent) => {
      const [mouseX] = d3.pointer(event, containerRef.current);
      const adjustedX = mouseX - margin.left;

      // 가장 가까운 데이터 포인트 찾기 (인덱스 기반)
      const x0 = xScale.invert(adjustedX);
      const index = Math.round(x0);
      const clampedIndex = Math.max(
        0,
        Math.min(index, preparedData.length - 1),
      );
      const d = preparedData[clampedIndex];

      if (d) {
        const x = xScale(clampedIndex);

        // 수직선 표시
        verticalLine.attr('x1', x).attr('x2', x).attr('opacity', 1);
        volumeVerticalLine.attr('x1', x).attr('x2', x).attr('opacity', 1);

        // 툴팁 내용
        const priceText = formatCurrencyAmount(d.close, currency, exchangeRate);
        const dateText = d3.timeFormat('%Y년 %m월 %d일')(d.date);

        // 기존 텍스트 제거
        tooltipText.selectAll('tspan').remove();

        // 새 텍스트 추가 (날짜가 위, 금액이 아래)
        tooltipText
          .selectAll('tspan')
          .data([dateText, priceText])
          .enter()
          .append('tspan')
          .attr('x', 0)
          .attr('dy', (_, i) => (i === 0 ? '0' : '18'))
          .style('font-size', (_, i) => (i === 0 ? '12px' : '16px'))
          .style('font-weight', (_, i) => (i === 0 ? '500' : '700'))
          .style('fill', (_, i) => (i === 0 ? '#9ca3af' : '#ffffff'))
          .text((text) => text);

        // 툴팁 텍스트의 실제 너비 계산
        const tooltipBBox = (tooltipText.node() as SVGTextElement)?.getBBox();
        const tooltipWidth = tooltipBBox ? tooltipBBox.width : 100;
        const tooltipPadding = 5;

        // 툴팁 위치 설정
        let tooltipX = x;

        const tooltipLeftEdge = tooltipX - tooltipWidth / 2;
        if (tooltipLeftEdge < tooltipPadding) {
          tooltipX = tooltipWidth / 2 + tooltipPadding;
        }

        const tooltipRightEdge = tooltipX + tooltipWidth / 2;
        if (tooltipRightEdge > width - tooltipPadding) {
          tooltipX = width - tooltipWidth / 2 - tooltipPadding;
        }

        const tooltipY = -35;

        tooltip
          .attr('transform', `translate(${tooltipX},${tooltipY})`)
          .style('opacity', 1);
      }
    });

    hoverArea.on('mouseleave', () => {
      verticalLine.attr('opacity', 0);
      volumeVerticalLine.attr('opacity', 0);
      tooltip.style('opacity', 0);
    });
  }, [preparedData, height, currency, exchangeRate]);

  // 반응형 처리
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      // 차트 다시 그리기 (의존성 변경으로 자동 재실행)
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [preparedData, currency, exchangeRate]);

  if (!symbol) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">차트를 표시할 심볼이 없습니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">차트 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">차트 데이터를 불러올 수 없습니다.</p>
        <p className="text-sm text-muted-foreground mt-2">
          먼저 주식 데이터를 가져와주세요.
        </p>
      </div>
    );
  }

  if (!chartData || !chartData.data?.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">차트 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      {/* 기간 선택 - 미니멀하게 */}
      <div className="flex gap-1 mb-4">
        {(
          [
            { value: '3M', label: '3달' },
            { value: '6M', label: '6달' },
            { value: '1Y', label: '1년' },
            { value: '3Y', label: '3년' },
            { value: '5Y', label: '5년' },
          ] as Array<{ value: Period; label: string }>
        ).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedPeriod(value)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
              selectedPeriod === value
                ? 'text-primary bg-primary/10 dark:bg-primary/20'
                : 'text-muted-foreground hover:text-foreground dark:hover:text-neutral-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="w-full">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          className="overflow-visible transition-opacity duration-300 ease-in-out"
          style={{ opacity: preparedData.length ? 1 : 0 }}
        />
      </div>
    </div>
  );
};
