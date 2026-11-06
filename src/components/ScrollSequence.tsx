import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { assetUrl, frameUrl, type CoverKeyframe, type Sequence } from '../lib/frames';
import { FrameLoader } from '../lib/loader';

type Continuation = { sequence: Sequence; travelVh: number; holdStart?: number };

type ScrollSequenceProps = {
  sequence: Sequence;
  heightVh?: number;
  continuation?: Continuation | Continuation[];
  id?: string;
  className?: string;
  anchorId?: string;
  anchorAt?: number;
  coverTrack?: CoverKeyframe[];
  children: ReactNode;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
// The tail of each shot dissolves into the opening frame of the next supplied
// shot, so the scenes join without a cut, blank frame or paused frame.
const CROSSFADE_START = 0.94;

/**
 * Pins the supplied scenes for the length of their own footage, then releases
 * them back into normal page flow. Progress is read from layout inside a rAF
 * loop; React never re-renders while scrolling.
 */
export function ScrollSequence({
  sequence,
  heightVh = 380,
  continuation,
  id,
  className = '',
  anchorId,
  anchorAt = 0.68,
  coverTrack,
  children,
}: ScrollSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const progressBRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    if (!section || !sticky || !canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    // Local aliases so the closures below keep the narrowed, non-null types.
    const stage: HTMLDivElement = sticky;
    const ctx: CanvasRenderingContext2D = context;

    const chain: Continuation[] = continuation
      ? Array.isArray(continuation)
        ? continuation
        : [continuation]
      : [];
    const scenes: Sequence[] = [sequence, ...chain.map((entry) => entry.sequence)];
    const holds = [1, ...chain.map((entry) => entry.holdStart ?? 1)];

    const loaders = scenes.map(
      (scene) =>
        new FrameLoader(
          Array.from({ length: scene.frameCount }, (_, index) => frameUrl(scene, index)),
        ),
    );
    const primed = scenes.map(() => false);

    let cssWidth = 0;
    let cssHeight = 0;
    let ratio = 1;
    let lastKey = '';
    let raf = 0;
    let idleFrames = 0;
    // Where the frame is actually painted after cover-fitting.
    const geometry = { dx: 0, dy: 0, dw: 0, dh: 0 };

    function applyCover(progress: number) {
      if (!coverTrack || coverTrack.length === 0 || geometry.dw === 0) return;
      let a = coverTrack[0];
      let b = coverTrack[coverTrack.length - 1];
      if (progress <= a.p) {
        b = a;
      } else if (progress >= b.p) {
        a = b;
      } else {
        for (let i = 0; i < coverTrack.length - 1; i += 1) {
          if (progress >= coverTrack[i].p && progress <= coverTrack[i + 1].p) {
            a = coverTrack[i];
            b = coverTrack[i + 1];
            break;
          }
        }
      }
      const span = b.p - a.p;
      const t = span > 0 ? clamp01((progress - a.p) / span) : 0;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const w = a.w + (b.w - a.w) * t;
      const h = a.h + (b.h - a.h) * t;
      stage.style.setProperty('--cover-left', `${geometry.dx + x * geometry.dw}px`);
      stage.style.setProperty('--cover-top', `${geometry.dy + y * geometry.dh}px`);
      stage.style.setProperty('--cover-w', `${w * geometry.dw}px`);
      stage.style.setProperty('--cover-h', `${h * geometry.dh}px`);
    }

    function paint(image: HTMLImageElement, alpha: number, clear: boolean) {
      if (cssWidth === 0 || cssHeight === 0) return;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (clear) {
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, cssWidth, cssHeight);
      }
      const scale = Math.max(cssWidth / image.naturalWidth, cssHeight / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const dx = (cssWidth - width) / 2;
      const dy = (cssHeight - height) / 2;
      if (clear) {
        geometry.dx = dx;
        geometry.dy = dy;
        geometry.dw = width;
        geometry.dh = height;
        stage.style.setProperty('--stage-x', `${dx}px`);
        stage.style.setProperty('--stage-y', `${dy}px`);
        stage.style.setProperty('--stage-w', `${width}px`);
        stage.style.setProperty('--stage-h', `${height}px`);
      }
      ctx.globalAlpha = alpha;
      // Cover crop keeps the frame's aspect ratio intact — no stretching.
      ctx.drawImage(image, dx, dy, width, height);
      ctx.globalAlpha = 1;
      if (clear) applyCover(progressRef.current);
    }

    const frameIndexFor = (progress: number, count: number) =>
      Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));

    function render(segment: number, progress: number, force = false) {
      const scene = scenes[segment];
      const loader = loaders[segment];
      const hold = holds[segment] ?? 1;
      const frameProgress = hold < 1 ? Math.min(1, progress / hold) : progress;
      const index = frameIndexFor(frameProgress, scene.frameCount);
      const hasNext = segment < chain.length;
      const blend =
        hasNext && progress >= CROSSFADE_START
          ? clamp01((progress - CROSSFADE_START) / (1 - CROSSFADE_START))
          : 0;

      const key = `${segment}:${index}:${blend.toFixed(2)}`;
      if (!force && key === lastKey) return;

      loader.requestFocus(index);
      const image = loader.get(index) ?? loader.nearestBelow(index);
      if (!image) return;

      lastKey = key;
      paint(image, 1, true);

      if (blend > 0) {
        const nextLoader = loaders[segment + 1];
        nextLoader.requestFocus(0);
        const first = nextLoader.get(0);
        if (first) paint(first, blend, false);
      }
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = Math.max(1, Math.round(rect.width));
      cssHeight = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(cssWidth * ratio);
      canvas.height = Math.round(cssHeight * ratio);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      render(Number(stage.dataset.segmentIndex ?? '0'), progressBRef.current, true);
    };

    const applyPhase = (progress: number) => {
      const phase = progress < 0.34 ? 'hero' : progress >= 0.4 ? 'uad' : 'transition';
      if (stage.dataset.phase !== phase) stage.dataset.phase = phase;
    };

    const tick = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();

      const stickyHeight = stage.offsetHeight || window.innerHeight;
      const travelFirst = Math.max(1, ((heightVh - 100) / 100) * stickyHeight);
      const travels = chain.map((entry) => Math.max(1, (entry.travelVh / 100) * stickyHeight));
      const totalTravel = travelFirst + travels.reduce((sum, value) => sum + value, 0);
      const travelled = Math.min(Math.max(-rect.top, 0), totalTravel);

      let segment = 0;
      let segmentProgress = clamp01(travelled / travelFirst);
      let boundary = travelFirst;
      for (let i = 0; i < travels.length; i += 1) {
        if (travelled >= boundary) {
          segment = i + 1;
          segmentProgress = clamp01((travelled - boundary) / travels[i]);
        }
        boundary += travels[i];
      }

      if (
        Math.abs(segmentProgress - progressBRef.current) > 0.0004 ||
        segment !== Number(stage.dataset.segmentIndex ?? -1)
      ) {
        // Overlay state is derived from the overall journey: once the first
        // shot is behind us the hero and UAD layers stay retired, regardless of
        // how the user arrived here (jump, reverse or smooth anchor scroll).
        const overall = segment === 0 ? segmentProgress : 1;
        progressBRef.current = segmentProgress;
        progressRef.current = overall;
        stage.dataset.segmentIndex = String(segment);
        stage.dataset.segment = String.fromCharCode(97 + segment);
        stage.style.setProperty('--pn', segmentProgress.toFixed(4));
        stage.style.setProperty('--p', overall.toFixed(4));
        applyPhase(overall);
        if (segment === 0) {
          applyCover(segmentProgress);
        }
        if (segment < chain.length && !primed[segment] && segmentProgress > 0.55) {
          loaders[segment + 1].preloadCritical();
          primed[segment] = true;
        }
        render(segment, segmentProgress);
        idleFrames = 0;
      } else {
        idleFrames += 1;
      }

      // Stop the loop once the scene is at rest, restart on the next scroll.
      if (idleFrames < 12) raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (raf === 0) {
        idleFrames = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const redraw = () => render(Number(stage.dataset.segmentIndex ?? 0), progressBRef.current, true);
    const unsubscribes = loaders.map((loader) => loader.onLoad(redraw));

    loaders[0].preloadCritical();
    loaders[0].requestFocus(0);
    measure();
    applyPhase(0);
    kick();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      kick();
    });
    resizeObserver.observe(stage);

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    window.addEventListener('orientationchange', kick);

    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
      for (const loader of loaders) loader.dispose();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      window.removeEventListener('orientationchange', kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sequence, continuation, coverTrack, heightVh]);

  const style = {
    '--journey-vh':
      heightVh +
      (continuation
        ? (Array.isArray(continuation) ? continuation : [continuation]).reduce(
            (sum, entry) => sum + entry.travelVh,
            0,
          )
        : 0),
  } as CSSProperties;

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`journey ${className}`.trim()}
      style={style}
      aria-labelledby={id ? `${id}-label` : undefined}
    >
      <div
        className="journey__sticky"
        ref={stickyRef}
        data-phase="hero"
        data-segment="a"
        data-segment-index="0"
      >
        <img
          className="journey__poster"
          src={assetUrl(sequence.poster)}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        <canvas className="journey__canvas" ref={canvasRef} aria-hidden="true" />
        <div className="journey__layers">{children}</div>
        <p className="sr-only">{sequence.description}</p>
      </div>
      {anchorId ? (
        <span
          id={anchorId}
          className="journey__anchor"
          style={{ '--anchor-top': `${(heightVh - 100) * anchorAt}svh` } as CSSProperties}
          aria-hidden="true"
        />
      ) : null}
    </section>
  );
}
