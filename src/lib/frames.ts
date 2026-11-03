export type Sequence = {
  id: string;
  title: string;
  description: string;
  chapters: string[];
  source: string;
  frameCount: number;
  width: number;
  height: number;
  startNumber: number;
  digits: number;
  pattern: string;
  poster: string;
  lastFrame: string;
  manifestPath: string;
};

/** Normalised booklet-cover rectangle for one point in the scroll range. */
export type CoverKeyframe = { p: number; x: number; y: number; w: number; h: number };

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function assetUrl(path: string): string {
  return `${BASE}/${path.replace(/^\/+/, '')}`;
}

/** 0-based index into the sequence, resolved to the numerically ordered file. */
export function frameUrl(sequence: Sequence, index: number): string {
  const clamped = Math.min(Math.max(Math.round(index), 0), sequence.frameCount - 1);
  const frameNumber = sequence.startNumber + clamped;
  const file = sequence.pattern.replace(
    '{index}',
    String(frameNumber).padStart(sequence.digits, '0'),
  );
  return assetUrl(file);
}
