import React from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, History, BarChart3, HelpCircle, Sparkles, Flame, Shield, Volume2, VolumeX, Smartphone, Zap } from 'lucide-react';
import { GameStats, GameMode } from '../types';

interface HomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  onOpenHistory: () => void;
  onOpenAchievements: () => void;
  onOpenStats: () => void;
  onOpenRules: () => void;
  stats: GameStats;
  isMuted: boolean;
  onToggleMute: () => void;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onOpenHistory,
  onOpenAchievements,
  onOpenStats,
  onOpenRules,
  stats,
  isMuted,
  onToggleMute,
  unlockedAchievementsCount,
  totalAchievementsCount,
}) => {
  // Level & XP Calculation
  const currentXP = stats.xp ?? 0;
  const getLevelInfo = (xp: number) => {
    if (xp >= 300) return { level: 5, title: 'Lenda do Quadra 64', nextXP: 500, color: 'text-purple-400' };
    if (xp >= 150) return { level: 4, title: 'Mestre dos Blocos', nextXP: 300, color: 'text-amber-400' };
    if (xp >= 70) return { level: 3, title: 'Estrategista 8x8', nextXP: 150, color: 'text-yellow-400' };
    if (xp >= 30) return { level: 2, title: 'Encaixador Hábil', nextXP: 70, color: 'text-blue-400' };
    return { level: 1, title: 'Aprendiz de Blocos', nextXP: 30, color: 'text-emerald-400' };
  };

  const levelInfo = getLevelInfo(currentXP);
  const prevLevelXP = levelInfo.level === 1 ? 0 : [0, 0, 30, 70, 150, 300][levelInfo.level];
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((currentXP - prevLevelXP) / (levelInfo.nextXP - prevLevelXP)) * 100))
  );

  return (
    <div className="h-full h-[100dvh] max-h-[100dvh] max-w-2xl mx-auto w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-3 sm:p-5 selection:bg-blue-500 relative overflow-hidden font-sans">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-5 w-56 h-56 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Controls (Mute button on right) */}
      <div className="flex items-center justify-end z-10 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-2 bg-slate-900/90 border border-slate-800 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          title={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Main Center Content Container */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2 z-10 min-h-0 w-full max-w-2xl mx-auto gap-4">
        {/* Top Section: Left (Logo + Title) | Right (Level Card + Play Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center w-full">
          {/* Left Side: Game Logo + Title + Subtitle */}
          <div className="flex flex-col items-center justify-center text-center gap-2">
            {/* Animated Mini Grid Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="relative p-2 bg-slate-900/90 rounded-2xl border-2 border-slate-700/80 shadow-xl shadow-blue-500/10 shrink-0"
            >
              <div className="grid grid-cols-4 gap-1 w-20 h-20 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="col-span-2 row-span-2 bg-blue-500 rounded-md border border-blue-400 shadow-xs" />
                <div className="col-span-2 row-span-1 bg-yellow-400 rounded-md border border-yellow-300" />
                <div className="col-span-1 row-span-2 bg-rose-500 rounded-md border border-rose-400" />
                <div className="col-span-1 row-span-1 bg-slate-200 rounded-md border border-slate-100" />
                <div className="col-span-2 row-span-1 bg-zinc-950 rounded-md border border-zinc-700" />
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                className="absolute -top-1.5 -right-1.5 p-1.5 bg-yellow-500 text-slate-950 rounded-full shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              </motion.div>
            </motion.div>

            {/* Title & Subtitle */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display uppercase drop-shadow-md">
                QUADRA <span className="text-blue-500">64</span>
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-yellow-400 tracking-wider uppercase px-3 py-0.5 bg-yellow-500/10 rounded-full border border-yellow-500/30">
                Mestre dos Blocos
              </p>
            </motion.div>
          </div>

          {/* Right Side: Level Card + Play Buttons */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex flex-col gap-2.5 justify-center w-full"
          >
            {/* Level & XP Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block leading-none">Nível Atual</span>
                      <h3 className={`text-[11px] sm:text-xs font-black ${levelInfo.color} leading-snug`}>
                        Nível {levelInfo.level} • {levelInfo.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold font-mono text-slate-300">{currentXP} XP</span>
                </div>
              </div>

              <div className="mt-1">
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-gradient-to-r from-blue-500 to-yellow-400 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                  <span>{levelProgress}% concluído</span>
                  <span>Próximo: {levelInfo.nextXP} XP</span>
                </div>
              </div>
            </div>

            {/* Play Buttons */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onStartGame('casual')}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer border border-blue-400/40"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>JOGAR MODO LIVRE</span>
              </button>

              <button
                onClick={() => onStartGame('timer')}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>JOGAR COM CRONÔMETRO</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Row Navigation: 4 Cards in 1 Row (4 Columns) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 z-10 shrink-0 w-full max-w-2xl mx-auto"
      >
        <button
          onClick={onOpenHistory}
          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-xs active:scale-95 group"
        >
          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 mb-1 group-hover:scale-110 transition-transform">
            <History className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-[11px] font-bold text-white truncate w-full">Histórico</h4>
          <p className="text-[9px] text-slate-400 truncate w-full">Ver partidas</p>
        </button>

        <button
          onClick={onOpenAchievements}
          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-xs active:scale-95 group"
        >
          <div className="p-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/20 mb-1 group-hover:scale-110 transition-transform">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-[11px] font-bold text-white truncate w-full">Conquistas</h4>
          <p className="text-[9px] text-yellow-400 font-bold truncate w-full">
            {unlockedAchievementsCount}/{totalAchievementsCount}
          </p>
        </button>

        <button
          onClick={onOpenStats}
          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-xs active:scale-95 group"
        >
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 mb-1 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-[11px] font-bold text-white truncate w-full">Estatísticas</h4>
          <p className="text-[9px] text-slate-400 truncate w-full">{stats.gamesWon} vitórias</p>
        </button>

        <button
          onClick={onOpenRules}
          className="p-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-xs active:scale-95 group"
        >
          <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20 mb-1 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-[11px] font-bold text-white truncate w-full">Como Jogar</h4>
          <p className="text-[9px] text-slate-400 truncate w-full">Regras e Dicas</p>
        </button>
      </motion.div>
    </div>
  );
};
