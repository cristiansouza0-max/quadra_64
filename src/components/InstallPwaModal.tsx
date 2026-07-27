import React from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2, MoreVertical, ExternalLink, Sparkles } from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallNative?: () => void;
  isIOS?: boolean;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({
  isOpen,
  onClose,
  onInstallNative,
  isIOS,
}) => {
  if (!isOpen) return null;

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-sm w-full p-6 shadow-2xl flex flex-col items-center text-center gap-4 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border-2 border-blue-400/40 mt-2">
          <Smartphone className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white font-display">
            Instalar Quadra 64
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Jogue em tela cheia como um aplicativo nativo, direto na sua tela inicial!
          </p>
        </div>

        {isIOS ? (
          /* Instructions for iOS Safari */
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left flex flex-col gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">1</span>
              <p>Toque no botão de <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline text-blue-400" /> na barra do Safari.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">2</span>
              <p>Role para baixo e selecione <PlusSquare className="w-3.5 h-3.5 inline text-blue-400" /> <strong>Adicionar à Tela de Início</strong>.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">3</span>
              <p>Confirme clicando em <strong>Adicionar</strong> no canto superior.</p>
            </div>
          </div>
        ) : onInstallNative ? (
          /* Direct Android / Chrome Install Button (when prompt is available) */
          <div className="w-full flex flex-col gap-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 text-left flex flex-col gap-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Funciona Offline
              </div>
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Sem necessidade de app store
              </div>
            </div>

            <button
              onClick={onInstallNative}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>Instalar Agora no Celular</span>
            </button>
          </div>
        ) : isInIframe ? (
          /* When inside AI Studio iframe */
          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl p-3.5 text-left flex flex-col gap-2 text-xs text-slate-200">
              <div className="flex items-start gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Como instalar no seu celular:</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                O navegador não permite a instalação direta dentro da janela do chat. Clique no botão abaixo para <strong>abrir em nova aba</strong>.
              </p>
            </div>

            <button
              onClick={handleOpenNewTab}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>1º Passo: Abrir em Nova Aba</span>
            </button>
          </div>
        ) : (
          /* Manual Android / Chrome Instructions (When in direct tab, if prompt didn't auto-trigger) */
          <div className="w-full flex flex-col gap-3">
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-left flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                <p>Toque no menu <MoreVertical className="w-3.5 h-3.5 inline text-blue-400" /> (três pontos no topo do Chrome).</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                <p>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-400 py-1 cursor-pointer"
        >
          Agora não
        </button>
      </div>
    </div>
  );
};
