import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PieceDef } from '../types';
import { COLOR_CONFIG } from '../utils/gameEngine';

interface PiecePaletteProps {
  unplacedPieces: PieceDef[];
  placedPieceIds: string[];
  allPieces: PieceDef[];
  selectedPiece: PieceDef | null;
  selectedOrientation: { width: number; height: number };
  onSelectPiece: (piece: PieceDef) => void;
  onRotatePiece: (piece: PieceDef) => void;
  pieceOrientations: Record<string, { width: number; height: number }>;
}

export const PiecePalette: React.FC<PiecePaletteProps> = ({
  placedPieceIds,
  allPieces,
  selectedPiece,
  onSelectPiece,
  onRotatePiece,
  pieceOrientations,
}) => {
  // Filter out black fixed pieces
  const playablePieces = allPieces.filter((p) => !p.isFixed && p.color !== 'preta');

  const handlePieceClick = (piece: PieceDef, isPlaced: boolean) => {
    if (isPlaced) return;
    // Select and rotate piece on click
    onSelectPiece(piece);
    onRotatePiece(piece);
  };

  return (
    <div className="w-full h-full flex items-center justify-end overflow-hidden">
      {/* 2 Rows x 4 Columns Grid for the 8 playable pieces */}
      <div className="grid grid-cols-4 grid-rows-2 gap-1 sm:gap-2 w-auto ml-auto mr-0 items-center justify-items-center">
        {playablePieces.map((piece) => {
          const isPlaced = placedPieceIds.includes(piece.id);
          const isSelected = selectedPiece?.id === piece.id;
          const colorCfg = COLOR_CONFIG[piece.color];

          // Get current piece orientation
          const orientation =
            pieceOrientations[piece.id] || {
              width: piece.defaultWidth,
              height: piece.defaultHeight,
            };

          return (
            <div
              key={piece.id}
              onClick={() => handlePieceClick(piece, isPlaced)}
              draggable={!isPlaced}
              onDragStart={(e) => {
                onSelectPiece(piece);
                e.dataTransfer.setData('text/plain', piece.id);
              }}
              className={`relative transition-all cursor-pointer flex items-center justify-center p-0.5 sm:p-1 rounded-md sm:rounded-lg select-none ${
                isPlaced
                  ? 'opacity-20 pointer-events-none'
                  : isSelected
                  ? 'ring-2 ring-blue-400 bg-blue-500/10 scale-105 shadow-md'
                  : 'hover:scale-105 active:scale-95'
              }`}
              title={
                isPlaced
                  ? 'Peça já posicionada no tabuleiro'
                  : 'Clique para girar e selecionar / Arraste para o tabuleiro'
              }
            >
              {/* Visual Miniature Grid without background box or card border */}
              <div
                className="grid gap-0.5 p-0.5"
                style={{
                  gridTemplateColumns: `repeat(${orientation.width}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${orientation.height}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: orientation.width * orientation.height }).map(
                  (_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-2xs ${colorCfg.bg} border ${colorCfg.border} shadow-2xs`}
                    />
                  )
                )}
              </div>

              {/* Status Indicator if placed */}
              {isPlaced && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

