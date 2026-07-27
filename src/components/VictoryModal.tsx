import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Clock, Sparkles, RefreshCw, Star } from 'lucide-react';
import { GameMode } from '../types';

interface VictoryModalProps {
  isOpen: boolean;
  timeSeconds: number;
  hintsUsed: number;
  mode?: GameMode;
  onNewGame: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  timeSeconds,
  hintsUsed,
  mode = 'casual',
  onNewGame,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger canvas-confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Calculate rating stars (3 stars if 0 hints, 2 stars if 1-2 hints, 1 star if 3+)
  const stars = hintsUsed === 0 ? 3 : hintsUsed <= 2 ? 2 : 1;

  const isCasual = mode === 'casual';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl max-w-xs sm:max-w-sm w-full py-5 px-4 sm:px-6 shadow-2xl flex flex-col items-center text-center gap-3 text-slate-100 relative my-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Parabéns! Você Venceu!
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Você preencheu com sucesso todos os 64 espaços!
          </p>

          {isCasual ? (
            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] sm:text-[11px] font-semibold text-slate-400">
              <span>Modo Livre (sem acúmulo de XP ou estatísticas)</span>
            </div>
          ) : (
            <div className="mt-1.5 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] sm:text-[11px] font-black text-amber-400">
              <Sparkles className="w-3 h-3 fill-amber-400" />
              <span>+10 XP Adquiridos!</span>
            </div>
          )}
        </div>

        {/* Stars */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                starIdx <= stars
                  ? 'text-yellow-400 fill-yellow-400 drop-shadow-md'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Stats Card */}
        <div className="w-full bg-slate-800/80 rounded-xl p-2.5 sm:p-3 border border-slate-700/80 grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 tracking-wider">
              <Clock className="w-3 h-3 text-blue-400" /> Tempo Total
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-white mt-0.5">
              {formatTime(timeSeconds)}
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-slate-700/80">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Dicas Usadas
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-white mt-0.5">
              {hintsUsed}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 transition-all cursor-pointer active:scale-95"
          >
            Ver Tabuleiro
          </button>

          <button
            onClick={() => {
              onClose();
              onNewGame();
            }}
            className="flex-1 py-2 px-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Próximo Jogo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
