type Listener = () => void;

/**
 * Loads frame images progressively, nearest-to-focus first, with a small
 * concurrency window so scrolling never queues hundreds of requests at once.
 */
export class FrameLoader {
  private images: (HTMLImageElement | null)[];
  private failed: boolean[];
  private wanted = new Set<number>();
  private active = 0;
  private focus = 0;
  private disposed = false;
  private listeners = new Set<Listener>();
  private readonly concurrency = 5;
  private readonly ahead = 36;

  constructor(private readonly urls: string[]) {
    this.images = new Array(urls.length).fill(null);
    this.failed = new Array(urls.length).fill(false);
  }

  get length(): number {
    return this.urls.length;
  }

  get(index: number): HTMLImageElement | null {
    const image = this.images[index];
    if (!image) return null;
    return image.complete && image.naturalWidth > 0 ? image : null;
  }

  /** Closest already-loaded frame at or before `index`, so playback never blanks. */
  nearestBelow(index: number): HTMLImageElement | null {
    for (let i = Math.min(index, this.urls.length - 1); i >= 0; i -= 1) {
      const image = this.get(i);
      if (image) return image;
    }
    return null;
  }

  get loadedCount(): number {
    let count = 0;
    for (let i = 0; i < this.urls.length; i += 1) if (this.get(i)) count += 1;
    return count;
  }

  onLoad(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** First and last frames are fetched before anything else. */
  preloadCritical(): void {
    if (this.urls.length === 0) return;
    this.ensure(0);
    this.ensure(this.urls.length - 1);
  }

  /** Keeps a rolling window of upcoming frames queued around the playhead. */
  requestFocus(index: number): void {
    this.focus = index;
    const start = Math.max(0, index - 2);
    const end = Math.min(this.urls.length - 1, index + this.ahead);
    for (let i = start; i <= end; i += 1) this.ensure(i);
  }

  dispose(): void {
    this.disposed = true;
    this.wanted.clear();
    this.listeners.clear();
  }

  private ensure(index: number): void {
    if (this.disposed) return;
    if (index < 0 || index >= this.urls.length) return;
    if (this.images[index] || this.failed[index] || this.wanted.has(index)) return;
    this.wanted.add(index);
    this.pump();
  }

  private pump(): void {
    if (this.disposed) return;
    while (this.active < this.concurrency && this.wanted.size > 0) {
      let next = -1;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const index of this.wanted) {
        const distance = Math.abs(index - this.focus);
        if (distance < bestDistance) {
          bestDistance = distance;
          next = index;
        }
      }
      if (next < 0) return;
      this.wanted.delete(next);
      this.start(next);
    }
  }

  private start(index: number): void {
    this.active += 1;
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      this.active -= 1;
      this.images[index] = image;
      for (const listener of this.listeners) listener();
      this.pump();
    };
    image.onerror = () => {
      this.active -= 1;
      this.failed[index] = true;
      this.pump();
    };
    image.src = this.urls[index];
  }
}
