export type ShapeName = "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong" | "Triangle";

export type FaceMeasurements = {
  lengthToWidth: number;
  cheekToJaw: number;
  upperToJaw: number;
  cheekToUpper: number;
  chinToJaw: number;
  jawTaper: number;
  jawAngle: number;
};

type Feature = keyof FaceMeasurements;

/**
 * Project-owned reference patterns. Values are dimensionless ratios except
 * jawAngle, which is normalized from 0 (soft) to 1 (angular). MediaPipe only
 * supplies landmarks; it does not provide these categories.
 */
export const SHAPE_REFERENCE: Record<ShapeName, FaceMeasurements> = {
  Oval: { lengthToWidth: 1.34, cheekToJaw: 1.13, upperToJaw: 1.08, cheekToUpper: 1.05, chinToJaw: 0.48, jawTaper: 0.16, jawAngle: 0.36 },
  Round: { lengthToWidth: 1.08, cheekToJaw: 1.08, upperToJaw: 1.04, cheekToUpper: 1.03, chinToJaw: 0.55, jawTaper: 0.08, jawAngle: 0.20 },
  Square: { lengthToWidth: 1.10, cheekToJaw: 1.01, upperToJaw: 1.00, cheekToUpper: 1.00, chinToJaw: 0.63, jawTaper: 0.03, jawAngle: 0.80 },
  Heart: { lengthToWidth: 1.24, cheekToJaw: 1.20, upperToJaw: 1.23, cheekToUpper: 1.01, chinToJaw: 0.37, jawTaper: 0.27, jawAngle: 0.48 },
  Diamond: { lengthToWidth: 1.30, cheekToJaw: 1.23, upperToJaw: 1.08, cheekToUpper: 1.15, chinToJaw: 0.39, jawTaper: 0.25, jawAngle: 0.54 },
  Oblong: { lengthToWidth: 1.50, cheekToJaw: 1.06, upperToJaw: 1.03, cheekToUpper: 1.02, chinToJaw: 0.56, jawTaper: 0.09, jawAngle: 0.52 },
  Triangle: { lengthToWidth: 1.18, cheekToJaw: 0.96, upperToJaw: 0.88, cheekToUpper: 1.05, chinToJaw: 0.61, jawTaper: 0.02, jawAngle: 0.72 },
};

export const FEATURE_WEIGHTS: Record<Feature, number> = {
  lengthToWidth: 2.4,
  cheekToJaw: 1.8,
  upperToJaw: 2,
  cheekToUpper: 1.5,
  chinToJaw: 1.1,
  jawTaper: 1.4,
  jawAngle: 1.3,
};

export const QUALITY_THRESHOLDS = {
  minFaceArea: 0.11,
  maxRollDegrees: 10,
  maxYawOffset: 0.13,
  minBrightness: 45,
  maxBrightness: 220,
  minBlurVariance: 38,
  maxFileBytes: 8 * 1024 * 1024,
  maxAnalysisSide: 1600,
} as const;

const ranges: Record<Feature, number> = {
  lengthToWidth: 0.32,
  cheekToJaw: 0.18,
  upperToJaw: 0.22,
  cheekToUpper: 0.14,
  chinToJaw: 0.2,
  jawTaper: 0.22,
  jawAngle: 0.5,
};

function distributeTo100(values: { shape: ShapeName; raw: number }[]) {
  const total = values.reduce((sum, item) => sum + item.raw, 0);
  const exact = values.map((item) => ({ ...item, exact: (item.raw / total) * 100 }));
  const rounded = exact.map((item) => ({ shape: item.shape, score: Math.floor(item.exact), remainder: item.exact % 1 }));
  let remaining = 100 - rounded.reduce((sum, item) => sum + item.score, 0);
  [...rounded].sort((a, b) => b.remainder - a.remainder).forEach((item) => {
    if (remaining > 0) {
      const target = rounded.find((entry) => entry.shape === item.shape);
      if (target) target.score += 1;
      remaining -= 1;
    }
  });
  return rounded.sort((a, b) => b.score - a.score).map(({ shape, score }) => ({ shape, score }));
}

export function classifyFace(measurements: FaceMeasurements) {
  const entries = (Object.keys(SHAPE_REFERENCE) as ShapeName[]).map((shape) => {
    const distance = (Object.keys(FEATURE_WEIGHTS) as Feature[]).reduce((sum, feature) => {
      const delta = (measurements[feature] - SHAPE_REFERENCE[shape][feature]) / ranges[feature];
      return sum + FEATURE_WEIGHTS[feature] * delta * delta;
    }, 0);
    return { shape, raw: Math.exp(-distance / 2.3) + 0.012 };
  });
  return distributeTo100(entries);
}

export function explainResult(shape: ShapeName, m: FaceMeasurements) {
  const explanations: Record<ShapeName, string[]> = {
    Oval: [
      `Visible length is about ${m.lengthToWidth.toFixed(2)} times the maximum width, creating moderate elongation.`,
      "The cheek area is wider than the jaw, with a gradual lower-face taper.",
      "The jaw-angle proxy is softer than the square and triangle reference patterns.",
    ],
    Round: [
      `Visible length and width are relatively close at a ${m.lengthToWidth.toFixed(2)} ratio.`,
      "The cheek and jaw widths are close enough to support a continuous curved outline.",
      "The chin and jaw-angle proxies favour softness over strong corners.",
    ],
    Square: [
      "Upper-face, cheek, and jaw width proxies remain comparatively even.",
      `The jaw-angle proxy (${m.jawAngle.toFixed(2)}) indicates clearer lower-face corners.`,
      "The chin retains more width instead of tapering sharply.",
    ],
    Heart: [
      "The visible upper-face area appears wider than the jaw.",
      "The lower outline narrows toward a comparatively small chin.",
      "Width sits higher on the face rather than peaking only at the cheekbones.",
    ],
    Diamond: [
      "The cheekbone proxy is wider than both the upper-face and jaw proxies.",
      "The outline tapers in both directions away from the cheeks.",
      "The chin-width proxy is relatively narrow.",
    ],
    Oblong: [
      `Visible length is about ${m.lengthToWidth.toFixed(2)} times the maximum width, creating strong vertical emphasis.`,
      "Upper-face, cheek, and jaw widths are relatively even.",
      "The sides appear straighter than the oval reference pattern.",
    ],
    Triangle: [
      "The jaw proxy is wider than the visible upper-face proxy.",
      "The outline expands toward the lower face instead of tapering inward.",
      "The jaw and chin retain comparatively strong width.",
    ],
  };
  return explanations[shape];
}
