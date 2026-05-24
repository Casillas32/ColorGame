import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './components/StartScreen';
import Header from './components/Header';
import TimerBar from './components/TimerBar';
import GameBoard from './components/GameBoard';
import GameOverScreen from './components/GameOverScreen';

import {
  generateGameColors,
  DifficultyMode,
  GameColors,
} from './utils/colorGenerator';

const MAX_TIME = 15.0; // Segundos máximos del temporizador
const HIGH_SCORES_KEY = '@colorkraft:highscores_v1';

interface HighScores {
  easy: number;
  medium: number;
  hard: number;
}

const defaultHighScores: HighScores = {
  easy: 0,
  medium: 0,
  hard: 0,
};

export default function App() {
  // Estados de Pantalla: 'loading' | 'start' | 'playing' | 'gameover'
  const [screen, setScreen] = useState<'loading' | 'start' | 'playing' | 'gameover'>('loading');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('medium');
  const [highScores, setHighScores] = useState<HighScores>(defaultHighScores);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Estados del Juego
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [isHintActive, setIsHintActive] = useState(false);

  // Estado de Colores y Tablero
  const [colors, setColors] = useState<GameColors | null>(null);
  const [targetIndex, setTargetIndex] = useState(0);

  // Temporizador
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const timerRef = useRef<any>(null);
  const lastTapTimeRef = useRef<number | null>(null);

  // Cargar puntuaciones más altas al iniciar
  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    try {
      const stored = await AsyncStorage.getItem(HIGH_SCORES_KEY);
      if (stored) {
        setHighScores(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error al cargar records:', e);
    } finally {
      setScreen('start');
    }
  };

  const saveHighScore = async (newScore: number, mode: DifficultyMode) => {
    try {
      const updated = {
        ...highScores,
        [mode]: Math.max(highScores[mode], newScore),
      };
      setHighScores(updated);
      await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error al guardar record:', e);
    }
  };

  // Manejo del ciclo del temporizador
  useEffect(() => {
    if (screen === 'playing') {
      // Iniciar temporizador (actualiza cada 100ms para una animación ultra fluida)
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            handleGameOver();
            return 0;
          }
          return parseFloat((prev - 0.1).toFixed(2));
        });
      }, 100);
    }

    return () => {
      stopTimer();
    };
  }, [screen]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startNewGame = (mode: DifficultyMode) => {
    setDifficulty(mode);
    setLevel(1);
    setScore(0);
    setCombo(1);
    setHintsLeft(mode === 'easy' ? 3 : mode === 'medium' ? 2 : 1); // Más pistas en modo fácil
    setIsHintActive(false);
    setTimeLeft(MAX_TIME);
    lastTapTimeRef.current = null;
    setIsNewRecord(false);

    // Generar primer tablero
    const initialColors = generateGameColors(1, mode);
    setColors(initialColors);
    setTargetIndex(Math.floor(Math.random() * 9));

    setScreen('playing');
  };

  const nextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    setIsHintActive(false);

    // Generar nuevos colores para el siguiente nivel
    const newColors = generateGameColors(nextLvl, difficulty);
    setColors(newColors);
    setTargetIndex(Math.floor(Math.random() * 9));

    // Bonificación de tiempo al acertar
    const timeBonus = difficulty === 'easy' ? 3.0 : difficulty === 'medium' ? 2.0 : 1.0;
    setTimeLeft((prev) => Math.min(MAX_TIME, prev + timeBonus));
  };

  const handleSelectTile = (isCorrect: boolean) => {
    if (isCorrect) {
      const now = Date.now();
      let nextCombo = 1;

      // Evaluar Combo
      if (lastTapTimeRef.current) {
        const timeDiff = now - lastTapTimeRef.current;
        if (timeDiff <= 2200) {
          // Si responde en menos de 2.2 segundos incrementa el combo (máximo combo x5)
          nextCombo = Math.min(5, combo + 1);
        }
      }
      setCombo(nextCombo);
      lastTapTimeRef.current = now;

      // Calcular Puntuación del Nivel
      // Fórmula: 100 base * nivel actual * multiplicador de combo
      const addedScore = 100 * level * nextCombo;
      setScore((prev) => prev + addedScore);

      // Pasar de nivel
      nextLevel();
    } else {
      // Penalización por error
      setCombo(1); // Rompe el combo
      
      const penalty = difficulty === 'easy' ? 1.5 : difficulty === 'medium' ? 3.0 : 4.0;
      setTimeLeft((prev) => Math.max(0, parseFloat((prev - penalty).toFixed(2))));
    }
  };

  const handleGameOver = () => {
    stopTimer();
    
    // Verificar si es un nuevo record para esta dificultad
    const currentRecord = highScores[difficulty];
    const isNew = score > currentRecord;
    
    if (isNew) {
      setIsNewRecord(true);
      saveHighScore(score, difficulty);
    } else {
      setIsNewRecord(false);
    }

    setScreen('gameover');
  };

  const handleUseHint = () => {
    if (hintsLeft > 0 && !isHintActive) {
      setHintsLeft((prev) => prev - 1);
      setIsHintActive(true);
    }
  };

  if (screen === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0B10" />
      
      {screen === 'start' && (
        <StartScreen onStartGame={startNewGame} highScores={highScores} />
      )}

      {screen === 'playing' && colors && (
        <View style={styles.gameContainer}>
          <Header
            level={level}
            score={score}
            highScore={highScores[difficulty]}
            combo={combo}
            hintsLeft={hintsLeft}
            onUseHint={handleUseHint}
            onExit={() => setScreen('start')}
          />
          
          <TimerBar timeLeft={timeLeft} maxTime={MAX_TIME} />

          <View style={styles.boardWrapper}>
            <GameBoard
              baseColor={colors.baseColor}
              diffColor={colors.diffColor}
              targetIndex={targetIndex}
              isHintActive={isHintActive}
              onSelectTile={handleSelectTile}
            />
          </View>
        </View>
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          score={score}
          level={level}
          difficulty={difficulty}
          isNewRecord={isNewRecord}
          onRestart={() => startNewGame(difficulty)}
          onGoToMenu={() => setScreen('start')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B10',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0B10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
});
