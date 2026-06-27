import React, { useCallback, useEffect, useRef, useState } from 'react';
import './mdggisStyle.css';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ArrowRight } from 'lucide-react';

import mineimg from './assets/shahta.png?inline'
import mine3 from './assets/mine3.jpg?inline'
import mine4 from './assets/mine4.jpg?inline'
import heroAppShot from './assets/abce.jpg?inline'
import logo from './assets/Logo.png'
import MapSection from './MapSection';
import NavigationDots from './NavigationDots.jsx';
import { getCardsData } from './cardsData.js';
import { useI18n } from './i18n/LanguageProvider.jsx';

// --- CUSTOM HOOKS & UTILS --- //

function useForcedLightMode() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('gis-theme', 'light');
  }, []);
}

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -12px 0px' });

    const observeNodes = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    };

    observeNodes();

    const mutObs = new MutationObserver(() => {
      observeNodes();
    });

    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mutObs.disconnect();
    };
  }, []);
}

function CustomCursor() {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const shouldDisableCursor = window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches;
    if (shouldDisableCursor) return;

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, .nav-dot, .gallery-dot, .sol-card, .client-logo, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    />
  );
}

// Wrapper for Acron.ru like parallax background
function SectionWithBgImage({ children, image, align = 'center', id }) {
  return (
    <div style={{ position: "relative", width: "100%", zIndex: 1 }} id={id}>
      <div
        className="parallax-bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, rgba(238, 244, 247, 0.98) 0%, rgba(238, 244, 247, 0.85) 50%, rgba(238, 244, 247, 0.98) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: align,
          filter: "grayscale(85%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

function Lines({ items }) {
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={item}>
          {index > 0 && <br />}
          {item}
        </React.Fragment>
      ))}
    </>
  );
}

function LanguageSwitcher({ className = '', onChange }) {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = locale === 'ru' ? 'en' : 'ru';

  const handleChange = () => {
    setLocale(nextLocale);
    onChange?.();
  };

  return (
    <div className={`language-switcher ${className}`} aria-label={t.aria.languageSwitcher}>
      <button
        type="button"
        className="language-switcher-toggle"
        aria-label={t.aria.switchLanguage[nextLocale]}
        onClick={handleChange}
      >
        <span>{nextLocale.toUpperCase()}</span>
      </button>
    </div>
  );
}

// --- COMPONENTS --- //

