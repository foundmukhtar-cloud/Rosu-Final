import { useEffect, useRef, useState } from 'react';
import { BookletCover } from './components/BookletCover';
import { Header } from './components/Header';
import { LoadingScreen, LoadingScreenSkip } from './lib/loadingScreen';
import { RequestDialog } from './components/RequestDialog';
import { ScrollSequence } from './components/ScrollSequence';
import {
  AudienceOverlay,
  CityHighriseOverlay,
  FoundationOverlay,
  HeroOverlay,
  JourneyProgress,
  PropertyTypesOverlay,
  RegionalCentralOverlay,
  RegionalUpstateOverlay,
  UadOverlay,
  ValuationMethodOverlay,
} from './components/SectionOverlays';
import { coverAt } from './lib/booklet';
import {
  audience,
  closing,
  foundation,
  propertyTypes,
  regionalCentral,
  regionalUpstate,
  uad,
  valuationMethod,
} from './lib/content';
import { assetUrl, frameUrl, type Sequence } from './lib/frames';
import {
  gallery,
  heroUad,
  newYorkContinuation,
  newYorkContinuation2,
  newYorkContinuation3,
  newYorkContinuation4,
  penthouseLounge,
  regionalExpertise,
} from './lib/sequences';
import { heroUadCover } from './lib/booklet';

type Mode = 'motion' | 'still';

const continuation: { sequence: Sequence; travelVh: number; holdStart?: number }[] = [
  { sequence: penthouseLounge, travelVh: 280, holdStart: 0.64 },
  { sequence: gallery, travelVh: 280, holdStart: 0.52 },
  { sequence: regionalExpertise, travelVh: 280 },
  { sequence: newYorkContinuation, travelVh: 280 },
  { sequence: newYorkContinuation2, travelVh: 280 },
  { sequence: newYorkContinuation3, travelVh: 280 },
  { sequence: newYorkContinuation4, travelVh: 280 },
];

function useExperienceMode(): Mode {
  const [mode, setMode] = useState<Mode>('still');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 767px)');
    const update = () =>
      setMode(reduced.matches || small.matches ? 'still' : 'motion');
    update();
    reduced.addEventListener('change', update);
    small.addEventListener('change', update);
    return () => {
      reduced.removeEventListener('change', update);
      small.removeEventListener('change', update);
    };
  }, []);

  return mode;
}

function scrollToVh(vh: number) {
  const journey = document.getElementById('appraisal');
  if (!journey) return;
  const stickyHeight = window.innerHeight;
  const targetTop = journey.offsetTop + (vh / 100) * stickyHeight;
  window.scrollTo({ top: targetTop, behavior: 'smooth' });
}

