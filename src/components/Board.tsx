import React, { useState } from 'react';
import { RotateCw, X } from 'lucide-react';
import {
  BoardMatrix,
  PlacedPiece,
  PieceDef,
  PieceColor,
} from '../types';
import {
  BOARD_SIZE,
  COLOR_CONFIG,
  isValidPlacement,
  ALL_PIECES,
} from '../utils/gameEngine';

interface BoardProps {
  matrix: BoardMatrix;
  placedPieces: PlacedPiece[];
  selectedPiece: PieceDef | null;
  selectedOrientation: { width: number; height: number };
  onCellClick: (row: number, col: number) => void;
  onRemovePiece: (pieceId: string) => void;
  onRotateSelectedPiece: () => void;
  hintPiece?: { pieceId: string; row: number; col: number; width: number; height: number } | null;
}

export const Board: React.FC<BoardProps> = ({
  matrix,
  placedPieces,
  selectedPiece,
  selectedOrientation,
  onCellClick,
  onRemovePiece,
  onRotateSelectedPiece,
  hintPiece,
}) => {
  const [hoverPos, setHoverPos] = useState<{ row: number; col: number } | null>(null);

  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Check hover validity
  let isHoverValid = false;
  if (hoverPos && selectedPiece) {
    isHoverValid = isValidPlacement(
      matrix,
      hoverPos.row,
      hoverPos.col,
      selectedOrientation.width,
      selectedOrientation.height
    );
  }

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent, r: number, c: number) => {
    e.preventDefault();
    setHoverPos({ row: r, col: c });
  };

  const handleDrop = (e: React.DragEvent, r: number, c: number) => {
    e.preventDefault();
    onCellClick(r, c);
    setHoverPos(null);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[170px] xs:max-w-[230px] sm:max-w-[310px] ml-0 mr-auto">
      {/* Top Column Labels */}
      <div className="grid grid-cols-8 gap-0.5 sm:gap-1 w-full pl-4 sm:pl-6 pr-0.5 mb-0.5">
        {colLabels.map((col) => (
          <div
            key={col}
            className="text-center text-[8px] sm:text-[10px] font-bold font-mono text-slate-400 dark:text-zinc-500 uppercase"
          >
            {col}
          </div>
        ))}
      </div>

      <div className="flex w-full items-stretch">
        {/* Left Row Labels */}
        <div className="grid grid-rows-8 gap-0.5 sm:gap-1 pr-1 sm:pr-1.5 py-0.5 flex-col justify-between">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <div
              key={row}
              className="flex items-center justify-center text-[8px] sm:text-[10px] font-bold font-mono text-slate-400 dark:text-zinc-500"
            >
              {row}
            </div>
          ))}
        </div>

        {/* The 8x8 Board Grid Container */}
        <div className="relative flex-1 aspect-square board-container p-1 sm:p-2 rounded-lg sm:rounded-xl grid grid-cols-8 grid-rows-8 gap-0.5 sm:gap-1">
          {Array.from({ length: BOARD_SIZE }).map((_, r) =>
            Array.from({ length: BOARD_SIZE }).map((_, c) => {
              const cell = matrix[r][c];

              // Check if cell is within hover preview range
              let isHovered = false;
              if (
                hoverPos &&
                selectedPiece &&
                r >= hoverPos.row &&
                r < hoverPos.row + selectedOrientation.height &&
                c >= hoverPos.col &&
                c < hoverPos.col + selectedOrientation.width
              ) {
                isHovered = true;
              }

              // Check if cell is part of hint piece
              let isHintCell = false;
              if (
                hintPiece &&
                r >= hintPiece.row &&
                r < hintPiece.row + hintPiece.height &&
                c >= hintPiece.col &&
                c < hintPiece.col + hintPiece.width
              ) {
                isHintCell = true;
              }

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => onCellClick(r, c)}
                  onMouseEnter={() => setHoverPos({ row: r, col: c })}
                  onMouseLeave={() => setHoverPos(null)}
                  onDragOver={(e) => handleDragOver(e, r, c)}
                  onDrop={(e) => handleDrop(e, r, c)}
                  className={`relative rounded-lg transition-all duration-150 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                    cell === null
                      ? 'cell-empty border border-slate-700/50 hover:border-blue-400 hover:scale-[1.02]'
                      : cell.isFixed
                      ? 'bg-zinc-950/90 text-zinc-100 border-2 border-zinc-400 shadow-lg shadow-black/80 ring-1 ring-zinc-700/50'
                      : `${COLOR_CONFIG[cell.color || 'branca'].bg} ${
                          COLOR_CONFIG[cell.color || 'branca'].text
                        } border ${COLOR_CONFIG[cell.color || 'branca'].border} ${
                          COLOR_CONFIG[cell.color || 'branca'].shadow
                        } shadow-xs`
                  } ${
                    isHovered
                      ? isHoverValid
                        ? 'ring-2 ring-emerald-400 bg-emerald-500/40 z-10'
                        : 'ring-2 ring-rose-400 bg-rose-500/40 z-10'
                      : ''
                  } ${
                    isHintCell
                      ? 'ring-4 ring-yellow-400 animate-pulse z-20 shadow-lg shadow-yellow-500/50'
                      : ''
                  }`}
                >
                  {/* Cell coordinate overlay for empty cells */}
                  {cell === null && !isHovered && (
                    <span className="text-[10px] font-mono text-slate-500 font-medium select-none">
                      {colLabels[c]}
                      {r + 1}
                    </span>
                  )}
                </div>
              );
            })
          )}

          {/* Render Overlaid Interactive Remove & Rotate Buttons for Placed Pieces */}
          {placedPieces.map((placed) => {
            if (placed.isFixed) return null;
            const def = ALL_PIECES.find((p) => p.id === placed.pieceId);
            if (!def) return null;

            // Compute percentage bounding box over the grid
            const leftPct = (placed.col / BOARD_SIZE) * 100;
            const topPct = (placed.row / BOARD_SIZE) * 100;
            const widthPct = (placed.width / BOARD_SIZE) * 100;
            const heightPct = (placed.height / BOARD_SIZE) * 100;

            return (
              <div
                key={placed.pieceId}
                style={{
                  left: `calc(${leftPct}% + 8px)`,
                  top: `calc(${topPct}% + 8px)`,
                  width: `calc(${widthPct}% - 4px)`,
                  height: `calc(${heightPct}% - 4px)`,
                }}
                className="absolute pointer-events-none flex items-center justify-center group"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs p-1 rounded-full pointer-events-auto shadow-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePiece(placed.pieceId);
                    }}
                    className="p-1 hover:bg-rose-600 text-white rounded-full transition-colors"
                    title="Remover peça do tabuleiro"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
