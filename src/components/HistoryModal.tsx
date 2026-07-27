import React from 'react';
import { X, History, Clock, HelpCircle, Trash2, CheckCircle2, Award } from 'lucide-react';
import { GameRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyRecords: GameRecord[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyRecords,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">
                Histórico de Partidas
              </h2>
              <p className="text-xs text-slate-400">
                {historyRecords.length} {historyRecords.length === 1 ? 'partida registrada' : 'partidas registradas'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-scrollbar min-h-[220px]">
          {historyRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 gap-2">
              <History className="w-10 h-10 stroke-1 text-slate-600 mb-1" />
              <p className="text-sm font-semibold text-slate-400">Nenhuma partida registrada ainda</p>
              <p className="text-xs text-slate-500 max-w-[220px]">
                Complete um tabuleiro no jogo para ver suas estatísticas e tempo registrado aqui!
              </p>
            </div>
          ) : (
            historyRecords.map((record) => (
              <div
                key={record.id}
                className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Vitória Concluída</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900 text-blue-400 border border-slate-700">
                        {record.mode === 'timer' ? 'Cronômetro' : 'Livre'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {formatDate(record.timestamp)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-blue-400 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatTime(record.timeSeconds)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                    <HelpCircle className="w-3 h-3" />
                    <span>{record.hintsUsed} {record.hintsUsed === 1 ? 'dica' : 'dicas'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 shrink-0 border-t border-slate-800 flex items-center justify-between">
          {historyRecords.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Histórico</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