function scrollToTarget(targetId: string) {
  if (targetId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (targetId === 'contact') {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (targetId === 'appraisal') {
    scrollToVh(0);
    return;
  }
  if (targetId === 'approach') {
    scrollToVh(690);
    return;
  }
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function MotionJourney({
  onRequest,
  onRequestRole,
  onExplore,
  onJumpToVh,
  onReady,
}: {
  onRequest: () => void;
  onRequestRole: (role: string) => void;
  onExplore: () => void;
  onJumpToVh: (vh: number) => void;
  onReady?: () => void;
}) {
  return (
    <ScrollSequence
      sequence={heroUad}
      heightVh={380}
      continuation={continuation}
      id="appraisal"
      anchorId="approach"
      anchorAt={2.46}
      coverTrack={heroUadCover}
      onReady={onReady}
    >
      <HeroOverlay onExplore={onExplore} />

      <div className="booklet-layer">
        <BookletCover />
      </div>
      <UadOverlay onRequest={onRequest} />

      <AudienceOverlay onRequestRole={onRequestRole} />

      <FoundationOverlay onLearnMore={onExplore} />

      <RegionalUpstateOverlay />
      <RegionalCentralOverlay />

      <PropertyTypesOverlay />

      <CityHighriseOverlay />

      <ValuationMethodOverlay onRequest={onRequest} />

      <JourneyProgress onJumpToVh={onJumpToVh} />
    </ScrollSequence>
  );
}

function StillJourney({
  sequence,
  onRequest,
  onRequestRole,
}: {
  sequence: Sequence;
  onRequest: () => void;
  onRequestRole: (role: string) => void;
}) {
  const stillFrame = Math.round((sequence.frameCount - 1) * 0.72);
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [selectedPillar, setSelectedPillar] = useState('people');
  const [selectedType, setSelectedType] = useState('single-family');

  const activeAudience = selectedAudience
    ? audience.options.find((o) => o.id === selectedAudience)
    : null;
  const activePillar =
    foundation.pillars.find((p) => p.id === selectedPillar) ?? foundation.pillars[0];
  const activeType =
    propertyTypes.types.find((t) => t.id === selectedType) ?? propertyTypes.types[0];

  return (
    <div className="still-container">
      <section className="still-hero" id="appraisal" aria-labelledby="still-hero-title">
        <img
          className="still-hero__image"
          src={assetUrl(sequence.poster)}
          alt="Lower Manhattan skyline in morning light, seen across a limestone architectural model."
        />
        <div className="foundation-left-editorial still-hero__copy">
          <p className="eyebrow foundation__eyebrow">{foundation.eyebrow}</p>
          <h1 className="foundation__title" id="still-hero-title">
            People.
            <br />
            Technology.
            <br />
            Process.
          </h1>
          <p className="foundation__subtitle">{foundation.subtitle}</p>
          <a className="hero__link foundation__link" href="#approach">
            {foundation.cta} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="still-uad" id="uad-section" aria-labelledby="still-uad-title">
        <figure className="still-uad__figure">
          <img
            src={frameUrl(sequence, stillFrame)}
            alt="The appraisal scene: a scale model of a New York building in a penthouse overlooking the skyline."
            loading="lazy"
          />
          <BookletCover rect={coverAt(stillFrame / (sequence.frameCount - 1))} still />
        </figure>
        <div className="still-uad__copy">
          <div className="uad-card">
            <p className="eyebrow">{uad.eyebrow}</p>
            <h2 className="uad-card__title" id="still-uad-title">
              {uad.title}
            </h2>
            <p className="uad-card__body">{uad.body}</p>
            <ul className="uad-card__points">
              {uad.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="still-section still-section--navy" id="audience" aria-labelledby="still-audience-title">
        <figure className="still-section__media">
          <img
            src={frameUrl(penthouseLounge, penthouseLounge.frameCount - 1)}
            alt="Navy room with 5 limestone plinths representing appraisal stakeholders."
            loading="lazy"
          />
        </figure>
        <div className="still-section__content">
          <div className="navy-wall-heading still-navy-heading">
            <h2 className="navy-wall__title" id="still-audience-title">
              A valuation solution
              <br />
              for every need.
            </h2>
            <p className="navy-wall__subtitle">{audience.subtitle}</p>
          </div>

          <div className="still-plinths-grid" role="group" aria-label="Valuation Stakeholders">
            {audience.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`still-plinth-card ${selectedAudience === opt.id ? 'still-plinth-card--active' : ''}`}
                onClick={() => setSelectedAudience(opt.id)}
              >
                <span className="still-plinth-card__label">{opt.label}</span>
                <span className="still-plinth-card__tag">{opt.tag}</span>
              </button>
            ))}
          </div>

          {activeAudience ? (
            <div className="still-plinth-detail">
              <h3 className="still-plinth-detail__title">{activeAudience.headline}</h3>
              <p className="still-plinth-detail__desc">{activeAudience.description}</p>
              <button
                type="button"
                className="btn btn--navy btn--sm"
                onClick={() => onRequestRole(activeAudience.label)}
              >
                Request Appraisal Scope for {activeAudience.label}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="still-section" id="approach" aria-labelledby="still-foundation-title">
        <figure className="still-section__media">
          <img
            src={frameUrl(gallery, gallery.frameCount - 1)}
            alt="Gallery corridor with consultant working at pedestals."
            loading="lazy"
          />
        </figure>
        <div className="still-section__content">
          <div className="foundation-left-editorial still-foundation-editorial">
            <p className="eyebrow foundation__eyebrow">{foundation.eyebrow}</p>
            <h2 className="foundation__title" id="still-foundation-title">
              People.
              <br />
              Technology.
              <br />
              Process.
            </h2>
            <p className="foundation__subtitle">{foundation.subtitle}</p>

            <div className="pillar-tabs" role="tablist" aria-label="Methodology Pillars">
              {foundation.pillars.map((p) => {
                const isSelected = p.id === selectedPillar;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`pillar-tab ${isSelected ? 'pillar-tab--active' : ''}`}
                    onClick={() => setSelectedPillar(p.id)}
                  >
                    <span className="pillar-tab__num">{p.number}</span>
                    <span className="pillar-tab__name">{p.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="pillar-panel" role="tabpanel">
              <h3 className="pillar-panel__title">{activePillar.headline}</h3>
              <p className="pillar-panel__desc">{activePillar.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="still-section" id="regional" aria-labelledby="still-regional-title">
        <figure className="still-section__media still-region">
          <img
            src={frameUrl(regionalExpertise, regionalExpertise.frameCount - 1)}
            alt="Historic stone estate in Upstate & Hudson Valley overlooking the river."
            loading="lazy"
          />
          <div className="still-region__overlay">
            <p className="eyebrow">{regionalUpstate.eyebrow}</p>
            <h2 className="region__title" id="still-regional-title">
              {regionalUpstate.title}
            </h2>
            <p className="region__body">{regionalUpstate.body}</p>
          </div>
        </figure>
      </section>

      <section className="still-section" aria-labelledby="still-central-title">
        <figure className="still-section__media still-region">
          <img
            src={frameUrl(newYorkContinuation2, 0)}
            alt="Snow-covered craftsman bungalow homes in Central New York."
            loading="lazy"
          />
          <div className="still-region__overlay">
            <p className="eyebrow">{regionalCentral.eyebrow}</p>
            <h2 className="region__title" id="still-central-title">
              {regionalCentral.title}
            </h2>
            <p className="region__body">{regionalCentral.body}</p>
          </div>
        </figure>
      </section>

      <section className="still-section" id="property-types" aria-labelledby="still-types-title">
        <figure className="still-section__media">
          <img
            src={frameUrl(newYorkContinuation3, 0)}
            alt="New York City street showing historic brownstones and modern multifamily residences."
            loading="lazy"
          />
        </figure>
        <div className="still-section__content">
          <div className="property-types__head">
            <p className="eyebrow">{propertyTypes.eyebrow}</p>
            <h2 className="property-types__title" id="still-types-title">
              {propertyTypes.title}
            </h2>
            <p className="property-types__body">{propertyTypes.body}</p>
          </div>

          <div className="property-pills" role="tablist" aria-label="Property Types">
            {propertyTypes.types.map((type) => {
              const isSelected = type.id === selectedType;
              return (
                <button
                  key={type.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
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

          <div className="property-panel" role="tabpanel">
            <h3 className="property-panel__headline">{activeType.headline}</h3>
            <p className="property-panel__desc">{activeType.description}</p>
          </div>
        </div>
      </section>

      <section className="still-section" id="valuation-method" aria-labelledby="still-method-title">
        <figure className="still-section__media">
          <img
            src={frameUrl(newYorkContinuation4, newYorkContinuation4.frameCount - 1)}
            alt="Penthouse desk with appraisal report and architectural scale model."
            loading="lazy"
          />
        </figure>
        <div className="still-section__content">
          <div className="method-editorial">
            <p className="eyebrow">{valuationMethod.eyebrow}</p>
            <h2 className="method__title" id="still-method-title">
              {valuationMethod.title}
            </h2>
            <p className="method__body">{valuationMethod.body}</p>
            <button type="button" className="hero__link method__link" onClick={onRequest}>
              {valuationMethod.cta} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Closing({ onRequest }: { onRequest: () => void }) {
  return (
    <section className="closing" id="contact" aria-labelledby="closing-title">
      <div className="closing__inner">
        <p className="eyebrow">{closing.eyebrow}</p>
        <h2 className="closing__title" id="closing-title">
          {closing.title}
        </h2>
        <p className="closing__lede">{closing.lede}</p>
        <button
          type="button"
          className="btn btn--navy closing__button"
          onClick={onRequest}
        >
          {closing.action}
        </button>
        <dl className="closing__facts">
          {closing.facts.map((fact) => (
            <div key={fact.term}>
              <dt>{fact.term}</dt>
              <dd>{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function App() {
  const mode = useExperienceMode();
  const [requestOpen, setRequestOpen] = useState(false);
  const [preselectedRole, setPreselectedRole] = useState('Homeowner');

  const handleOpenRequest = (role?: string) => {
    if (role) {
      if (role.toLowerCase().includes('lender')) setPreselectedRole('Lender');
      else if (role.toLowerCase().includes('broker')) setPreselectedRole('Broker');
      else if (role.toLowerCase().includes('appraiser')) setPreselectedRole('Appraiser');
      else if (role.toLowerCase().includes('homeowner') || role.toLowerCase().includes('owner'))
        setPreselectedRole('Homeowner');
      else if (role.toLowerCase().includes('other') || role.toLowerCase().includes('legal'))
        setPreselectedRole('Other');
      else setPreselectedRole(role);
    }
    setRequestOpen(true);
  };

  const [loadingOpen, setLoadingOpen] = useState(true);
  const [loadingLeaving, setLoadingLeaving] = useState(false);
  const loadingLiveRef = useRef<HTMLDivElement | null>(null);

  const announceLoading = (text: string) => {
    if (loadingLiveRef.current) {
      loadingLiveRef.current.textContent = text;
    }
  };

  const handleReady = () => {
    setLoadingLeaving(true);
    setTimeout(() => {
      setLoadingOpen(false);
      announceLoading('Entering the site. Content continues to load in the background.');
    }, 600);
  };

  const skipLoading = () => {
    handleReady();
  };

  useEffect(() => {
    if (!loadingOpen) return;
    if (mode !== 'motion') {
      setLoadingOpen(false);
      return;
    }
    announceLoading('Preparing your experience');
    // Safety fallback so loading screen gracefully dissolves after at most 800ms
    const timer = setTimeout(() => {
      handleReady();
    }, 800);
    return () => {
      clearTimeout(timer);
      if (!loadingOpen) {
        announceLoading('');
      }
    };
  }, [loadingOpen, mode]);

  return (
    <div id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header
        onRequest={() => handleOpenRequest()}
        onNavigate={scrollToTarget}
      />

      <main id="main">
        {mode === 'motion' ? (
          <MotionJourney
            onRequest={() => handleOpenRequest()}
            onRequestRole={(role) => handleOpenRequest(role)}
            onExplore={() => scrollToTarget('approach')}
            onJumpToVh={scrollToVh}
            onReady={handleReady}
          />
        ) : (
          <StillJourney
            sequence={heroUad}
            onRequest={() => handleOpenRequest()}
            onRequestRole={(role) => handleOpenRequest(role)}
          />
        )}
        <Closing onRequest={() => handleOpenRequest()} />
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="site-footer__inner">
          <div className="site-footer__brand-block">
            <span className="brand brand--footer">ROSU</span>
            <p>Appraisal management · New York</p>
          </div>
          <p className="site-footer__meta">
            Prepared for UAD 3.6 · Licensed Appraisal Management Company
          </p>
          <p className="site-footer__copy">
            © {new Date().getFullYear()} ROSU Appraisal. All rights reserved.
          </p>
        </div>
      </footer>

      {loadingOpen && mode === 'motion' && (
        <LoadingScreen
          status="Preparing your experience"
          announce="Preparing your experience"
          containerRef={loadingLiveRef}
          leaving={loadingLeaving}
        >
          <LoadingScreenSkip onSkip={skipLoading} />
        </LoadingScreen>
      )}

      <RequestDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        defaultRole={preselectedRole}
      />
    </div>
  );
}
