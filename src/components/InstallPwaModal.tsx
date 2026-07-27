import React from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';

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
        ) : (
          /* Android / Desktop Install Action */
          <div className="w-full flex flex-col gap-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 text-left flex flex-col gap-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Funciona Offline
              </div>
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Sem necessidade de app store
              </div>
            </div>

            {onInstallNative && (
              <button
                onClick={onInstallNative}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Agora</span>
              </button>
            )}
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
