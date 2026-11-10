import type { CSSProperties, ReactNode } from 'react';

export type LoadingScreenProps = {
  status?: string;
  announce?: string;
  children?: ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  style?: CSSProperties;
  className?: string;
  leaving?: boolean;
};

export function LoadingScreen({
  status = 'Preparing your experience',
  announce,
  children,
  containerRef,
  style,
  className,
  leaving = false,
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
    backgroundColor: '#08111d',
    color: '#ffffff',
    textAlign: 'center',
    opacity: leaving ? 0 : 1,
    pointerEvents: leaving ? 'none' : 'auto',
    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
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
    border: '2px solid rgba(255, 255, 255, 0.15)',
    boxSizing: 'border-box',
  };

  const progressRingStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTopColor: '#ffffff',
    borderRightColor: '#d4bd8d',
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
    backgroundColor: '#d4bd8d',
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
        aria-valuenow={0}
        aria-label="Preparing your experience"
        style={trackStyle}
      >
        <div style={ringStyle} />
        <div style={progressRingStyle} />
        <div style={accentDotStyle} />
      </div>

      <div style={{ maxWidth: 280, lineHeight: 1.5, letterSpacing: '0.01em' }}>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ffffff', fontWeight: 600 }}>
          {status}
        </p>
        {announce != null && (
          <p
            style={{ margin: '8px 0 0', fontSize: 11, color: '#e6dab8', letterSpacing: '0.06em' }}
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
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 18px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: 20,
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      Skip loading
    </button>
  );
}
