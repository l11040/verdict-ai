/**
 * 주식 검색 페이지
 * Feature-based Architecture: features/stock/pages/stock-search-page.tsx
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/shared/components';

export const StockSearchPage = () => {
  const [symbol, setSymbol] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSymbol = symbol.trim().toUpperCase();
    if (trimmedSymbol) {
      navigate(`/stocks/${trimmedSymbol}`);
    }
  };

  const popularSymbols = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
  ];

  // 애니메이션 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-neutral-950 dark:via-neutral-950 dark:to-primary/10 relative overflow-hidden">
      <AppHeader />

      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-3xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 헤더 */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary/25 mb-6"
              variants={iconVariants}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent mb-4 tracking-tight">
              Verdict AI
            </h1>
            <p className="text-lg text-muted-foreground dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              AI 기반 투자 심의 위원회로 최적의 투자 결정을 내리세요
            </p>
          </motion.div>

          {/* 검색창 */}
          <motion.div className="mb-12" variants={itemVariants}>
            <form onSubmit={handleSubmit} className="relative group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-primary/5 p-2 transition-all duration-300 hover:shadow-primary/10 hover:border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="text"
                        placeholder="주식 심볼을 입력하세요 (예: AAPL, TSLA, MSFT)"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="pl-12 pr-4 h-16 text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                        autoFocus
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-16 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
                      disabled={!symbol.trim()}
                    >
                      <Search className="w-5 h-5 mr-2" />
                      검색
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          {/* 인기 주식 심볼 */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground dark:text-neutral-400 uppercase tracking-wider">
                인기 주식
              </p>
            </div>
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              variants={buttonContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {popularSymbols.map((item) => (
                <motion.button
                  key={item.symbol}
                  onClick={() => navigate(`/stocks/${item.symbol}`)}
                  className="group relative px-6 py-3 rounded-xl bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 active:translate-y-0"
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-bold text-foreground dark:text-white group-hover:text-primary transition-colors">
                      {item.symbol}
                    </span>
                    <span className="text-xs text-muted-foreground dark:text-neutral-400">
                      {item.name}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300" />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
