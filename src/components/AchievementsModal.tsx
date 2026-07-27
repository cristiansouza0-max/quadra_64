import React from 'react';
import { X, Trophy, Lock, CheckCircle2, Award, Zap, Brain, Flame, Target } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'brain': return <Brain className="w-5 h-5 text-purple-400" />;
      case 'flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'target': return <Target className="w-5 h-5 text-emerald-400" />;
      default: return <Award className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">
                Conquistas & Selos
              </h2>
              <p className="text-xs text-slate-400">
                {unlockedCount} de {totalCount} desbloqueadas ({percentage}%)
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

        {/* Progress bar */}
        <div className="shrink-0 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-slate-300">Progresso Geral</span>
            <span className="text-yellow-400 font-mono">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* List of achievements */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-scrollbar">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                item.unlocked
                  ? 'bg-slate-800/90 border-yellow-500/40 shadow-md shadow-yellow-500/5'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                  item.unlocked
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {item.unlocked ? getIcon(item.icon) : <Lock className="w-5 h-5 text-slate-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-xs font-bold truncate ${
                      item.unlocked ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 shrink-0 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-full shadow-md transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
