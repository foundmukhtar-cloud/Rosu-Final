import { useEffect, useState } from 'react';

type HeaderProps = {
  onRequest: () => void;
  onNavigate?: (targetId: string) => void;
};

export function Header({ onRequest, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'appraisal' | 'approach' | 'contact'>('appraisal');
  const [overHero, setOverHero] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      !window.matchMedia('(max-width: 767px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect();
        if (contactRect.top <= window.innerHeight * 0.5) {
          setActiveNav('contact');
          setOverHero(false);
          return;
        }
      }

      const journeyEl = document.getElementById('appraisal');
      if (!journeyEl) return;

      if (journeyEl.classList.contains('journey')) {
        const journeyRect = journeyEl.getBoundingClientRect();
        const stickyHeight = window.innerHeight;
        const scrolledVh = (-journeyRect.top / stickyHeight) * 100;
        setOverHero(scrolledVh < 560);
        setActiveNav(scrolledVh >= 560 ? 'approach' : 'appraisal');
        return;
      }

      setOverHero(false);
      const approachEl = document.getElementById('approach');
      const approachTop = approachEl?.getBoundingClientRect().top ?? Infinity;
      setActiveNav(approachTop <= window.innerHeight * 0.55 ? 'approach' : 'appraisal');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMenuOpen(false);
    if (targetId === 'appraisal') setActiveNav('appraisal');
    else if (targetId === 'approach') setActiveNav('approach');
    else if (targetId === 'contact') setActiveNav('contact');

    if (onNavigate) {
      event.preventDefault();
      onNavigate(targetId);
    }
  };

  return (
    <header
      className={`site-header${overHero ? ' site-header--over-hero' : ''}`}
      role="banner"
    >
      <div className="site-header__inner">
        <a
          className="brand"
          href="#top"
          onClick={(e) => handleLinkClick(e, 'top')}
          aria-label="ROSU Valuation Homepage"
        >
          <span className="brand__letters">R O S U</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a
            href="#appraisal"
            className={activeNav === 'appraisal' ? 'site-nav__link--active' : ''}
            onClick={(e) => handleLinkClick(e, 'appraisal')}
          >
            Appraisal
          </a>
          <a
            href="#approach"
            className={activeNav === 'approach' ? 'site-nav__link--active' : ''}
            onClick={(e) => handleLinkClick(e, 'approach')}
          >
            Our Approach
          </a>
          <a
            href="#contact"
            className={activeNav === 'contact' ? 'site-nav__link--active' : ''}
            onClick={(e) => handleLinkClick(e, 'contact')}
          >
            Contact
          </a>
          <button
            type="button"
            className="btn btn--navy btn--sm header__cta"
            onClick={onRequest}
          >
            <span>Request an appraisal</span>
            <span aria-hidden="true">→</span>
          </button>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className="mobile-nav"
        hidden={!menuOpen}
        aria-hidden={!menuOpen}
      >
        <a
          href="#appraisal"
          className={activeNav === 'appraisal' ? 'site-nav__link--active' : ''}
          onClick={(e) => handleLinkClick(e, 'appraisal')}
        >
          Appraisal
        </a>
        <a
          href="#approach"
          className={activeNav === 'approach' ? 'site-nav__link--active' : ''}
          onClick={(e) => handleLinkClick(e, 'approach')}
        >
          Our Approach
        </a>
        <a
          href="#contact"
          className={activeNav === 'contact' ? 'site-nav__link--active' : ''}
          onClick={(e) => handleLinkClick(e, 'contact')}
        >
          Contact
        </a>
        <button
          type="button"
          className="btn btn--navy mobile-nav__cta"
          onClick={() => {
            setMenuOpen(false);
            onRequest();
          }}
        >
          Request an Appraisal →
        </button>
      </div>
    </header>
  );
}
