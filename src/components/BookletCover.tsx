import type { CSSProperties } from 'react';
import type { CoverKeyframe } from '../lib/frames';

type BookletCoverProps = {
  rect?: CoverKeyframe;
  still?: boolean;
};

const lineStyle = (threshold: number) => ({ '--t': threshold }) as CSSProperties;

/**
 * The report cover printed onto the booklet that sits in the supplied footage.
 * Each line drops in as scroll progress passes its threshold, then stays.
 */
export function BookletCover({ rect, still = false }: BookletCoverProps) {
  const rectStyle = rect
    ? ({
        left: `${rect.x * 100}%`,
        top: `${rect.y * 100}%`,
        width: `${rect.w * 100}%`,
        height: `${rect.h * 100}%`,
        '--cover-w': `${rect.w * 100}cqw`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      className={`booklet-cover${still ? ' booklet-cover--still' : ''}`}
      style={rectStyle}
      aria-hidden="true"
    >
      <p className="cover-line cover-line--mark" style={lineStyle(0.72)}>
        ROSU
      </p>
      <p className="cover-line cover-line--eyebrow" style={lineStyle(0.745)}>
        Uniform Appraisal Dataset
      </p>
      <p className="cover-line cover-line--title" style={lineStyle(0.765)}>
        UAD 3.6
      </p>
      <span className="cover-line cover-rule" style={lineStyle(0.785)} />
      <p className="cover-line cover-line--foot" style={lineStyle(0.8)}>
        Appraisal report
      </p>
    </div>
  );
}
