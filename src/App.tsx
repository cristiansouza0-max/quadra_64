import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieceDef,
  PlacedPiece,
  GameStats,
  GameMode,
  GameRecord,
  Achievement,
} from './types';
import {
  ALL_PIECES,
  generateSolvableBoard,
  buildMatrix,
  isValidPlacement,
  calculateProgress,
  getOrientations,
} from './utils/gameEngine';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { Board } from './components/Board';
import { PiecePalette } from './components/PiecePalette';
import { RulesModal } from './components/RulesModal';
import { VictoryModal } from './components/VictoryModal';
import { StatsModal } from './components/StatsModal';
import { HistoryModal } from './components/HistoryModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HomeScreen } from './components/HomeScreen';
import { InstallPwaModal } from './components/InstallPwaModal';
import { Info, Sparkles } from 'lucide-react';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: 'Primeiro Encaixe', description: 'Vença sua 1ª partida no Quadra 64.', icon: 'trophy', unlocked: false },
  { id: 'fast_time', title: 'Velocista das Peças', description: 'Vença em menos de 2 minutos no modo cronômetro.', icon: 'zap', unlocked: false },
  { id: 'no_hints', title: 'Estrategista Puro', description: 'Vença uma partida sem usar nenhuma dica.', icon: 'brain', unlocked: false },
  { id: 'streak_3', title: 'Sequência Imparável', description: 'Alcance uma sequência de 3 vitórias seguidas.', icon: 'flame', unlocked: false },
  { id: 'master_5', title: 'Mestre dos Blocos', description: 'Vença 5 partidas no total.', icon: 'target', unlocked: false },
  { id: 'perfect_64', title: 'Perfeição 8x8', description: 'Preencha todos os 64 espaços do tabuleiro.', icon: 'award', unlocked: false },
];

