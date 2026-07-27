import { PieceDef, PieceColor, PlacedPiece, CellState, BoardMatrix } from '../types';

export const ALL_PIECES: PieceDef[] = [
  // Peças Pretas (Fixas) - Total 6 espaços
  {
    id: 'preta_1',
    name: 'Preta 1 Espaço',
    color: 'preta',
    spaces: 1,
    shapeType: 'linha',
    defaultWidth: 1,
    defaultHeight: 1,
    isFixed: true,
  },
  {
    id: 'preta_2',
    name: 'Preta 2 Espaços',
    color: 'preta',
    spaces: 2,
    shapeType: 'linha',
    defaultWidth: 1,
    defaultHeight: 2,
    isFixed: true,
  },
  {
    id: 'preta_3',
    name: 'Preta 3 Espaços',
    color: 'preta',
    spaces: 3,
    shapeType: 'linha',
    defaultWidth: 1,
    defaultHeight: 3,
    isFixed: true,
  },

  // Peças Vermelhas - Total 9 espaços
  {
    id: 'vermelha_4',
    name: 'Vermelha 4 Linha',
    color: 'vermelha',
    spaces: 4,
    shapeType: 'linha',
    defaultWidth: 1,
    defaultHeight: 4,
  },
  {
    id: 'vermelha_5',
    name: 'Vermelha 5 Linha',
    color: 'vermelha',
    spaces: 5,
    shapeType: 'linha',
    defaultWidth: 1,
    defaultHeight: 5,
  },

  // Peças Amarelas - Total 13 espaços
  {
    id: 'amarela_4',
    name: 'Amarela Quadrado 2x2',
    color: 'amarela',
    spaces: 4,
    shapeType: 'quadrado',
    defaultWidth: 2,
    defaultHeight: 2,
  },
  {
    id: 'amarela_9',
    name: 'Amarela Quadrado 3x3',
    color: 'amarela',
    spaces: 9,
    shapeType: 'quadrado',
    defaultWidth: 3,
    defaultHeight: 3,
  },

  // Peças Azuis - Total 14 espaços
  {
    id: 'azul_6',
    name: 'Azul Retângulo 2x3',
    color: 'azul',
    spaces: 6,
    shapeType: 'retangulo',
    defaultWidth: 2,
    defaultHeight: 3,
  },
  {
    id: 'azul_8',
    name: 'Azul Retângulo 2x4',
    color: 'azul',
    spaces: 8,
    shapeType: 'retangulo',
    defaultWidth: 2,
    defaultHeight: 4,
  },

  // Peças Brancas - Total 22 espaços
  {
    id: 'branca_10',
    name: 'Branca Retângulo 2x5',
    color: 'branca',
    spaces: 10,
    shapeType: 'retangulo',
    defaultWidth: 2,
    defaultHeight: 5,
  },
  {
    id: 'branca_12',
    name: 'Branca Retângulo 3x4',
    color: 'branca',
    spaces: 12,
    shapeType: 'retangulo',
    defaultWidth: 3,
    defaultHeight: 4,
  },
];

export const BOARD_SIZE = 8;

export const COLOR_CONFIG: Record<
  PieceColor,
  {
    bg: string;
    text: string;
    border: string;
    label: string;
    hoverBg: string;
    shadow: string;
  }
> = {
  preta: {
    bg: 'bg-zinc-950',
    text: 'text-zinc-100',
    border: 'border-zinc-500',
    label: 'Preta',
    hoverBg: 'hover:bg-zinc-900',
    shadow: 'shadow-black/60',
  },
  vermelha: {
    bg: 'bg-red-500 piece-shadow',
    text: 'text-white',
    border: 'border-red-600',
    label: 'Vermelha',
    hoverBg: 'hover:bg-red-400',
    shadow: 'shadow-red-950/30',
  },
  amarela: {
    bg: 'bg-yellow-500 piece-shadow',
    text: 'text-slate-950 font-bold',
    border: 'border-yellow-600',
    label: 'Amarela',
    hoverBg: 'hover:bg-yellow-400',
    shadow: 'shadow-yellow-950/30',
  },
  azul: {
    bg: 'bg-blue-500 piece-shadow',
    text: 'text-white',
    border: 'border-blue-600',
    label: 'Azul',
    hoverBg: 'hover:bg-blue-400',
    shadow: 'shadow-blue-950/30',
  },
  branca: {
    bg: 'bg-slate-100 piece-shadow',
    text: 'text-slate-900 font-bold',
    border: 'border-slate-300',
    label: 'Branca',
    hoverBg: 'hover:bg-white',
    shadow: 'shadow-slate-900/20',
  },
};

