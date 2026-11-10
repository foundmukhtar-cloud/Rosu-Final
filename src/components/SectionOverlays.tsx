import { useEffect, useState } from 'react';
import {
  audience,
  chapters,
  cityHighrise,
  foundation,
  propertyTypes,
  regionalCentral,
  regionalUpstate,
  uad,
  valuationMethod,
} from '../lib/content';

/* ---------- Refined Architectural SVG Icons for Plinths & Pedestals ---------- */
function LenderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18M4 18h16M12 3l9 5H3l9-5zM6 10v8M12 10v8M18 10v8" />
    </svg>
  );
}

function BrokerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1.7 1.7" />
      <path d="m13 15-2.5-2.5a1 1 0 0 0-1.4 0L6 15.6a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4 0L11 17" />
      <path d="M19.5 8.5 16 5l-4 4" />
      <path d="m4.5 8.5 3.5-3.5 4 4" />
    </svg>
  );
}

function AppraiserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6" />
      <path d="M14 2v6h6" />
      <path d="M14 2l6 6" />
      <line x1="8" y1="12" x2="12" y2="12" />
      <circle cx="16" cy="16" r="3" />
      <line x1="18.5" y1="18.5" x2="21.5" y2="21.5" />
    </svg>
  );
}

function HomeownerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20v-9.5z" />
      <path d="M9 21.5V12h6v9.5" />
    </svg>
  );
}

function OtherIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="8" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="7" r="3" />
      <path d="M3 19v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M19 19v-.8a3.2 3.2 0 0 0-2.4-3.1" />
    </svg>
  );
}

function TechIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="20" x2="18" y2="8" />
      <line x1="12" y1="20" x2="12" y2="12" />
      <line x1="6" y1="20" x2="6" y2="15" />
      <path d="M4 20h16" />
    </svg>
  );
}

function ProcessIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}

