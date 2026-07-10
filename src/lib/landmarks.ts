import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { FaceMeasurements } from "./classifier";

const p = (landmarks: NormalizedLandmark[], index: number) => landmarks[index];
const d = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y);

function angle(a: NormalizedLandmark, b: NormalizedLandmark, c: NormalizedLandmark) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const mag = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y);
  return Math.acos(Math.max(-1, Math.min(1, dot / Math.max(mag, 1e-6)))) * (180 / Math.PI);
}

export function measureLandmarks(lm: NormalizedLandmark[]): FaceMeasurements {
  // Stable visible landmark proxies. Index 10 is an upper-face landmark, not an exact hairline.
  const faceLength = d(p(lm, 10), p(lm, 152));
  const maxWidth = d(p(lm, 234), p(lm, 454));
  const cheekWidth = d(p(lm, 123), p(lm, 352));
  const upperWidth = d(p(lm, 127), p(lm, 356));
  const jawWidth = d(p(lm, 172), p(lm, 397));
  const chinWidth = d(p(lm, 149), p(lm, 378));
  const leftAngle = angle(p(lm, 234), p(lm, 172), p(lm, 152));
  const rightAngle = angle(p(lm, 454), p(lm, 397), p(lm, 152));
  const angularity = Math.max(0, Math.min(1, (180 - (leftAngle + rightAngle) / 2) / 65));
  return {
    lengthToWidth: faceLength / maxWidth,
    cheekToJaw: cheekWidth / jawWidth,
    upperToJaw: upperWidth / jawWidth,
    cheekToUpper: cheekWidth / upperWidth,
    chinToJaw: chinWidth / jawWidth,
    jawTaper: Math.max(0, Math.min(0.5, 1 - jawWidth / cheekWidth)),
    jawAngle: angularity,
  };
}

export function poseQuality(lm: NormalizedLandmark[]) {
  const leftEye = p(lm, 33);
  const rightEye = p(lm, 263);
  const nose = p(lm, 1);
  const leftEdge = p(lm, 234);
  const rightEdge = p(lm, 454);
  const roll = Math.abs(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI));
  const midpoint = (leftEdge.x + rightEdge.x) / 2;
  const yaw = Math.abs(nose.x - midpoint) / Math.max(Math.abs(rightEdge.x - leftEdge.x), 0.001);
  const xs = lm.map((item) => item.x);
  const ys = lm.map((item) => item.y);
  const area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
  return { roll, yaw, area };
}
