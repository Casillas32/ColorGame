import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { DifficultyMode } from '../utils/colorGenerator';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface GameOverScreenProps {
  score: number;
  level: number;
  difficulty: DifficultyMode;
  isNewRecord: boolean;
  onRestart: () => void;
  onGoToMenu: () => void;
}

export default function GameOverScreen({
  score,
  level,
  difficulty,
  isNewRecord,
  onRestart,
  onGoToMenu,
}: GameOverScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const recordScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();

    // Si hay nuevo récord, hacer animación especial
    if (isNewRecord) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.spring(recordScale, {
        toValue: 1,
        delay: 400,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [isNewRecord]);

  // Texto divertido de retroalimentación según el nivel alcanzado
  const getFeedbackMessage = () => {
    if (level >= 35) {
      return {
        title: '👑 ¡Visión Divina! 👑',
        desc: '¿Eres un águila o una inteligencia artificial? Tu percepción cromática es del 99.9%. ¡Increíble!',
      };
    } else if (level >= 20) {
      return {
        title: '👁️ ¡Ojo de Halcón! 👁️',
        desc: '¡Espectacular! Distingues variaciones que la mayoría de los humanos confunden fácilmente.',
      };
    } else if (level >= 10) {
      return {
        title: '✨ Buena Vista ✨',
        desc: '¡Gran trabajo! Tienes una percepción cromática superior al promedio. Sigue entrenando.',
      };
    } else if (level >= 5) {
      return {
        title: '👍 Buen Intento 👍',
        desc: 'Tu visión es estable, pero puedes mejorar si te concentras un poco más. ¡Inténtalo de nuevo!',
      };
    } else {
      return {
        title: '🤓 ¿Necesitas lentes? 🤓',
        desc: '¡Vaya! La diferencia era bastante obvia... ¿Había demasiada luz en la pantalla? ¡Intenta otra vez!',
      };
    }
  };

  const feedback = getFeedbackMessage();

  const difficultyNames = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.gameOverText}>PARTIDA</Text>
          <Text style={styles.gameOverHighlight}>TERMINADA</Text>
        </View>

        {/* Banner de Récord */}
        {isNewRecord && (
          <Animated.View style={[styles.recordBanner, { transform: [{ scale: recordScale }] }]}>
            <Text style={styles.recordEmoji}>🏆</Text>
            <Text style={styles.recordText}>¡NUEVO RÉCORD PERSONAL!</Text>
            <Text style={styles.recordEmoji}>🏆</Text>
          </Animated.View>
        )}

        {/* Panel de Estadísticas */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>
            Estadísticas en Modo <Text style={styles.difficultyHighlight}>{difficultyNames[difficulty]}</Text>
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>NIVEL LOGRADO</Text>
              <Text style={styles.statValue}>{level}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>PUNTOS FINALES</Text>
              <Text style={[styles.statValue, { color: '#818CF8' }]}>{score}</Text>
            </View>
          </View>
        </View>

        {/* Panel de Retroalimentación */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{feedback.title}</Text>
          <Text style={styles.feedbackDesc}>{feedback.desc}</Text>
        </View>

        {/* Grupo de Botones */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRestart();
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.retryButtonText}>VOLVER A JUGAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onGoToMenu();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonText}>MENÚ PRINCIPAL</Text>
          </TouchableOpacity>
        </View>

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
    paddingVertical: 35,
  },
  header: {
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 8,
  },
  gameOverHighlight: {
    fontSize: 48,
    fontWeight: '900',
    color: '#EF4444', // Rojo intenso
    letterSpacing: 4,
    textShadowColor: 'rgba(239, 68, 68, 0.3)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
  },
  recordBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)', // Fondo dorado sutil
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recordText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
    marginHorizontal: 8,
  },
  recordEmoji: {
    fontSize: 16,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  statsTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 20,
  },
  difficultyHighlight: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  feedbackCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    width: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  menuButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  menuButtonText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
