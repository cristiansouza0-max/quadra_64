import React from 'react';
import { X, CheckCircle, Lock, Grid, Palette, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display">
                Como Jogar - Quebra-Cabeça 64
              </h2>
              <p className="text-xs text-slate-400">
                Regras e distribuição de peças no tabuleiro 8x8
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-slate-300">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex gap-3 items-start">
            <Grid className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-300 mb-1">
                Objetivo Principal
              </h3>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Preencher completamente os <strong>64 espaços</strong> de um tabuleiro <strong>8x8</strong> sem sobrepor peças e sem sair dos limites.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2 font-display">
              <Lock className="w-4 h-4 text-slate-400" />
              Peças Pretas (Fixas - 6 espaços)
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              Em cada partida, estas 3 peças pretas são distribuídas aleatoriamente pelo tabuleiro e <strong>permanecem imóveis</strong>:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
              <li className="bg-slate-950 text-slate-200 p-2 rounded-xl flex items-center justify-between border border-slate-800">
                <span>1x1 Quadrado</span>
                <span className="text-yellow-400 font-bold">1 espaço</span>
              </li>
              <li className="bg-slate-950 text-slate-200 p-2 rounded-xl flex items-center justify-between border border-slate-800">
                <span>1x2 ou 2x1 Linha</span>
                <span className="text-yellow-400 font-bold">2 espaços</span>
              </li>
              <li className="bg-slate-950 text-slate-200 p-2 rounded-xl flex items-center justify-between border border-slate-800">
                <span>1x3 ou 3x1 Linha</span>
                <span className="text-yellow-400 font-bold">3 espaços</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2 font-display">
              <Palette className="w-4 h-4 text-blue-400" />
              Peças Móveis (8 peças - 58 espaços)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <div className="font-bold text-red-400 mb-1">Peças Vermelhas (9 espaços)</div>
                <div className="text-slate-300">
                  • 1 peça de 4 espaços em linha (1x4 / 4x1)<br />
                  • 1 peça de 5 espaços em linha (1x5 / 5x1)
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <div className="font-bold text-yellow-400 mb-1">Peças Amarelas (13 espaços)</div>
                <div className="text-slate-300">
                  • 1 peça de 4 espaços em quadrado (2x2)<br />
                  • 1 peça de 9 espaços em quadrado (3x3)
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <div className="font-bold text-blue-400 mb-1">Peças Azuis (14 espaços)</div>
                <div className="text-slate-300">
                  • 1 peça de 6 espaços retangular (2x3 / 3x2)<br />
                  • 1 peça de 8 espaços retangular (2x4 / 4x2)
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <div className="font-bold text-slate-100 mb-1">Peças Brancas (22 espaços)</div>
                <div className="text-slate-300">
                  • 1 peça de 10 espaços retangular (2x5 / 5x2)<br />
                  • 1 peça de 12 espaços retangular (3x4 / 4x3)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60">
            <h4 className="font-bold text-white mb-1">Controles:</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              • <strong>Clique/Toque:</strong> Selecione uma peça no painel e clique no tabuleiro para posicionar.<br />
              • <strong>Arrastar & Soltar:</strong> Arraste a peça diretamente para a célula desejada.<br />
              • <strong>Girar:</strong> Clique no botão <em>Girar</em> ou pressione <em>R</em> no teclado para mudar a orientação da peça.<br />
              • <strong>Remover:</strong> Clique sobre uma peça já colocada no tabuleiro para devolvê-la ao painel.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Entendido! Vamos Jogar
          </button>
        </div>
      </div>
    </div>
  );
};