/**
  * Check if a piece placement is valid on a given matrix
  */
export function isValidPlacement(
  matrix: BoardMatrix,
  row: number,
  col: number,
  width: number,
  height: number,
  ignorePieceId: string | null = null
): boolean {
  if (row < 0 || col < 0 || row + height > BOARD_SIZE || col + width > BOARD_SIZE) {
    return false;
  }

  for (let r = row; r < row + height; r++) {
    for (let c = col; c < col + width; c++) {
      const cell = matrix[r][c];
      if (cell !== null && cell.pieceId !== ignorePieceId) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Creates an empty 8x8 matrix
 */
export function createEmptyMatrix(): BoardMatrix {
  const matrix: BoardMatrix = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: (CellState | null)[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push(null);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Constructs current matrix from placed pieces list
 */
export function buildMatrix(placedPieces: PlacedPiece[]): BoardMatrix {
  const matrix = createEmptyMatrix();

  for (const placed of placedPieces) {
    const def = ALL_PIECES.find((p) => p.id === placed.pieceId);
    if (!def) continue;

    for (let r = placed.row; r < placed.row + placed.height; r++) {
      for (let c = placed.col; c < placed.col + placed.width; c++) {
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
          matrix[r][c] = {
            row: r,
            col: c,
            pieceId: placed.pieceId,
            color: def.color,
            isFixed: !!placed.isFixed,
          };
        }
      }
    }
  }

  return matrix;
}

/**
 * Generate possible dimensions for a piece (orientation: width vs height)
 */
export function getOrientations(piece: PieceDef): { width: number; height: number }[] {
  if (piece.defaultWidth === piece.defaultHeight) {
    return [{ width: piece.defaultWidth, height: piece.defaultHeight }];
  }
  return [
    { width: piece.defaultWidth, height: piece.defaultHeight },
    { width: piece.defaultHeight, height: piece.defaultWidth },
  ];
}

/**
 * Exact solution layout matching the physical board game image provided by the user.
 */
export const IMAGE_SOLUTION: PlacedPiece[] = [
  { pieceId: 'branca_12', row: 0, col: 0, width: 3, height: 4, isFixed: false },
  { pieceId: 'branca_10', row: 0, col: 3, width: 5, height: 2, isFixed: false },
  { pieceId: 'amarela_4', row: 2, col: 3, width: 2, height: 2, isFixed: false },
  { pieceId: 'amarela_9', row: 2, col: 5, width: 3, height: 3, isFixed: false },
  { pieceId: 'vermelha_5', row: 4, col: 0, width: 5, height: 1, isFixed: false },
  { pieceId: 'vermelha_4', row: 5, col: 0, width: 4, height: 1, isFixed: false },
  { pieceId: 'azul_8', row: 6, col: 0, width: 4, height: 2, isFixed: false },
  { pieceId: 'azul_6', row: 5, col: 4, width: 2, height: 3, isFixed: false },
  { pieceId: 'preta_3', row: 5, col: 6, width: 1, height: 3, isFixed: true },
  { pieceId: 'preta_2', row: 5, col: 7, width: 1, height: 2, isFixed: true },
  { pieceId: 'preta_1', row: 7, col: 7, width: 1, height: 1, isFixed: true },
];

/**
 * Applies a random 2D rotation/reflection symmetry to a board solution
 */
export function transformSolution(solution: PlacedPiece[]): PlacedPiece[] {
  const transformType = Math.floor(Math.random() * 8);

  return solution.map((p) => {
    let r = p.row;
    let c = p.col;
    let w = p.width;
    let h = p.height;

    switch (transformType) {
      case 1: // 90 deg CW
        r = p.col;
        c = BOARD_SIZE - p.row - p.height;
        w = p.height;
        h = p.width;
        break;
      case 2: // 180 deg
        r = BOARD_SIZE - p.row - p.height;
        c = BOARD_SIZE - p.col - p.width;
        break;
      case 3: // 270 deg CW
        r = BOARD_SIZE - p.col - p.width;
        c = p.row;
        w = p.height;
        h = p.width;
        break;
      case 4: // Flip Horizontal
        c = BOARD_SIZE - p.col - p.width;
        break;
      case 5: // Flip Vertical
        r = BOARD_SIZE - p.row - p.height;
        break;
      case 6: // Transpose
        r = p.col;
        c = p.row;
        w = p.height;
        h = p.width;
        break;
      case 7: // Anti-transpose
        r = BOARD_SIZE - p.col - p.width;
        c = BOARD_SIZE - p.row - p.height;
        w = p.height;
        h = p.width;
        break;
      default: // 0 deg
        break;
    }

    return {
      ...p,
      row: r,
      col: c,
      width: w,
      height: h,
    };
  });
}

/**
 * Backtracking solver function to generate fresh solvable 8x8 layouts
 */
function findSolvableBoard(): PlacedPiece[] | null {
  // Sort pieces by area descending
  const pieces = [...ALL_PIECES].sort((a, b) => b.spaces - a.spaces);
  const matrix = createEmptyMatrix();
  const placed: PlacedPiece[] = [];

  function backtrack(pieceIdx: number): boolean {
    if (pieceIdx >= pieces.length) {
      return true;
    }

    const piece = pieces[pieceIdx];
    const orientations = getOrientations(piece);
    if (Math.random() < 0.5 && orientations.length > 1) {
      orientations.reverse();
    }

    // Find top-leftmost empty cell
    let startR = -1;
    let startC = -1;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (matrix[r][c] === null) {
          startR = r;
          startC = c;
          break;
        }
      }
      if (startR !== -1) break;
    }

    if (startR === -1) return false;

    for (const orient of orientations) {
      if (isValidPlacement(matrix, startR, startC, orient.width, orient.height)) {
        for (let r = startR; r < startR + orient.height; r++) {
          for (let c = startC; c < startC + orient.width; c++) {
            matrix[r][c] = {
              row: r,
              col: c,
              pieceId: piece.id,
              color: piece.color,
              isFixed: !!piece.isFixed,
            };
          }
        }

        placed.push({
          pieceId: piece.id,
          row: startR,
          col: startC,
          width: orient.width,
          height: orient.height,
          isFixed: !!piece.isFixed,
        });

        if (backtrack(pieceIdx + 1)) return true;

        placed.pop();
        for (let r = startR; r < startR + orient.height; r++) {
          for (let c = startC; c < startC + orient.width; c++) {
            matrix[r][c] = null;
          }
        }
      }
    }

    return false;
  }

  if (backtrack(0)) {
    return placed;
  }
  return null;
}

/**
 * Backtracking solver/generator to produce a guaranteed 100% solvable 8x8 layout.
 */
export function generateSolvableBoard(): {
  solution: PlacedPiece[];
  fixedPieces: PlacedPiece[];
} {
  // Try live backtracking first
  const generated = findSolvableBoard();
  let rawSolution: PlacedPiece[];

  if (generated && generated.length === 11) {
    rawSolution = generated;
  } else {
    // Fallback to transformed IMAGE_SOLUTION
    rawSolution = transformSolution(IMAGE_SOLUTION);
  }

  // Ensure black pieces are marked as fixed and colored correctly
  const solution = rawSolution.map((p) => {
    const isBlack = p.pieceId.startsWith('preta_');
    return {
      ...p,
      isFixed: isBlack,
    };
  });

  const fixedPieces = solution.filter((p) => p.isFixed);
  return { solution, fixedPieces };
}

/**
 * Calculates game progress stats
 */
export function calculateProgress(placedPieces: PlacedPiece[]): {
  totalOccupied: number;
  percentage: number;
  isComplete: boolean;
} {
  let playerOccupied = 0;
  for (const item of placedPieces) {
    if (!item.isFixed) {
      playerOccupied += item.width * item.height;
    }
  }

  // 8 playable pieces occupy 58 total spaces (64 total - 6 fixed black spaces)
  const isComplete = playerOccupied === 58;
  const percentage = Math.min(100, Math.round((playerOccupied / 58) * 100));

  return { totalOccupied: playerOccupied, percentage, isComplete };
}