export default function App() {
  // Navigation View State ('home' or 'game')
  const [viewMode, setViewMode] = useState<'home' | 'game'>('home');

  // Game board state
  const [fixedPieces, setFixedPieces] = useState<PlacedPiece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [solution, setSolution] = useState<PlacedPiece[]>([]);
  const [history, setHistory] = useState<PlacedPiece[][]>([]);

  const [selectedPiece, setSelectedPiece] = useState<PieceDef | null>(null);
  const [pieceOrientations, setPieceOrientations] = useState<
    Record<string, { width: number; height: number }>
  >({});

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('casual');

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallNativePwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstallModalOpen(false);
          showToast('Quadra 64 instalado com sucesso!');
        }
      });
    }
  };

  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [hintPiece, setHintPiece] = useState<{
    pieceId: string;
    row: number;
    col: number;
    width: number;
    height: number;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  // Ref to prevent duplicate victory processing
  const victoryHandledRef = useRef(false);

  // Stats in localStorage
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('Quadra64_stats');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Sanitize corrupted stats if inflated by previous loop bug
          if (parsed.gamesWon > 500 || parsed.gamesWon > (parsed.gamesPlayed || 0) * 5) {
            parsed.gamesWon = Math.min(parsed.gamesWon, parsed.gamesPlayed || 0);
            parsed.currentStreak = 0;
          }
          return parsed;
        } catch {}
      }
    }
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTimeSeconds: null,
      currentStreak: 0,
      xp: 0,
    };
  });

  // History Records in localStorage
  const [historyRecords, setHistoryRecords] = useState<GameRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('Quadra64_history');
      if (saved) {
        try {
          const parsed: GameRecord[] = JSON.parse(saved);
          // Deduplicate loop duplicates and limit history length
          const unique = parsed.filter(
            (rec, idx, arr) =>
              arr.findIndex((r) => Math.abs(r.timestamp - rec.timestamp) < 2000) === idx
          );
          return unique.slice(0, 50);
        } catch {}
      }
    }
    return [];
  });

  // Achievements in localStorage
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('Quadra64_achievements');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined }));
  });

  // Reset all data helper
  const handleResetAllData = useCallback(() => {
    const emptyStats: GameStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTimeSeconds: null,
      currentStreak: 0,
      xp: 0,
    };
    const emptyAchievements = INITIAL_ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: false,
      unlockedAt: undefined,
    }));

    setStats(emptyStats);
    setHistoryRecords([]);
    setAchievements(emptyAchievements);

    if (typeof window !== 'undefined') {
      localStorage.setItem('Quadra64_stats', JSON.stringify(emptyStats));
      localStorage.setItem('Quadra64_history', JSON.stringify([]));
      localStorage.setItem('Quadra64_achievements', JSON.stringify(emptyAchievements));
    }

    showToast('Histórico, Conquistas e Estatísticas foram zerados!');
  }, [showToast]);

  // Persist Stats
  useEffect(() => {
    localStorage.setItem('Quadra64_stats', JSON.stringify(stats));
  }, [stats]);

  // Persist History Records
  useEffect(() => {
    localStorage.setItem('Quadra64_history', JSON.stringify(historyRecords));
  }, [historyRecords]);

  // Persist Achievements
  useEffect(() => {
    localStorage.setItem('Quadra64_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Start new game setup
  const initNewGame = useCallback((overrideMode?: GameMode) => {
    victoryHandledRef.current = false;
    const currentMode = overrideMode || gameMode;
    const { solution: newSolution, fixedPieces: newFixed } = generateSolvableBoard();

    setFixedPieces(newFixed);
    setPlacedPieces(newFixed);
    setSolution(newSolution);
    setHistory([]);
    setSelectedPiece(null);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setHintsUsed(0);
    setHintPiece(null);
    setIsVictoryOpen(false);

    // Default orientations
    const defaultOrients: Record<string, { width: number; height: number }> = {};
    ALL_PIECES.forEach((p) => {
      defaultOrients[p.id] = {
        width: p.defaultWidth,
        height: p.defaultHeight,
      };
    });
    setPieceOrientations(defaultOrients);

    // Increment played stat only in competitive modes (not Casual/Free mode)
    if (currentMode !== 'casual') {
      setStats((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
      }));
    }
  }, [gameMode]);

  // Run initial game setup once
  useEffect(() => {
    initNewGame();
  }, [initNewGame]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isVictoryOpen && viewMode === 'game') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isVictoryOpen, viewMode]);

  // Board matrix & progress calculations
  const matrix = useMemo(() => buildMatrix(placedPieces), [placedPieces]);
  const progress = useMemo(() => calculateProgress(placedPieces), [placedPieces]);

  const placedPieceIds = useMemo(
    () => placedPieces.map((p) => p.pieceId),
    [placedPieces]
  );

  const unplacedPieces = useMemo(() => {
    return ALL_PIECES.filter(
      (p) => !p.isFixed && !placedPieceIds.includes(p.id)
    );
  }, [placedPieceIds]);

  const selectedOrientation = useMemo(() => {
    if (!selectedPiece) return { width: 1, height: 1 };
    return (
      pieceOrientations[selectedPiece.id] || {
        width: selectedPiece.defaultWidth,
        height: selectedPiece.defaultHeight,
      }
    );
  }, [selectedPiece, pieceOrientations]);

  // Handle game victory evaluation
  useEffect(() => {
    if (progress.isComplete && placedPieces.length === 11) {
      if (victoryHandledRef.current) return;
      victoryHandledRef.current = true;

      setIsTimerRunning(false);

      if (gameMode === 'timer') {
        setIsVictoryOpen(true);
        soundManager.playVictorySound();

        // Update stats (+10 XP)
        setStats((prev) => {
          const newBest =
            prev.bestTimeSeconds === null
              ? timerSeconds
              : Math.min(prev.bestTimeSeconds, timerSeconds);

          return {
            ...prev,
            gamesWon: prev.gamesWon + 1,
            xp: (prev.xp ?? 0) + 10,
            bestTimeSeconds: newBest,
            currentStreak: prev.currentStreak + 1,
          };
        });

        // Add to match history
        const newRecord: GameRecord = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          timeSeconds: timerSeconds,
          hintsUsed: hintsUsed,
          mode: gameMode,
          won: true,
        };
        setHistoryRecords((prev) => [newRecord, ...prev]);

        // Unlock achievements
        setAchievements((prev) =>
          prev.map((a) => {
            let shouldUnlock = a.unlocked;
            if (a.id === 'first_win') shouldUnlock = true;
            if (a.id === 'fast_time' && timerSeconds > 0 && timerSeconds <= 120) shouldUnlock = true;
            if (a.id === 'no_hints' && hintsUsed === 0) shouldUnlock = true;
            if (a.id === 'streak_3' && stats.currentStreak + 1 >= 3) shouldUnlock = true;
            if (a.id === 'master_5' && stats.gamesWon + 1 >= 5) shouldUnlock = true;
            if (a.id === 'perfect_64') shouldUnlock = true;

            return shouldUnlock ? { ...a, unlocked: true, unlockedAt: a.unlockedAt || Date.now() } : a;
          })
        );
      } else {
        // Modo Livre / Casual: victory sound + toast only, no victory modal popup
        soundManager.playVictorySound();
        showToast('Parabéns! Tabuleiro concluído no Modo Livre!');
      }
    }
  }, [progress.isComplete, placedPieces.length, timerSeconds, gameMode, hintsUsed, stats.currentStreak, stats.gamesWon, showToast]);

  // Start game from Home screen
  const handleStartGameFromHome = (mode: GameMode) => {
    setGameMode(mode);
    setViewMode('game');
    initNewGame();
  };

  // Rotation
  const handleRotatePiece = (piece: PieceDef) => {
    const orientations = getOrientations(piece);
    if (orientations.length <= 1) return;

    const current = pieceOrientations[piece.id] || {
      width: piece.defaultWidth,
      height: piece.defaultHeight,
    };

    setPieceOrientations((prev) => ({
      ...prev,
      [piece.id]: { width: current.height, height: current.width },
    }));

    soundManager.playRotateSound();
  };

  // Place selected piece on grid
  const handleCellClick = (r: number, c: number) => {
    const existingCell = matrix[r][c];
    if (existingCell && !existingCell.isFixed) {
      handleRemovePiece(existingCell.pieceId);
      const pieceDef = ALL_PIECES.find((p) => p.id === existingCell.pieceId);
      if (pieceDef) setSelectedPiece(pieceDef);
      return;
    }

    if (!selectedPiece) return;

    const orient = selectedOrientation;
    if (isValidPlacement(matrix, r, c, orient.width, orient.height)) {
      setHistory((prev) => [...prev, placedPieces]);

      const newPlaced: PlacedPiece = {
        pieceId: selectedPiece.id,
        row: r,
        col: c,
        width: orient.width,
        height: orient.height,
      };

      setPlacedPieces((prev) => [...prev, newPlaced]);
      if (gameMode === 'timer' && !isTimerRunning) {
        setIsTimerRunning(true);
      }
      soundManager.playPlaceSound();
      setHintPiece(null);

      const nextAvailable = unplacedPieces.find((p) => p.id !== selectedPiece.id);
      setSelectedPiece(nextAvailable || null);
    } else {
      soundManager.playErrorSound();
    }
  };

  const handleRemovePiece = (pieceId: string) => {
    setHistory((prev) => [...prev, placedPieces]);
    setPlacedPieces((prev) => prev.filter((p) => p.pieceId !== pieceId));
    soundManager.playRemoveSound();
    setHintPiece(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setPlacedPieces(lastState);
    soundManager.playRemoveSound();
    setHintPiece(null);
  };

  const handleClear = () => {
    setHistory((prev) => [...prev, placedPieces]);
    setPlacedPieces(fixedPieces);
    setSelectedPiece(unplacedPieces[0] || null);
    soundManager.playRemoveSound();
    setHintPiece(null);
  };

  const handleHint = () => {
    const currentXP = stats.xp ?? 0;
    if (currentXP < 5) {
      showToast('Você precisa de pelo menos 5 XP para usar uma dica!');
      soundManager.playErrorSound();
      return;
    }

    if (solution.length === 0) return;

    const missingInSolution = solution.find((solItem) => {
      if (solItem.isFixed) return false;
      const current = placedPieces.find((p) => p.pieceId === solItem.pieceId);
      if (!current) return true;
      return (
        current.row !== solItem.row ||
        current.col !== solItem.col ||
        current.width !== solItem.width ||
        current.height !== solItem.height
      );
    });

    if (missingInSolution) {
      // Deduct 5 XP
      setStats((prev) => ({
        ...prev,
        xp: Math.max(0, (prev.xp ?? 0) - 5),
      }));

      setHintsUsed((prev) => prev + 1);
      soundManager.playHintSound();
      showToast('Dica de posição utilizada (-5 XP)');

      setPieceOrientations((prev) => ({
        ...prev,
        [missingInSolution.pieceId]: {
          width: missingInSolution.width,
          height: missingInSolution.height,
        },
      }));

      setHintPiece({
        pieceId: missingInSolution.pieceId,
        row: missingInSolution.row,
        col: missingInSolution.col,
        width: missingInSolution.width,
        height: missingInSolution.height,
      });

      const pDef = ALL_PIECES.find((p) => p.id === missingInSolution.pieceId);
      if (pDef) setSelectedPiece(pDef);
    }
  };

  const handleSolve = () => {
    if (solution.length === 0) return;

    // Consumes all XP regardless of current amount
    setStats((prev) => ({
      ...prev,
      xp: 0,
    }));

    setHistory((prev) => [...prev, placedPieces]);
    setPlacedPieces(solution);

    const solOrients: Record<string, { width: number; height: number }> = {};
    solution.forEach((s) => {
      solOrients[s.pieceId] = { width: s.width, height: s.height };
    });
    setPieceOrientations(solOrients);
    soundManager.playVictorySound();
    setHintPiece(null);
    showToast('Solução exibida. Todo o seu XP foi consumido (0 XP).');
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white overflow-hidden relative">
      {/* XP Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-2xl border-2 border-amber-300 text-xs sm:text-sm flex items-center gap-2 pointer-events-none uppercase tracking-wide"
          >
            <Sparkles className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Switch: Animated Home Screen or Active Game View */}
      {viewMode === 'home' ? (
        <HomeScreen
          onStartGame={handleStartGameFromHome}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          stats={stats}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundManager.toggleMute())}
          unlockedAchievementsCount={unlockedCount}
          totalAchievementsCount={achievements.length}
          onInstallPwa={() => setIsInstallModalOpen(true)}
        />
      ) : (
        <div className="h-full h-[100dvh] max-h-[100dvh] w-full max-w-7xl mx-auto flex flex-col justify-between overflow-hidden p-1.5 sm:p-3">
          {/* Header */}
          <Header
            mode={gameMode}
            setMode={setGameMode}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={() => setIsTimerRunning((prev) => !prev)}
            onResetTimer={() => setTimerSeconds(0)}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(soundManager.toggleMute())}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
            onNewGame={initNewGame}
            onReturnHome={() => setViewMode('home')}
            progress={progress}
            xp={stats.xp ?? 0}
            onUndo={handleUndo}
            canUndo={history.length > 0}
            onClear={handleClear}
            canClear={placedPieces.length > fixedPieces.length}
            onHint={handleHint}
            onSolve={handleSolve}
          />

          {/* Main Board View - Forced Horizontal Layout on Mobile & Desktop */}
          <main className="flex-1 px-1 sm:px-6 py-1 flex flex-col justify-center items-center min-h-0 overflow-hidden">
            {/* Split Screen Grid: Left (Tabuleiro) | Right (Peças Disponíveis em 4x2) - Forced Horizontal */}
            <div className="flex-1 grid grid-cols-12 gap-1 sm:gap-6 max-w-6xl mx-auto w-full items-center justify-between min-h-0 py-1">
              {/* Left Column: Tabuleiro (extrema esquerda em mobile e desktop) */}
              <div className="col-span-6 flex items-center justify-start min-h-0 py-1 shrink-0">
                <Board
                  matrix={matrix}
                  placedPieces={placedPieces}
                  selectedPiece={selectedPiece}
                  selectedOrientation={selectedOrientation}
                  onCellClick={handleCellClick}
                  onRemovePiece={handleRemovePiece}
                  onRotateSelectedPiece={() => selectedPiece && handleRotatePiece(selectedPiece)}
                  hintPiece={hintPiece}
                />
              </div>

              {/* Right Column: Peças Disponíveis (extrema direita em mobile e desktop - 4x2) */}
              <div className="col-span-6 flex items-center justify-end min-h-0 py-1 shrink-0">
                <PiecePalette
                  unplacedPieces={unplacedPieces}
                  placedPieceIds={placedPieceIds}
                  allPieces={ALL_PIECES}
                  selectedPiece={selectedPiece}
                  selectedOrientation={selectedOrientation}
                  onSelectPiece={setSelectedPiece}
                  onRotatePiece={handleRotatePiece}
                  pieceOrientations={pieceOrientations}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetAllData}
      />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyRecords={historyRecords}
        onClearHistory={handleResetAllData}
      />
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />
      <VictoryModal
        isOpen={isVictoryOpen}
        timeSeconds={timerSeconds}
        hintsUsed={hintsUsed}
        mode={gameMode}
        onNewGame={() => initNewGame()}
        onClose={() => setIsVictoryOpen(false)}
      />
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstallNative={deferredPrompt ? handleInstallNativePwa : undefined}
        isIOS={isIOS}
      />
    </div>
  );
}
