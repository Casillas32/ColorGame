/**
 * Utilidades para la generación de colores HSL armoniosos y el cálculo de la dificultad.
 */

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface GameColors {
  baseColor: string;     // Formato 'hsl(h, s%, l%)'
  diffColor: string;     // Formato 'hsl(h, s%, l%)'
  baseHSL: HSLColor;
  diffHSL: HSLColor;
  delta: number;         // La diferencia de luminosidad aplicada
}

export type DifficultyMode = 'easy' | 'medium' | 'hard';

/**
 * Retorna la diferencia de luminosidad (delta) según el nivel y la dificultad elegida.
 * A mayor nivel, menor será delta (y por ende, mayor dificultad).
 */
export const calculateDelta = (level: number, mode: DifficultyMode): number => {
  // Parámetros de atenuación según dificultad
  let alpha = 0.08; // Fácil por defecto
  let baseDelta = 20; // Diferencia inicial en % de luminosidad

  if (mode === 'medium') {
    alpha = 0.15;
    baseDelta = 18;
  } else if (mode === 'hard') {
    alpha = 0.25;
    baseDelta = 15;
  }

  // Fórmula decreciente hiperbólica
  // delta = baseDelta / (1 + alpha * (level - 1))
  const delta = baseDelta / (1 + alpha * (level - 1));

  // Límite mínimo para que no sea físicamente invisible
  const minDelta = mode === 'easy' ? 2.0 : mode === 'medium' ? 1.2 : 0.8;

  return Math.max(minDelta, parseFloat(delta.toFixed(2)));
};

/**
 * Genera un color base HSL agradable de forma aleatoria, evitando tonos muy oscuros o grises.
 * Luego calcula el color "desviado" (diferente) variando sutilmente la luminosidad (L).
 */
export const generateGameColors = (level: number, mode: DifficultyMode): GameColors => {
  // Generar tono H: 0 a 360 grados
  const h = Math.floor(Math.random() * 360);
  
  // Generar saturación S: 75% a 95% (colores muy vivos)
  const s = Math.floor(Math.random() * 20) + 75;
  
  // Generar luminosidad L: 45% a 65% (colores en el rango intermedio-alto para mayor vistosidad)
  const l = Math.floor(Math.random() * 20) + 45;

  const delta = calculateDelta(level, mode);

  // Decidir si subimos o bajamos la luminosidad para el cuadro diferente.
  // Para evitar salirnos del límite (0-100), si la luminosidad base es alta (>55), la bajamos.
  // Si la luminosidad base es baja, la subimos.
  const isLightnessHigh = l > 55;
  const diffL = isLightnessHigh ? l - delta : l + delta;

  const baseHSL: HSLColor = { h, s, l };
  const diffHSL: HSLColor = { h, s, l: diffL };

  const baseColor = `hsl(${h}, ${s}%, ${l}%)`;
  const diffColor = `hsl(${h}, ${s}%, ${diffL}%)`;

  return {
    baseColor,
    diffColor,
    baseHSL,
    diffHSL,
    delta,
  };
};
