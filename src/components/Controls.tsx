import React from 'react';
import {
  RotateCw,
  Lightbulb,
  Trash2,
  Undo2,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ControlsProps {
  onRotate: () => void;
  onHint: () => void;
  onSolve: () => void;
  onClear: () => void;
  onUndo: () => void;
  onNewGame: () => void;
  canUndo: boolean;
  canClear: boolean;
  hasSelectedPiece: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onRotate,
  onHint,
  onSolve,
  onClear,
  onUndo,
  canUndo,
  canClear,
  hasSelectedPiece,
}) => {
  return (
    <div className="w-full grid grid-cols-5 gap-1 py-0.5">
      {/* 1. Girar */}
      <button
        onClick={onRotate}
        disabled={!hasSelectedPiece}
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-xl border transition-all active:scale-95 cursor-pointer ${
          hasSelectedPiece
            ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-xs'
            : 'bg-slate-800/50 border-slate-700/60 text-slate-500 cursor-not-allowed'
        }`}
        title="Girar a peça selecionada (R)"
      >
        <RotateCw className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Girar</span>
      </button>

      {/* 2. Desfazer */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-xl border transition-all active:scale-95 cursor-pointer ${
          canUndo
            ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            : 'bg-slate-800/50 border-slate-700/60 text-slate-500 cursor-not-allowed'
        }`}
        title="Desfazer última jogada"
      >
        <Undo2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Desfazer</span>
      </button>

      {/* 3. Limpar */}
      <button
        onClick={onClear}
        disabled={!canClear}
        className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-xl border transition-all active:scale-95 cursor-pointer ${
          canClear
            ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40 text-rose-300'
            : 'bg-slate-800/50 border-slate-700/60 text-slate-500 cursor-not-allowed'
        }`}
        title="Remover todas as peças coloridas do tabuleiro"
      >
        <Trash2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Limpar</span>
      </button>

      {/* 4. Dica */}
      <button
        onClick={onHint}
        className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 transition-all active:scale-95 cursor-pointer shadow-xs"
        title="Obter uma dica de posição correta"
      >
        <Lightbulb className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
        <span className="truncate">Dica</span>
      </button>

      {/* 5. Solução */}
      <button
        onClick={onSolve}
        className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition-all active:scale-95 cursor-pointer"
        title="Revelar a solução do jogo"
      >
        <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="truncate">Solução</span>
      </button>
    </div>
  );
};
