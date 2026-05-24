import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface HeaderProps {
  level: number;
  score: number;
  highScore: number;
  combo: number;
  hintsLeft: number;
  onUseHint: () => void;
  onExit: () => void;
}

export default function Header({
  level,
  score,
  highScore,
  combo,
  hintsLeft,
  onUseHint,
  onExit,
}: HeaderProps) {
  const comboScale = useRef(new Animated.Value(1)).current;

  // Hacer que el multiplicador de combo vibre/pulse cuando cambie y sea mayor que 1
  useEffect(() => {
    if (combo > 1) {
      Animated.sequence([
        Animated.timing(comboScale, {
          toValue: 1.4,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(comboScale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [combo]);

  return (
    <View style={styles.container}>
      {/* Barra superior de control */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.exitButton} onPress={onExit} activeOpacity={0.7}>
          <Text style={styles.exitIcon}>✕</Text>
          <Text style={styles.exitText}>Salir</Text>
        </TouchableOpacity>

        {/* High Score en el header */}
        <View style={styles.recordContainer}>
          <Text style={styles.recordLabel}>RÉCORD</Text>
          <Text style={styles.recordValue}>{highScore}</Text>
        </View>

        {/* Botón de Pistas */}
        <TouchableOpacity
          style={[styles.hintButton, hintsLeft === 0 && styles.hintButtonDisabled]}
          onPress={onUseHint}
          disabled={hintsLeft === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintText}>{hintsLeft}</Text>
        </TouchableOpacity>
      </View>

      {/* Grid de estado del juego */}
      <View style={styles.statsRow}>
        {/* Nivel */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Nivel</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>

        {/* Combo */}
        <View style={styles.comboWrapper}>
          {combo > 1 ? (
            <Animated.View style={[styles.comboBadge, { transform: [{ scale: comboScale }] }]}>
              <Text style={styles.comboText}>COMBO</Text>
              <Text style={styles.comboMultiplier}>x{combo}</Text>
            </Animated.View>
          ) : (
            <View style={[styles.comboBadge, styles.comboBadgeInactive]}>
              <Text style={styles.comboTextInactive}>COMBO</Text>
              <Text style={styles.comboMultiplierInactive}>x1</Text>
            </View>
          )}
        </View>

        {/* Puntuación */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Puntos</Text>
          <Text style={[styles.statValue, { color: '#818CF8' }]}>{score}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  exitIcon: {
    color: '#EF4444',
    fontWeight: 'bold',
    marginRight: 6,
    fontSize: 12,
  },
  exitText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
  },
  recordContainer: {
    alignItems: 'center',
  },
  recordLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1.5,
  },
  recordValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#10B981', // Verde éxito
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  hintButtonDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    opacity: 0.5,
  },
  hintIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  hintText: {
    color: '#FBBF24', // Dorado
    fontSize: 13,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statBox: {
    width: width * 0.26,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  comboWrapper: {
    width: width * 0.28,
    alignItems: 'center',
  },
  comboBadge: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)', // Color rosa combo
    borderWidth: 1,
    borderColor: '#EC4899',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  comboBadgeInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowOpacity: 0,
    elevation: 0,
  },
  comboText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#EC4899',
    letterSpacing: 1,
  },
  comboTextInactive: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 1,
  },
  comboMultiplier: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  comboMultiplierInactive: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4B5563',
  },
});
