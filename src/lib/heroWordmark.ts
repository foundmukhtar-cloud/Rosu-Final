export type WordmarkKeyframe = {
  p: number;
  x: number;
  y: number;
  w: number;
  fs: number;
  tilt: number;
  rot: number;
  skew: number;
};

export const heroWordmarkTrack: WordmarkKeyframe[] = [
  { p: 0, x: 0.428, y: 0.528, w: 0.247, fs: 0.06, tilt: 13, rot: -1.2, skew: -5 },
  { p: 0.021, x: 0.418, y: 0.508, w: 0.263, fs: 0.062, tilt: 14, rot: -1.3, skew: -4.8 },
  { p: 0.042, x: 0.416, y: 0.489, w: 0.278, fs: 0.064, tilt: 15, rot: -1.4, skew: -4.6 },
  { p: 0.063, x: 0.409, y: 0.464, w: 0.291, fs: 0.066, tilt: 16, rot: -1.5, skew: -4.4 },
  { p: 0.084, x: 0.395, y: 0.441, w: 0.3, fs: 0.067, tilt: 17, rot: -1.6, skew: -4.2 },
  { p: 0.105, x: 0.365, y: 0.402, w: 0.27, fs: 0.062, tilt: 18, rot: -1.7, skew: -4 },
  { p: 0.126, x: 0.36, y: 0.366, w: 0.26, fs: 0.06, tilt: 19, rot: -1.8, skew: -3.8 },
  { p: 0.147, x: 0.355, y: 0.336, w: 0.25, fs: 0.058, tilt: 20, rot: -1.9, skew: -3.6 },
  { p: 0.168, x: 0.365, y: 0.325, w: 0.247, fs: 0.062, tilt: 20, rot: -2, skew: -3.5 },
  { p: 0.189, x: 0.36, y: 0.245, w: 0.28, fs: 0.072, tilt: 21, rot: -2.1, skew: -3.4 },
  { p: 0.21, x: 0.334, y: 0.192, w: 0.328, fs: 0.083, tilt: 22, rot: -2.2, skew: -3.2 },
  { p: 0.231, x: 0.318, y: 0.144, w: 0.344, fs: 0.086, tilt: 22, rot: -2.2, skew: -3.2 },
  { p: 0.252, x: 0.315, y: 0.111, w: 0.35, fs: 0.088, tilt: 23, rot: -2.3, skew: -3 },
  { p: 0.27, x: 0.3, y: 0.083, w: 0.36, fs: 0.09, tilt: 23, rot: -2.3, skew: -3 },
];

export function heroWordmarkAt(progress: number): WordmarkKeyframe {
  const clamped = Math.min(1, Math.max(0, progress));
  let a = heroWordmarkTrack[0];
  let b = heroWordmarkTrack[heroWordmarkTrack.length - 1];
  if (clamped <= a.p) {
    b = a;
  } else if (clamped >= b.p) {
    a = b;
  } else {
    for (let i = 0; i < heroWordmarkTrack.length - 1; i += 1) {
      if (clamped >= heroWordmarkTrack[i].p && clamped <= heroWordmarkTrack[i + 1].p) {
        a = heroWordmarkTrack[i];
        b = heroWordmarkTrack[i + 1];
        break;
      }
    }
  }
  const span = b.p - a.p;
  const t = span > 0 ? (clamped - a.p) / span : 0;
  return {
    p: clamped,
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    w: a.w + (b.w - a.w) * t,
    fs: a.fs + (b.fs - a.fs) * t,
    tilt: a.tilt + (b.tilt - a.tilt) * t,
    rot: a.rot + (b.rot - a.rot) * t,
    skew: a.skew + (b.skew - a.skew) * t,
  };
}
