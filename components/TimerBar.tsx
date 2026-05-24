import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';

interface TimerBarProps {
  timeLeft: number;
  maxTime: number;
}

export default function TimerBar({ timeLeft, maxTime }: TimerBarProps) {
  const animatedWidth = useRef(new Animated.Value(1)).current;

  // Calcular porcentaje
  const percentage = Math.max(0, Math.min(1, timeLeft / maxTime));

  useEffect(() => {
    // Animación suave de la barra cuando cambia timeLeft
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 250, // Pequeña duración para que se sienta reactivo y fluido
      useNativeDriver: false, // No se puede usar native driver con propiedades de layout como width/flex
    }).start();
  }, [timeLeft, maxTime]);

  // Color dinámico según el tiempo restante
  let barColor = '#10B981'; // Verde (más del 50%)
  if (percentage <= 0.25) {
    barColor = '#EF4444'; // Rojo (menos del 25%)
  } else if (percentage <= 0.5) {
    barColor = '#F59E0B'; // Naranja/Amarillo (entre 25% y 50%)
  }

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      {timeLeft <= 4 && timeLeft > 0 && (
        <Text style={[styles.warningText, { color: barColor }]}>
          ¡TIEMPO CRÍTICO!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bar: {
    height: '100%',
    borderRadius: 5,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  warningText: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
