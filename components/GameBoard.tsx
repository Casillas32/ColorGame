import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const GRID_SIZE = 3; // Fijo 3x3 como lo solicita el usuario
const GAP = 12;
const BOARD_PADDING = 16;
const CONTAINER_WIDTH = width * 0.92;
const TILE_SIZE = (CONTAINER_WIDTH - BOARD_PADDING * 3 - GAP * (GRID_SIZE - 1)) / GRID_SIZE;

interface GameBoardProps {
  baseColor: string;
  diffColor: string;
  targetIndex: number;
  isHintActive: boolean;
  onSelectTile: (isCorrect: boolean) => void;
}

export default function GameBoard({
  baseColor,
  diffColor,
  targetIndex,
  isHintActive,
  onSelectTile,
}: GameBoardProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const boardScale = useRef(new Animated.Value(0.9)).current;
  const boardOpacity = useRef(new Animated.Value(0)).current;
  const hintPulseAnim = useRef(new Animated.Value(1)).current;

  // Animación de entrada de la cuadrícula
  useEffect(() => {
    boardScale.setValue(0.92);
    boardOpacity.setValue(0.2);

    Animated.parallel([
      Animated.spring(boardScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(boardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [baseColor]); // Se vuelve a animar sutilmente cuando cambia el color (nuevo nivel)

  // Bucle de animación pulsante para la pista (si está activa)
  useEffect(() => {
    if (isHintActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintPulseAnim, {
            toValue: 1.15,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(hintPulseAnim, {
            toValue: 1.0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      hintPulseAnim.setValue(1);
    }
  }, [isHintActive]);

  const triggerShake = () => {
    // Vibración pesada de error
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Animación de sacudida (shake)
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleTilePress = (index: number) => {
    const isCorrect = index === targetIndex;

    if (isCorrect) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSelectTile(true);
    } else {
      triggerShake();
      onSelectTile(false);
    }
  };

  // Renderizar las 9 baldosas
  const renderTiles = () => {
    const tiles = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const isTarget = i === targetIndex;
      const tileColor = isTarget ? diffColor : baseColor;

      const tileStyle = [
        styles.tile,
        {
          backgroundColor: tileColor,
          width: TILE_SIZE,
          height: TILE_SIZE,
        },
      ];

      // Si la pista está activa y esta es la baldosa correcta, agregamos una animación pulsante y un borde brillante
      if (isTarget && isHintActive) {
        tiles.push(
          <Animated.View
            key={i}
            style={{
              transform: [{ scale: hintPulseAnim }],
              zIndex: 10,
            }}
          >
            <TouchableOpacity
              style={[tileStyle, styles.hintHighlightTile]}
              onPress={() => handleTilePress(i)}
              activeOpacity={0.7}
            >
              <View style={styles.hintInnerGlow} />
            </TouchableOpacity>
          </Animated.View>
        );
      } else {
        tiles.push(
          <TouchableOpacity
            key={i}
            style={tileStyle}
            onPress={() => handleTilePress(i)}
            activeOpacity={0.7}
          />
        );
      }
    }
    return tiles;
  };

  return (
    <Animated.View
      style={[
        styles.boardContainer,
        {
          transform: [
            { translateX: shakeAnim },
            { scale: boardScale }
          ],
          opacity: boardOpacity,
        },
      ]}
    >
      <View style={styles.grid}>{renderTiles()}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    width: CONTAINER_WIDTH,
    aspectRatio: 1, // Mantiene forma perfectamente cuadrada
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: BOARD_PADDING,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: GAP,
  },
  tile: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hintHighlightTile: {
    borderWidth: 3,
    borderColor: '#FBBF24', // Borde dorado brillante
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  hintInnerGlow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
