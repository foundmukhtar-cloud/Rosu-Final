import type { CSSProperties, ReactNode } from 'react';

export type LoadingScreenProps = {
  status?: string;
  progress?: number;
  announce?: string;
  children?: ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  style?: CSSProperties;
  className?: string;
};

export function LoadingScreen({
  status = 'Preparing your experience',
  progress,
  announce,
  children,
  containerRef,
  style,
  className,
}: LoadingScreenProps) {
  const outerStyle: CSSProperties = {
    ...style,
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
    backgroundColor: 'var(--ivory)',
    color: 'var(--navy)',
    textAlign: 'center',
    transition: 'opacity 0.5s ease',
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: '50%',
  };

  const ringStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2px solid var(--ivory-muted)',
    boxSizing: 'border-box',
  };

  const progressRingStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTopColor: 'var(--navy)',
    borderRightColor: 'var(--bronze)',
    boxSizing: 'border-box',
    animation: 'spin 1.1s linear infinite',
  };

  const accentDotStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 4,
    height: 4,
    marginLeft: -2,
    marginTop: -2,
    borderRadius: '50%',
    backgroundColor: 'var(--navy)',
  };

  return (
    <div
      role="region"
      aria-label="Loading"
      aria-busy="true"
      aria-live="polite"
      style={outerStyle}
      ref={containerRef}
      className={className}
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress != null ? Math.round(progress) : 0}
        aria-label="Preparing your experience"
        style={trackStyle}
      >
        <div style={ringStyle} />
        <div style={progressRingStyle} />
        <div style={accentDotStyle} />
      </div>

      <div style={{ maxWidth: 320, lineHeight: 1.5, letterSpacing: '0.01em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 500 }}>
          {status}
        </p>
        {progress != null && (
          <div
            style={{
              marginTop: 14,
              width: 200,
              height: 3,
              backgroundColor: 'rgba(16, 35, 59, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                height: '100%',
                backgroundColor: 'var(--bronze)',
                transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        )}
        {announce != null && (
          <p
            style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--slate)' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {announce}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

export function LoadingScreenSkip({
  onSkip,
}: {
  onSkip: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSkip}
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 16px',
        border: '1px solid var(--navy)',
        background: 'transparent',
        color: 'var(--navy)',
        fontSize: 11,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      Skip loading
    </button>
  );
}
