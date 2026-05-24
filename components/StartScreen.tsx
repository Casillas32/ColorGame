import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { DifficultyMode } from '../utils/colorGenerator';
import * as Haptics from 'expo-haptics';
import Milogo from '../assets/icon.jpeg';

const { width } = Dimensions.get('window');

interface StartScreenProps {
  onStartGame: (difficulty: DifficultyMode) => void;
  highScores: Record<DifficultyMode, number>;
}

export default function StartScreen({ onStartGame, highScores }: StartScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyMode>('medium');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDifficultySelect = (difficulty: DifficultyMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDifficulty(difficulty);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleStart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onStartGame(selectedDifficulty);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Title/Logo */}
        <View style={styles.header}>
          <Image source={Milogo} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.titlePrefix}>GAME</Text>
          <Text style={styles.titleSuffix}>COLOR</Text>
          <View style={styles.glowIndicator} />
          <Text style={styles.tagline}>Entrena tu visión cromática</Text>
        </View>

        {/* High Score Panel */}
        <View style={styles.scoreBoard}>
          <Text style={styles.scoreTitle}>Mejores Puntuaciones</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreLabel}>FÁCIL</Text>
              <Text style={styles.scoreValue}>{highScores.easy}</Text>
            </View>
            <View style={[styles.scoreCol, styles.scoreColActive]}>
              <Text style={[styles.scoreLabel, { color: '#818CF8' }]}>MEDIO</Text>
              <Text style={styles.scoreValue}>{highScores.medium}</Text>
            </View>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreLabel}>DIFÍCIL</Text>
              <Text style={styles.scoreValue}>{highScores.hard}</Text>
            </View>
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.difficultyContainer}>
          <Text style={styles.sectionTitle}>Selecciona Dificultad</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                selectedDifficulty === 'easy' && styles.difficultyButtonEasyActive,
              ]}
              onPress={() => handleDifficultySelect('easy')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.difficultyText,
                  selectedDifficulty === 'easy' && styles.activeText,
                ]}
              >
                Fácil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.difficultyButton,
                selectedDifficulty === 'medium' && styles.difficultyButtonMediumActive,
              ]}
              onPress={() => handleDifficultySelect('medium')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.difficultyText,
                  selectedDifficulty === 'medium' && styles.activeText,
                ]}
              >
                Medio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.difficultyButton,
                selectedDifficulty === 'hard' && styles.difficultyButtonHardActive,
              ]}
              onPress={() => handleDifficultySelect('hard')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.difficultyText,
                  selectedDifficulty === 'hard' && styles.activeText,
                ]}
              >
                Difícil
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How to Play Card */}
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>¿Cómo jugar?</Text>
          <Text style={styles.rulesText}>
            Toca el único cuadro del tablero de <Text style={styles.highlightText}>3x3</Text> que tenga un tono de color <Text style={styles.highlightText}>ligeramente diferente</Text> al resto. ¡Hazlo rápido para mantener tu barra de tiempo llena!
          </Text>
        </View>

        {/* Play Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.startButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleStart}
            activeOpacity={0.9}
          >
            <Text style={styles.startButtonText}>JUGAR AHORA</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: width * 0.9,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  titlePrefix: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    lineHeight: 48,
  },
  titleSuffix: {
    fontSize: 54,
    fontWeight: '900',
    color: '#6366F1', // Indigo vibrante
    letterSpacing: 6,
    lineHeight: 54,
    textShadowColor: 'rgba(99, 102, 241, 0.4)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 15,
  },
  glowIndicator: {
    position: 'absolute',
    top: 40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    zIndex: -1,
  },
  tagline: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 10,
    letterSpacing: 2,
    fontWeight: '500',
  },
  scoreBoard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  scoreTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  scoreColActive: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  difficultyContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    letterSpacing: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  difficultyButtonEasyActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  difficultyButtonMediumActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  difficultyButtonHardActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  difficultyText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  rulesCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  rulesTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  rulesText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 20,
  },
  highlightText: {
    color: '#F3F4F6',
    fontWeight: '700',
  },
  startButton: {
    width: width * 0.8,
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
});
