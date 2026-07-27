import React from 'react';
import { Volume2, VolumeX, HelpCircle, Trophy, Moon, Sun, Sparkles, Play, Pause, RotateCcw, Home, Undo2, Trash2, Lightbulb, Eye } from 'lucide-react';
import { GameMode } from '../types';

interface HeaderProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onNewGame: () => void;
  onReturnHome: () => void;
  progress?: { totalOccupied: number; percentage: number };
  xp?: number;
  onUndo?: () => void;
  canUndo?: boolean;
  onClear?: () => void;
  canClear?: boolean;
  onHint?: () => void;
  onSolve?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  isMuted,
  onToggleMute,
  isDarkMode,
  onToggleDarkMode,
  onOpenRules,
  onOpenStats,
  onNewGame,
  onReturnHome,
  progress,
  xp = 0,
  onUndo,
  canUndo,
  onClear,
  canClear,
  onHint,
  onSolve,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 transition-colors shadow-lg shrink-0">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2">
        {/* Far Left: Return to Home Button & Livre/Timer Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReturnHome}
            className="p-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-200 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
            title="Voltar para a tela inicial"
          >
            <Home className="w-4 h-4 text-blue-400 shrink-0" />
          </button>

          <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-700/80 shrink-0">
            {(mode === 'free' || mode === 'casual') && (
              <span className="text-xs font-bold text-slate-200">
                Livre
              </span>
            )}
            {mode === 'timer' && (
              <span className="text-xs font-mono font-bold text-blue-400">{formatTime(timerSeconds)}</span>
            )}
            {mode === 'timer' && (
              <button
                onClick={onToggleTimer}
                className={`p-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isTimerRunning
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-500 text-slate-950 animate-pulse'
                }`}
                title={isTimerRunning ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3 fill-slate-950" /> : <Play className="w-3 h-3 fill-slate-950" />}
              </button>
            )}
          </div>

          {/* XP Badge - hidden in Modo Livre / Casual */}
          {mode !== 'casual' && mode !== 'free' && (
            <div
              className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-xl text-amber-400 font-bold text-[10px] sm:text-[11px] font-mono shrink-0"
              title="Seu XP acumulado"
            >
              <Sparkles className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{xp} XP</span>
            </div>
          )}
        </div>

        {/* Center: Progress Bar + Quick Action Icon Buttons */}
        <div className="flex-1 max-w-md sm:max-w-lg mx-1 flex items-center gap-2">
          {/* Progress Bar */}
          <div className="flex-1 flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 shadow-inner min-w-0">
            <span className="font-bold text-slate-300 text-[10px] whitespace-nowrap uppercase hidden sm:inline">Progresso:</span>
            <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-500 via-yellow-400 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress?.percentage || 0}%` }}
              />
            </div>
            <span className="font-bold font-mono text-blue-400 shrink-0 text-[10px] sm:text-[11px]">
              {progress?.totalOccupied || 0}/58
            </span>
          </div>

          {/* Quick Action Icons beside Progress Bar */}
          <div className="flex items-center gap-1 shrink-0">
            {onUndo && (
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                  canUndo
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-600 cursor-not-allowed'
                }`}
                title="Desfazer última jogada"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            )}

            {onClear && (
              <button
                onClick={onClear}
                disabled={!canClear}
                className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                  canClear
                    ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40 text-rose-300'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-600 cursor-not-allowed'
                }`}
                title="Limpar tabuleiro"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {onHint && (
              <button
                onClick={onHint}
                className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                  xp >= 5
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400'
                }`}
                title={
                  xp >= 5
                    ? 'Dica de posição (Custa 5 XP)'
                    : 'Dica de posição (Requer 5 XP - Você tem ' + xp + ' XP)'
                }
              >
                <Lightbulb className={`w-4 h-4 ${xp >= 5 ? 'text-yellow-400' : 'text-slate-500'}`} />
              </button>
            )}

            {onSolve && (
              <button
                onClick={onSolve}
                className="p-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition-all active:scale-95 cursor-pointer"
                title="Mostrar solução (Consome TODO o seu XP)"
              >
                <Eye className="w-4 h-4 text-blue-400" />
              </button>
            )}
          </div>
        </div>

        {/* Far Right: Actions (Novo Jogo, Estatísticas, Como Jogar) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={onNewGame}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
            title="Iniciar novo jogo"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">Novo Jogo</span>
          </button>

          <button
            onClick={onOpenStats}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Estatísticas"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="hidden md:inline">Estatísticas</span>
          </button>

          <button
            onClick={onOpenRules}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Como Jogar"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Como Jogar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