function ImageGallery({ style, galleryImages, galleryCaptions, labels }) {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef(null);
  const galleryLength = galleryImages?.length || 0;

  const startInterval = useCallback(() => {
    if (!galleryLength) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % galleryLength);
    }, 6500);
  }, [galleryLength]);

  const handleManualChange = (newIndex) => {
    setIndex(newIndex);
    startInterval();
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  if (!galleryLength) return null;

  return (
    <div className="gallery-image-wrapper" style={{ ...style }}>
      <img
        src={galleryImages[index]}
        alt={galleryCaptions?.[index] || labels.galleryFallback}
        className="gallery-image"
        loading="lazy"
        onClick={() => setShowModal(true)}
        style={{ cursor: 'pointer' }}
      />
      <div style={{ textAlign: 'center', marginBottom: '0', color: 'var(--text-muted)' }}>
        {galleryCaptions?.[index]}
      </div>
      {galleryImages.length > 1 && (
        <div className="gallery-controls">
          {galleryImages.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot${i === index ? ' active' : ''}`}
              onClick={() => handleManualChange(i)}
              aria-label={`${labels.slide} ${i + 1}`}
            />
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered fullscreen style={{ background: 'transparent' }}>
        <Modal.Body style={{ background: 'var(--bg-mid)', color: 'var(--text)' }} className="d-flex flex-column align-items-center justify-content-center">
          <TransformWrapper>
            <TransformComponent>
              <img src={galleryImages[index]} alt={galleryCaptions?.[index] || labels.galleryFallback} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
            </TransformComponent>
          </TransformWrapper>
          <button
            onClick={() => setShowModal(false)}
            className="btn-primary"
            style={{ marginTop: '20px' }}
          >
            {labels.closeGallery}
          </button>
        </Modal.Body>
      </Modal>
    </div>
  )
}

function Header() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleHamburgerClick = () => {
    const isOpening = !menuOpen;
    setMenuOpen(isOpening);
    document.body.style.overflow = isOpening ? 'hidden' : '';
  };

  return (
    <>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mob-menu">
        <a href="#solutions" onClick={closeMenu}>{t.nav.solutions}</a>
        <a href="#products" onClick={closeMenu}>{t.nav.products}</a>
        <a href="#about" onClick={closeMenu}>{t.nav.about}</a>
        <LanguageSwitcher className="mobile-language-switcher" onChange={closeMenu} />
        <a href="#contacts" className="mob-cta" onClick={closeMenu}>{t.nav.contactCta}</a>
      </div>

      <nav id="main-nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <img src={logo} alt={t.nav.logoAlt} style={{ width: '32px', height: '32px' }} />
          <span className="nav-brand">{t.nav.brand[0]}<br />{t.nav.brand[1]}</span>
        </a>
        <ul className="nav-links">
          <li><a href="#solutions">{t.nav.solutions}</a></li>
          <li><a href="#products">{t.nav.products}</a></li>
          <li><a href="#about">{t.nav.about}</a></li>
          <li><LanguageSwitcher /></li>
          <li><a href="#contacts" className="nav-cta">{t.nav.contactCta}</a></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="d-lg-none">
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} id="hbg" aria-label={t.aria.menu} onClick={handleHamburgerClick}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </>
  );
}

function HeroSection() {
  const { t } = useI18n();

  return (
    <SectionWithBgImage image={mineimg} id="hero">
      <section className="hero">
        <div className="hero-scanner"></div>
        <div className="hero-visual" aria-hidden="true">
          <svg viewBox="0 0 500 420" fill="none">
            <g opacity="0.7">
              <ellipse cx="250" cy="80" rx="200" ry="40" stroke="#1D9E75" strokeWidth="0.8" strokeDasharray="4 3" />
              <ellipse cx="250" cy="160" rx="200" ry="40" stroke="#1D9E75" strokeWidth="0.8" strokeDasharray="4 3" />
              <ellipse cx="250" cy="240" rx="200" ry="40" stroke="#1D9E75" strokeWidth="0.6" strokeDasharray="4 3" />
              <ellipse cx="250" cy="320" rx="200" ry="40" stroke="#1D9E75" strokeWidth="0.4" strokeDasharray="4 3" />
            </g>
            <line x1="50" y1="80" x2="50" y2="360" stroke="#1D9E75" strokeWidth="0.8" opacity="0.5" />
            <line x1="450" y1="80" x2="450" y2="360" stroke="#1D9E75" strokeWidth="0.8" opacity="0.5" />
            <path d="M50 160L180 200L320 180L450 160" stroke="#5DCAA5" strokeWidth="0.8" fill="none" opacity="0.4" />
            <path d="M50 240L150 270L280 255L450 240" stroke="#5DCAA5" strokeWidth="0.6" fill="none" opacity="0.3" />
            <rect x="140" y="145" width="30" height="30" rx="2" stroke="#1D9E75" strokeWidth="1" fill="rgba(29,158,117,0.08)" />
            <rect x="280" y="145" width="30" height="30" rx="2" stroke="#1D9E75" strokeWidth="1" fill="rgba(29,158,117,0.08)" />
            <circle cx="155" cy="160" r="4" fill="#1D9E75" opacity="0.8" />
            <circle cx="295" cy="160" r="4" fill="#1D9E75" opacity="0.8" />
            <circle cx="195" cy="240" r="3" fill="#5DCAA5" opacity="0.5" />
          </svg>
        </div>
        <div className="hero-content">
          <div className="hero-badge">{t.hero.badge}</div>
          <h1>{t.hero.title} <em>{t.hero.titleEm}</em></h1>
          <p className="hero-sub">{t.hero.sub}</p>
          <div className="hero-actions">
            <a href="#contacts" className="btn-primary">{t.hero.primaryCta}</a>
            <a href="#case" className="btn-outline">{t.hero.secondaryCta}</a>
          </div>
        </div>
        <div className="hero-showcase" aria-label={t.aria.appInterface}>
          <div className="hero-app-window">
            <div className="hero-app-chrome">
              <span></span>
              <span></span>
              <span></span>
              <div className="hero-app-title">{t.hero.appTitle}</div>
            </div>
            <img src={heroAppShot} alt={t.hero.appAlt} />
          </div>
          <div className="hero-stats">
            {t.hero.stats.map((stat) => (
              <div className="stat-card" key={stat.num}>
                <div className="stat-num">{stat.num}</div>
                <div className="stat-label"><Lines items={stat.label} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionWithBgImage>
  );
}

function ClientsStrip() {
  const { t } = useI18n();

  return (
    <div className="clients-strip reveal">
      <div className="clients-label">{t.clients.label}</div>
      <div className="clients-grid">
        {t.clients.logos.map((client) => (
          <div className="client-logo" key={client.name}>
            {client.name}
            <small>{client.meta}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseStudySection() {
  const { t } = useI18n();

  return (
    <section className="case-study template-section" id="case">
      <div className="section-label reveal">{t.case.label}</div>
      <div className="case-header">
        <div>
          <div className="section-title reveal d1"><Lines items={t.case.title} /></div>
          <p className="section-sub reveal d2" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {t.case.sub}
          </p>
        </div>
        <div className="case-award reveal d2">
          <div className="case-award-title">{t.case.awardTitle}</div>
          <div className="case-award-text">{t.case.awardText}</div>
        </div>
      </div>
      <div className="case-metrics reveal d2">
        {t.case.metrics.map((metric) => (
          <div className="metric" key={metric.num}>
            <div className="metric-num">{metric.num}</div>
            <div className="metric-label"><Lines items={metric.label} /></div>
          </div>
        ))}
      </div>
      <div className="case-quote reveal d3">
        <div className="case-avatar">{t.case.avatar}</div>
        <div>
          <div className="case-quote-text">{t.case.quote}</div>
          <div className="case-quote-author">{t.case.quoteAuthor}</div>
          <div className="case-quote-role">{t.case.quoteRole}</div>
        </div>
      </div>
      <div className="case-cta reveal d3">
        <div>{t.case.ctaText}</div>
        <a href="#contacts" className="btn-primary">{t.case.ctaButton}</a>
      </div>
    </section>
  );
}

function ExpandedSolutionView({ data, onBack, labels }) {
  return (
    <div className="solution-expanded animate-in" style={{ position: 'relative', zIndex: 10 }}>
      <div className="expanded-controls">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBack(); }}
          className="btn-outline"
          type="button"
          style={{ cursor: 'pointer', zIndex: 20, position: 'relative' }}
        >
          {labels.back}
        </button>
        <a href="#contacts" className="btn-primary">
          {labels.price}
        </a>
      </div>

      <h3>{data.text}</h3>
      {data.images && data.images.length > 0 && (
        <ImageGallery galleryImages={data.images} galleryCaptions={data.captions || []} labels={labels.gallery} />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1rem' }}>{labels.works}</h4>
          {data.works.map((work, index) => (
            <div className="work-item" key={index}>{work}</div>
          ))}
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1rem' }}>{labels.benefits}</h4>
          {data.benefits.map((benefit, index) => (
            <div className="benefit-item" key={index}>{benefit}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SolutionsSection() {
  const { t } = useI18n();
  const { cardsData } = getCardsData(t);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const solutionGroups = t.solutions.groups.map((group) => ({
    ...group,
    cards: group.cardIndexes.map((index) => cardsData[index]),
  }));

  return (
    <SectionWithBgImage image={mine3} id="solutions">
      <section className="solutions section" style={{ background: 'transparent' }}>
        <div className="sec-label reveal">{t.solutions.label}</div>
        <div className="sec-title reveal d1"><Lines items={t.solutions.title} /></div>
        <p className="sec-sub reveal d2">{t.solutions.sub}</p>

        {selectedSolution ? (
          <ExpandedSolutionView
            data={selectedSolution}
            labels={{
              ...t.solutions.expanded,
              gallery: {
                galleryFallback: t.aria.galleryFallback,
                closeGallery: t.aria.closeGallery,
                slide: t.aria.slide,
              },
            }}
            onBack={() => {
              setSelectedSolution(null);
              setIsReturning(true);
              setTimeout(() => {
                document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 10);
            }}
          />
        ) : (
          <div className={`solution-groups ${isReturning ? 'animate-in' : 'reveal d3'}`}>
            {solutionGroups.map((group) => (
              <div className="solution-group" key={group.title}>
                <div className="solution-group-head">
                  <div className="solution-group-title">{group.title}</div>
                  <div className="solution-group-desc">{group.desc}</div>
                </div>
                <div className="sol-grid">
                  {group.cards.map((card) => {
                    const idx = cardsData.indexOf(card);
                    return (
                      <button
                        className="sol-card"
                        type="button"
                        key={card.text}
                        onClick={() => {
                          setSelectedSolution(card);
                          setIsReturning(false);
                          setTimeout(() => {
                            document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 10);
                        }}
                      >
                        <div className="sol-num">{String(idx + 1).padStart(2, '0')}</div>
                        <div className="sol-icon" dangerouslySetInnerHTML={{ __html: card.icon }} />
                        <div className="sol-title">{card.text}</div>
                        <div className="sol-desc">{card.description}</div>
                        <span className="sol-action">{t.solutions.action}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SectionWithBgImage>
  );
}

function ProcessSection() {
  const { t } = useI18n();

  return (
    <section className="process template-section" id="process">
      <div className="section-label reveal">{t.process.label}</div>
      <div className="section-title reveal d1"><Lines items={t.process.title} /></div>
      <p className="section-sub reveal d2">{t.process.sub}</p>
      <div className="process-steps reveal d3">
        {t.process.steps.map((step, idx) => (
          <div className={`process-step ${idx === 0 ? 'active' : ''}`} key={step.title}>
            <div className="process-circle">{String(idx + 1).padStart(2, '0')}</div>
            <div className="process-title">{step.title}</div>
            <div className="process-desc">{step.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductsSection() {
  const { t } = useI18n();
  const { productsCardsData } = getCardsData(t);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  return (
    <SectionWithBgImage image={mine4} id="products">
      <section className="products-sec section" style={{ background: 'transparent' }}>
        <div className="sec-label reveal">{t.products.label}</div>
        <div className="sec-title reveal d1"><Lines items={t.products.title} /></div>
        <p className="sec-sub reveal d2">{t.products.sub}</p>

        {selectedProduct ? (
          <ExpandedSolutionView
            data={selectedProduct}
            labels={{
              ...t.solutions.expanded,
              gallery: {
                galleryFallback: t.aria.galleryFallback,
                closeGallery: t.aria.closeGallery,
                slide: t.aria.slide,
              },
            }}
            onBack={() => {
              setSelectedProduct(null);
              setIsReturning(true);
              setTimeout(() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 10);
            }}
          />
        ) : (
          <div className={`prod-grid ${isReturning ? 'animate-in' : 'reveal d3'}`}>
            {productsCardsData.map((prod, idx) => (
              <div
                className="prod-card"
                key={idx}
              >
                <div className="prod-tag">{prod.tag || t.products.defaultTag}</div>
                <div className="prod-title">{prod.text}</div>
                <div className="prod-desc">{prod.description}</div>
                {prod.includes && (
                  <div className="product-includes">
                    <div className="product-includes-title">{t.products.includesTitle}</div>
                    <ul>
                      {prod.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(prod.price || prod.implementation) && (
                  <div className="product-pricing">
                    {prod.price && (
                      <div className="pricing-item">
                        <div className="pricing-label">{t.products.price}</div>
                        <div className="pricing-value">{prod.price}</div>
                      </div>
                    )}
                    {prod.implementation && (
                      <div className="pricing-item">
                        <div className="pricing-label">{t.products.implementation}</div>
                        <div className="pricing-value">{prod.implementation}</div>
                      </div>
                    )}
                  </div>
                )}
                <div className="product-actions">
                  <a href="#contacts" className="btn-primary" onClick={(e) => e.stopPropagation()}>{t.products.demo}</a>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(prod);
                      setIsReturning(false);
                      setTimeout(() => {
                        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 10);
                    }}
                  >
                    {t.products.details}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SectionWithBgImage>
  );
}

function AboutSection() {
  const { t } = useI18n();

  return (
    <SectionWithBgImage image={mineimg} id="about">
      <section className="about section" style={{ background: 'transparent' }}>
        <div className="sec-label reveal">{t.about.label}</div>
        <div className="about-grid">
          <div>
            <div className="sec-title reveal d1">{t.about.title}</div>
            <div className="divider reveal d2"></div>
            <div className="about-body reveal d3">
              {t.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="partners-box reveal d3">
              <div className="partners-label">{t.about.partnersLabel}</div>
              <div className="partners-list">{t.about.partners}</div>
            </div>
          </div>
          <div className="facts reveal d2">
            {t.about.facts.map((fact) => (
              <div className="fact" key={fact.title}>
                <div className="fact-dot"></div>
                <div className="fact-text"><strong>{fact.title}</strong>{fact.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionWithBgImage>
  );
}

function TestimonialsSection() {
  const { t } = useI18n();

  return (
    <section className="testimonials template-section" id="testimonials">
      <div className="section-label reveal">{t.testimonials.label}</div>
      <div className="section-title reveal d1">{t.testimonials.title}</div>
      <p className="section-sub reveal d2">{t.testimonials.sub}</p>
      <div className="testimonials-grid reveal d3">
        {t.testimonials.items.map((item) => (
          <div className="testimonial" key={item.initials}>
            <div className="testimonial-quote-mark">"</div>
            <div className="testimonial-text">{item.text}</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{item.initials}</div>
              <div>
                <div className="testimonial-name">{item.name}</div>
                <div className="testimonial-role">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  const { t } = useI18n();

  return (
    <div className="cta-banner reveal">
      <div>
        <div className="cta-title"><Lines items={t.cta.title} /></div>
        <div className="cta-sub">{t.cta.sub}</div>
      </div>
      <a href="#contacts" className="cta-btn">{t.cta.button}</a>
    </div>
  );
}

function ContactsSection() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ name: '', company: '', email: '', interest: '', message: '' });
  const [btnText, setBtnText] = useState(t.contacts.submit);

  useEffect(() => {
    setBtnText(t.contacts.submit);
  }, [t.contacts.submit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMailto = () => {
    const subject = encodeURIComponent(`${t.contacts.mail.subjectPrefix} ${formData.name || t.contacts.mail.subjectFallback}${formData.company ? ` (${formData.company})` : ''}`);
    const body = encodeURIComponent(
      `${t.contacts.mail.fields.name}: ${formData.name}\n${t.contacts.mail.fields.company}: ${formData.company}\n${t.contacts.mail.fields.email}: ${formData.email}\n${t.contacts.mail.fields.interest}: ${formData.interest}\n\n${t.contacts.mail.fields.message}:\n${formData.message}`
    );
    return `mailto:gissolutions@ya.ru?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = generateMailto();
    setBtnText(t.contacts.submitOpened);
  };

  return (
    <section className="contacts-sec section" id="contacts">
      <div className="sec-label reveal">{t.contacts.label}</div>
      <div className="sec-title reveal d1">{t.contacts.title}</div>
      <p className="sec-sub reveal d2">{t.contacts.sub}</p>
      <div className="contact-shell reveal d1">
        <div className="contacts-grid">
          <div className="contact-main">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">{t.contacts.labels.name}</label>
                  <input id="contact-name" type="text" name="name" placeholder={t.contacts.placeholders.name} value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-company">{t.contacts.labels.company}</label>
                  <input id="contact-company" type="text" name="company" placeholder={t.contacts.placeholders.company} value={formData.company} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">{t.contacts.labels.email}</label>
                <input id="contact-email" type="email" name="email" placeholder={t.contacts.placeholders.email} value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-interest">{t.contacts.labels.interest}</label>
                <select id="contact-interest" name="interest" value={formData.interest} onChange={handleInputChange}>
                  <option value="">{t.contacts.placeholders.interest}</option>
                  {t.contacts.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">{t.contacts.labels.message}</label>
                <textarea id="contact-message" name="message" placeholder={t.contacts.placeholders.message} value={formData.message} onChange={handleInputChange}></textarea>
              </div>
              <div className="contact-form-actions">
                <button className="btn-primary" type="submit">
                  {btnText}
                </button>
                <p className="contact-fallback">
                  {t.contacts.fallback.beforeEmail} <a href="mailto:gissolutions@ya.ru">gissolutions@ya.ru</a> {t.contacts.fallback.beforePhone} <a href="tel:+73422799654">+7 (3422) 799-654</a>.
                </p>
              </div>
            </form>

            <div className="partner-badge next-steps">
              <div className="pb-label">{t.contacts.nextStepsLabel}</div>
              <ol className="next-steps-path" aria-label={t.contacts.nextStepsAria}>
                {t.contacts.nextSteps.map((step, index) => (
                  <li className="next-step-item" key={step}>
                    <span className="next-step-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="next-step-text">{step}</span>
                    {index < t.contacts.nextSteps.length - 1 && <ArrowRight className="next-step-arrow" size={18} aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="contact-info reveal d2">
            <div className="contact-info-title">{t.contacts.infoTitle}</div>
            <div className="ci"><div className="ci-label">{t.contacts.labels.manager}</div><div className="ci-val">{t.contacts.managerName}</div></div>
            <div className="ci"><div className="ci-label">{t.contacts.labels.email}</div><a href="mailto:gissolutions@ya.ru" className="ci-val">gissolutions@ya.ru</a></div>
            <div className="ci"><div className="ci-label">{t.contacts.labels.phone}</div><a href="tel:+73422799654" className="ci-val">+7 (3422) 799-654</a></div>
            <div className="ci ci-address">
              <div className="ci-label">{t.contacts.labels.address}</div>
              <div className="ci-val"><Lines items={t.contacts.address} /></div>
            </div>
            <div className="contact-map">
              <MapSection interactionLabel={t.aria.mapInteraction} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();

  return (
    <footer>
      <div className="footer-left">
        <a href="#" className="footer-logo">
          <img src={logo} alt={t.nav.logoAlt} style={{ width: '32px', height: '32px' }} />
          <span className="footer-brand">{t.footer.brand}</span>
        </a>
        <div className="footer-copy">{t.footer.copyright}</div>
      </div>
      <div className="footer-links">
        <a href="#solutions">{t.nav.solutions}</a>
        <a href="#products">{t.nav.products}</a>
        <a href="#about">{t.nav.about}</a>
        <a href="#contacts">{t.nav.contacts}</a>
      </div>
    </footer>
  );
}

function App() {
  const { t } = useI18n();
  const sectionsDef = t.sections;
  useForcedLightMode();
  useScrollReveal();

  const [visibleSections, setVisibleSections] = useState(
    new Array(sectionsDef.length).fill(false)
  );

  useEffect(() => {
    const handleScroll = () => {
      let activeIndex = -1;
      let minDistance = Infinity;
      const centerY = window.innerHeight / 2;

      sectionsDef.forEach((sec, idx) => {
        const el = document.getElementById(sec.type);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        
        if (rect.top <= centerY && rect.bottom >= centerY) {
          activeIndex = idx;
        } else if (activeIndex === -1) {
          const dist = Math.min(Math.abs(rect.top - centerY), Math.abs(rect.bottom - centerY));
          if (dist < minDistance) {
            minDistance = dist;
            // only fallback if we haven't found an exact match yet
          }
        }
      });
      
      // Secondary pass if no section strictly contains the center
      if (activeIndex === -1) {
         sectionsDef.forEach((sec, idx) => {
          const el = document.getElementById(sec.type);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const dist = Math.min(Math.abs(rect.top - centerY), Math.abs(rect.bottom - centerY));
          if (dist === minDistance) {
            activeIndex = idx;
          }
        });
      }

      if (activeIndex === -1) activeIndex = 0;

      const newVisible = sectionsDef.map((_, idx) => idx === activeIndex);
      setVisibleSections(newVisible);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init checking
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionsDef]);

  return (
    <div>
      <CustomCursor />
      <Header />
      <NavigationDots sections={sectionsDef} visibleSections={visibleSections} />
      <HeroSection />
      <ClientsStrip />
      <CaseStudySection />
      <SolutionsSection />
      <ProcessSection />
      <ProductsSection />
      <TestimonialsSection />
      <AboutSection />
      <CtaBanner />
      <ContactsSection />
      <Footer />
    </div>
  );
}

export default App;
