import React from 'react';
import { X, Trophy, Flame, Clock, Gamepad2, RotateCcw } from 'lucide-react';
import { GameStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white font-display">
              Estatísticas do Jogador
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <div className="text-slate-400 text-[10px] font-bold uppercase mb-1 flex items-center justify-center gap-1 tracking-wider">
              <Gamepad2 className="w-3.5 h-3.5" /> Partidas Jogadas
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {stats.gamesPlayed}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <div className="text-slate-400 text-[10px] font-bold uppercase mb-1 flex items-center justify-center gap-1 tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Vitórias (% taxa)
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {stats.gamesWon} ({winRate}%)
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <div className="text-slate-400 text-[10px] font-bold uppercase mb-1 flex items-center justify-center gap-1 tracking-wider">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Sequência Atual
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {stats.currentStreak}
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
            <div className="text-slate-400 text-[10px] font-bold uppercase mb-1 flex items-center justify-center gap-1 tracking-wider">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Melhor Tempo
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {formatTime(stats.bestTimeSeconds)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <button
            onClick={onResetStats}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zerar Histórico e Estatísticas</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full shadow-md cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