/* ---------- 1. Hero Overlay ---------- */
export function HeroOverlay({ onExplore }: { onExplore: () => void }) {
  const [activePillarId, setActivePillarId] = useState<string | null>(null);
  const activePillar = foundation.pillars.find((p) => p.id === activePillarId);

  return (
    <div className="layer hero-layer">
      {/* Left Editorial Scrim Matching Reference Image */}
      <div className="foundation-left-editorial hero-left-editorial">
        <p className="eyebrow foundation__eyebrow">{foundation.eyebrow}</p>
        <h1 className="foundation__title">
          People.
          <br />
          Technology.
          <br />
          Process.
        </h1>
        <p className="foundation__subtitle">{foundation.subtitle}</p>
        <a
          href="#approach"
          className="hero__link foundation__link"
          onClick={(e) => {
            e.preventDefault();
            onExplore();
          }}
        >
          {foundation.cta} <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Pedestal Interactive Buttons Over the 3 Stone Blocks in the Footage */}
      <div className="pedestal-stage">
        {/* 1. PEOPLE */}
        <button
          type="button"
          className="pedestal-btn pedestal-btn--people"
          onClick={() => setActivePillarId('people')}
          aria-label="Inspect People methodology: Experience, Judgment, Local Insight"
        >
          <PeopleIcon className="pedestal-btn__icon" />
          <span className="pedestal-btn__title">PEOPLE</span>
          <div className="pedestal-btn__lines">
            <span>EXPERIENCE</span>
            <span>JUDGMENT</span>
            <span>LOCAL INSIGHT</span>
          </div>
        </button>

        {/* 2. TECHNOLOGY */}
        <button
          type="button"
          className="pedestal-btn pedestal-btn--tech"
          onClick={() => setActivePillarId('technology')}
          aria-label="Inspect Technology methodology: Precise Tools, Accurate Data, Greater Clarity"
        >
          <TechIcon className="pedestal-btn__icon" />
          <span className="pedestal-btn__title">TECHNOLOGY</span>
          <div className="pedestal-btn__lines">
            <span>PRECISE TOOLS</span>
            <span>ACCURATE DATA</span>
            <span>GREATER CLARITY</span>
          </div>
        </button>

        {/* 3. PROCESS */}
        <button
          type="button"
          className="pedestal-btn pedestal-btn--process"
          onClick={() => setActivePillarId('process')}
          aria-label="Inspect Process methodology: Order, Review, Delivery"
        >
          <span className="pedestal-btn__steps">01 — 02 — 03</span>
          <ProcessIcon className="pedestal-btn__icon" />
          <span className="pedestal-btn__title">PROCESS</span>
          <div className="pedestal-btn__lines">
            <span>ORDER</span>
            <span>REVIEW</span>
            <span>DELIVERY</span>
          </div>
        </button>
      </div>

      {/* Floating Pillar Details Modal on Click */}
      {activePillar ? (
        <div
          className="plinth-modal-backdrop"
          onClick={() => setActivePillarId(null)}
          role="presentation"
        >
          <div
            className="plinth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-pillar-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="plinth-modal__close"
              onClick={() => setActivePillarId(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <span className="badge">{activePillar.number} PILLAR</span>
            <h3 id="hero-pillar-modal-title" className="plinth-modal__title">
              {activePillar.headline}
            </h3>
            <p className="plinth-modal__desc">{activePillar.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- 2. UAD 3.6 Overlay ---------- */
export function UadOverlay({ onRequest }: { onRequest?: () => void }) {
  return (
    <div className="layer uad-layer">
      <div className="uad-layer__inner">
        <div
          className="uad-card uad-card--interactive"
          role="article"
          aria-label="UAD 3.6 booklet, hover or focus for details"
        >
          <div className="uad-card__badge-row">
            <span className="badge">GSE & Non-QM Ready</span>
            <span className="benefit">UAD 3.6 Native Schema</span>
          </div>
          <h2 className="uad-card__title">{uad.title}</h2>
          <p className="uad-card__body">{uad.body}</p>
          <ul className="uad-card__points">
            {uad.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="uad-card__info-panel" aria-hidden={false}>
            <div className="uad-card__info-caption">What this booklet covers</div>
            <ul className="uad-card__info-list">
              <li>
                <span className="uad-card__info-title">Native structured property data</span>
                <span className="uad-card__info-desc">
                  Property facts, condition and quality ratings, and comp evidence are captured in a single UAD 3.6 record instead of free text attached later.
                </span>
              </li>
              <li>
                <span className="uad-card__info-title">Consistent condition and quality ratings</span>
                <span className="uad-card__info-desc">
                  Every assignment uses the same UAD 3.6 condition and quality field definitions, so one report reads like the next.
                </span>
              </li>
              <li>
                <span className="uad-card__info-title">Lender-ready delivery</span>
                <span className="uad-card__info-desc">
                  The completed dataset is delivered in the form underwriters already review, with reviewable structured fields rather than a scanned narrative alone.
                </span>
              </li>
            </ul>
          </div>
          {onRequest ? (
            <button
              type="button"
              className="hero__link uad-card__cta"
              onClick={onRequest}
            >
              Request appraisal scope <span aria-hidden="true">→</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. Valuation Audience Selector (Navy Room with 5 Plinths) ---------- */
export function AudienceOverlay({
  onRequestRole,
}: {
  onRequestRole: (role: string) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRole) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedRole(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedRole]);

  const activeOption = selectedRole
    ? audience.options.find((opt) => opt.id === selectedRole)
    : null;

  return (
    <div className="layer audience-layer">
      {/* Centered Heading on Navy Wall Matching Reference Image 5 */}
      <div className="navy-wall-heading">
        <h2 className="navy-wall__title">
          A valuation solution
          <br />
          for every need.
        </h2>
        <p className="navy-wall__subtitle">{audience.subtitle}</p>
      </div>

      {/* 5 Real HTML <button> Elements Placed Over the 5 Plinth Faces */}
      <div className="plinth-stage">
        {/* Back Row: Lender (left), Broker (center), Appraiser (right) */}
        <button
          type="button"
          className="plinth-btn plinth-btn--lender"
          onClick={() => setSelectedRole('lender')}
          aria-label="Select Lender appraisal perspective"
        >
          <LenderIcon className="plinth-btn__icon" />
          <span className="plinth-btn__label">Lender</span>
        </button>

        <button
          type="button"
          className="plinth-btn plinth-btn--broker"
          onClick={() => setSelectedRole('broker')}
          aria-label="Select Broker valuation perspective"
        >
          <BrokerIcon className="plinth-btn__icon" />
          <span className="plinth-btn__label">Broker</span>
        </button>

        <button
          type="button"
          className="plinth-btn plinth-btn--appraiser"
          onClick={() => setSelectedRole('appraiser')}
          aria-label="Select Appraiser partnership perspective"
        >
          <AppraiserIcon className="plinth-btn__icon" />
          <span className="plinth-btn__label">Appraiser</span>
        </button>

        {/* Front Row: Homeowner (left), Other (right) */}
        <button
          type="button"
          className="plinth-btn plinth-btn--homeowner"
          onClick={() => setSelectedRole('homeowner')}
          aria-label="Select Homeowner appraisal perspective"
        >
          <HomeownerIcon className="plinth-btn__icon" />
          <span className="plinth-btn__label">Homeowner</span>
        </button>

        <button
          type="button"
          className="plinth-btn plinth-btn--other"
          onClick={() => setSelectedRole('other')}
          aria-label="Select Other institutional or legal perspective"
        >
          <OtherIcon className="plinth-btn__icon" />
          <span className="plinth-btn__label">Other</span>
        </button>
      </div>

      {/* Detail popover modal when a plinth button is clicked */}
      {activeOption ? (
        <div
          className="plinth-modal-backdrop"
          onClick={() => setSelectedRole(null)}
          role="presentation"
        >
          <div
            className="plinth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plinth-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="plinth-modal__close"
              onClick={() => setSelectedRole(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <div className="plinth-modal__meta">
              <span className="badge">{activeOption.tag}</span>
              <span className="benefit">{activeOption.benefit}</span>
            </div>
            <h3 id="plinth-modal-title" className="plinth-modal__title">
              {activeOption.headline}
            </h3>
            <p className="plinth-modal__desc">{activeOption.description}</p>
            <div className="plinth-modal__actions">
              <button
                type="button"
                className="btn btn--navy btn--sm"
                onClick={() => {
                  onRequestRole(activeOption.label);
                  setSelectedRole(null);
                }}
              >
                Request Appraisal Scope for {activeOption.label} →
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Bottom Center Cue Matching Reference Image 5 */}
      <div className="plinth-cue" aria-hidden="true">
        <span className="plinth-cue__line" />
        <span className="plinth-cue__num">{audience.cue}</span>
        <span className="plinth-cue__arrow">↓</span>
      </div>
    </div>
  );
}

/* ---------- 4. People / Technology / Process (Gallery Scene - Image 4) ---------- */
export function FoundationOverlay({ onLearnMore }: { onLearnMore: () => void }) {
  const [activePillarId, setActivePillarId] = useState<string | null>(null);

  useEffect(() => {
    if (!activePillarId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePillarId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePillarId]);

  const activePillar = activePillarId
    ? foundation.pillars.find((p) => p.id === activePillarId)
    : null;

  return (
    <div className="layer foundation-layer">
      {/* Left Editorial Scrim Matching Reference Image 4 */}
      <div className="foundation-left-editorial">
        <p className="eyebrow foundation__eyebrow">{foundation.eyebrow}</p>
        <h2 className="foundation__title">
          People.
          <br />
          Technology.
          <br />
          Process.
        </h2>
        <p className="foundation__subtitle">{foundation.subtitle}</p>
        <a
          href="#approach"
          className="hero__link foundation__link"
          onClick={(e) => {
            e.preventDefault();
            onLearnMore();
          }}
        >
          {foundation.cta} <span aria-hidden="true">→</span>
        </a>
        <div className="foundation__chapter" aria-hidden="true">
          {foundation.chapter}
        </div>
      </div>

      {/* Pedestal Interactive Buttons Over the 3 Stone Blocks in the Footage */}
      <div className="pedestal-stage">
        {/* 1. PEOPLE */}
        <button
          type="button"
          className="pedestal-btn pedestal-btn--people"
          onClick={() => setActivePillarId('people')}
          aria-label="Inspect People methodology: Experience, Judgment, Local Insight"
        >
          <PeopleIcon className="pedestal-btn__icon" />
          <span className="pedestal-btn__title">PEOPLE</span>
          <div className="pedestal-btn__lines">
            <span>EXPERIENCE</span>
            <span>JUDGMENT</span>
            <span>LOCAL INSIGHT</span>
          </div>
        </button>

        {/* 2. TECHNOLOGY */}
        <button
          type="button"
          className="pedestal-btn pedestal-btn--tech"
          onClick={() => setActivePillarId('technology')}
          aria-label="Inspect Technology methodology: Precise Tools, Accurate Data, Greater Clarity"
        >
          <TechIcon className="pedestal-btn__icon" />
          <span className="pedestal-btn__title">TECHNOLOGY</span>
          <div className="pedestal-btn__lines">
            <span>PRECISE TOOLS</span>
            <span>ACCURATE DATA</span>
            <span>GREATER CLARITY</span>
          </div>
        </button>

        {/* 3. PROCESS */}
        <button
          type="button"
          className="pedestal-btn pedestal-btn--process"
          onClick={() => setActivePillarId('process')}
          aria-label="Inspect Process methodology: Order, Review, Delivery"
        >
          <span className="pedestal-btn__steps">01 — 02 — 03</span>
          <ProcessIcon className="pedestal-btn__icon" />
          <span className="pedestal-btn__title">PROCESS</span>
          <div className="pedestal-btn__lines">
            <span>ORDER</span>
            <span>REVIEW</span>
            <span>DELIVERY</span>
          </div>
        </button>
      </div>

      {/* Floating Pillar Details Modal on Click */}
      {activePillar ? (
        <div
          className="plinth-modal-backdrop"
          onClick={() => setActivePillarId(null)}
          role="presentation"
        >
          <div
            className="plinth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pillar-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="plinth-modal__close"
              onClick={() => setActivePillarId(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <span className="badge">{activePillar.number} PILLAR</span>
            <h3 id="pillar-modal-title" className="plinth-modal__title">
              {activePillar.headline}
            </h3>
            <p className="plinth-modal__desc">{activePillar.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- 5. Regional Upstate (Hudson Valley) ---------- */
export function RegionalUpstateOverlay() {
  return (
    <div className="layer regional-upstate-layer">
      <div className="region-editorial">
        <p className="eyebrow region__eyebrow">{regionalUpstate.eyebrow}</p>
        <h2 className="region__title">{regionalUpstate.title}</h2>
        <p className="region__body">{regionalUpstate.body}</p>
      </div>
      <div className="scene-cue" aria-hidden="true">
        <span className="scene-cue__label">{regionalUpstate.cue}</span>
        <div className="scene-cue__track scene-cue__track--dots">
          <span className="scene-cue__dot scene-cue__dot--active" />
          <span className="scene-cue__dot" />
          <span className="scene-cue__dot" />
          <span className="scene-cue__dot" />
        </div>
      </div>
    </div>
  );
}

/* ---------- 6. Regional Central NY (Image 4 from first set) ---------- */
export function RegionalCentralOverlay() {
  return (
    <div className="layer regional-central-layer">
      <div className="region-editorial">
        <p className="eyebrow region__eyebrow">{regionalCentral.eyebrow}</p>
        <h2 className="region__title">{regionalCentral.title}</h2>
        <p className="region__body">{regionalCentral.body}</p>
      </div>
      <div className="scene-cue" aria-hidden="true">
        <span className="scene-cue__label">{regionalCentral.cue}</span>
        <div className="scene-cue__track scene-cue__track--line">
          <span className="scene-cue__bar" />
        </div>
      </div>
    </div>
  );
}

/* ---------- 7. Property Types (NYC Brownstones to Condos - Image 3) ---------- */
export function PropertyTypesOverlay() {
  const [selectedType, setSelectedType] = useState<string>('single-family');
  const activeType =
    propertyTypes.types.find((t) => t.id === selectedType) ?? propertyTypes.types[0];

  return (
    <div className="layer property-types-layer">
      {/* Top-left editorial heading */}
      <div className="property-types__head">
        <p className="eyebrow">{propertyTypes.eyebrow}</p>
        <h2 className="property-types__title">{propertyTypes.title}</h2>
        <p className="property-types__body">{propertyTypes.body}</p>
      </div>

      {/* Bottom-left interactive pill selector matching Reference Image 3 */}
      <div className="property-types__controls">
        <div
          className="property-pills"
          role="tablist"
          aria-label="New York City Property Types"
        >
          {propertyTypes.types.map((type) => {
            const isSelected = type.id === selectedType;
            return (
              <button
                key={type.id}
                type="button"
                role="tab"
                id={`tab-prop-${type.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-prop-${type.id}`}
                className={`property-pill ${isSelected ? 'property-pill--active' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                <span>{type.label}</span>
                <span className="property-pill__arrow" aria-hidden="true">
                  ›
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact detail panel for active type */}
        <div
          id={`panel-prop-${activeType.id}`}
          role="tabpanel"
          aria-labelledby={`tab-prop-${activeType.id}`}
          className="property-panel"
        >
          <h3 className="property-panel__headline">{activeType.headline}</h3>
          <p className="property-panel__desc">{activeType.description}</p>
        </div>
      </div>

      {/* Bottom-right scroll cue matching Image 3 */}
      <div className="scroll-corner" aria-hidden="true">
        <span className="scroll-corner__text">{propertyTypes.cue}</span>
        <span className="scroll-corner__arrow">⌵</span>
        <span className="scroll-corner__line" />
      </div>
    </div>
  );
}

/* ---------- 8. High-Rise City Canyon (Image 2 from first set) ---------- */
export function CityHighriseOverlay() {
  return (
    <div className="layer city-highrise-layer">
      <div className="city-editorial">
        <p className="eyebrow">{cityHighrise.eyebrow}</p>
        <h2 className="city__title">{cityHighrise.title}</h2>
        <p className="city__body">{cityHighrise.body}</p>
      </div>
      <div className="scene-cue scene-cue--center" aria-hidden="true">
        <span className="scene-cue__label">{cityHighrise.cue}</span>
        <span className="scene-cue__chevron">⌵</span>
      </div>
    </div>
  );
}

/* ---------- 9. Valuation Method (Appraisal Report Table - Image 1) ---------- */
export function ValuationMethodOverlay({ onRequest }: { onRequest: () => void }) {
  return (
    <div className="layer valuation-method-layer">
      <div className="method-editorial">
        <p className="eyebrow">{valuationMethod.eyebrow}</p>
        <h2 className="method__title">{valuationMethod.title}</h2>
        <p className="method__body">{valuationMethod.body}</p>
        <button
          type="button"
          className="hero__link method__link"
          onClick={onRequest}
        >
          {valuationMethod.cta} <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Bottom-left step indicator matching Image 1 */}
      <div className="method-progress">
        <span className="method-progress__label">{valuationMethod.progressLabel}</span>
        <div className="method-progress__track">
          <span className="method-progress__bar" />
        </div>
      </div>
    </div>
  );
}

/* ---------- 10. Discreet Overall Journey Progress Navigation ---------- */
export function JourneyProgress({
  onJumpToVh,
}: {
  onJumpToVh: (targetVh: number) => void;
}) {
  return (
    <nav className="journey-progress" aria-label="Journey Chapters">
      <div className="journey-progress__list">
        {chapters.map((ch, idx) => (
          <button
            key={ch.sectionId}
            type="button"
            className="journey-progress__step"
            data-chapter-index={idx}
            aria-label={`Jump to chapter: ${ch.label}`}
            onClick={() => onJumpToVh(ch.targetVh)}
          >
            <span className="journey-progress__dot" />
            <span className="journey-progress__tip">{ch.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
