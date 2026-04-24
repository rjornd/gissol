import React, { useEffect, useRef, useState } from 'react';
import './mdggisStyle.css';
import { useSpring, animated } from '@react-spring/web';
import { Card, Container, Modal, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import mineimg from './assets/shahta.png?inline'
import mine2 from './assets/mine2.jpg?inline'
import mine3 from './assets/mine3.jpg?inline'
import mine4 from './assets/mine4.jpg?inline'
import logo from './assets/Logo.png'
import MapSection from './MapSection';
import NavigationDots from './NavigationDots.jsx';
import { cardsData, productsCardsData } from './cardsData.js';

const sectionsDef = [
  { type: 'hero', nav: "Главная" },
  { type: 'achivments', nav: "Достижения" },
  { type: 'solutions', nav: "Решения" },
  { type: 'products', nav: "Продукты" },
  { type: 'about', nav: "О компании" },
  { type: 'contacts', nav: "Контакты" }
];

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
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

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
    // Check if it's mobile before adding listener to save performance
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, .nav-dot, .gallery-dot, .sol-card, .prod-card, .custom-select-option, [role="button"]');
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

// --- COMPONENTS --- //

function ImageGallery({ style, galleryImages, galleryCaptions }) {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % galleryImages.length);
    }, 6500);
  };

  const handleManualChange = (newIndex) => {
    setIndex(newIndex);
    startInterval();
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!galleryImages || galleryImages.length === 0) return null;

  return (
    <div className="gallery-image-wrapper" style={{ ...style }}>
      <img
        src={galleryImages[index]}
        alt={galleryCaptions?.[index] || 'Gallery'}
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
              aria-label={`Slide ${i}`}
            />
          ))}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered fullscreen style={{ background: 'transparent' }}>
        <Modal.Body style={{ background: 'var(--bg-mid)', color: 'var(--text)' }} className="d-flex flex-column align-items-center justify-content-center">
          <TransformWrapper>
            <TransformComponent>
              <img src={galleryImages[index]} alt={galleryCaptions?.[index] || 'Gallery'} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
            </TransformComponent>
          </TransformWrapper>
          <button
            onClick={() => setShowModal(false)}
            className="btn-primary"
            style={{ marginTop: '20px' }}
          >
            Закрыть галерею
          </button>
        </Modal.Body>
      </Modal>
    </div>
  )
}

function Header() {
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
        <a href="#solutions" onClick={closeMenu}>Решения</a>
        <a href="#products" onClick={closeMenu}>Продукты</a>
        <a href="#about" onClick={closeMenu}>О компании</a>
        <a href="#contacts" className="mob-cta" onClick={closeMenu}>Написать нам</a>
      </div>

      <nav id="main-nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <img src={logo} alt="ГИС Решения" style={{ width: '32px', height: '32px' }} />
          <span className="nav-brand">ГИС<br />РЕШЕНИЯ</span>
        </a>
        <ul className="nav-links">
          <li><a href="#solutions">Решения</a></li>
          <li><a href="#products">Продукты</a></li>
          <li><a href="#about">О компании</a></li>
          <li><a href="#contacts" className="nav-cta">Написать нам</a></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="d-lg-none">
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} id="hbg" aria-label="Меню" onClick={handleHamburgerClick}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </>
  );
}

function HeroSection() {
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
          <div className="hero-badge">Партнёр Пермского Политеха</div>
          <h1>Интеллектуальные ГГИС <br />для горной отрасли <em>нового поколения</em></h1>
          <p className="hero-sub">Разрабатываем и внедряем программные продукты и цифровые двойники предприятий. Оптимизируем процессы добычи, повышаем безопасность и экономическую эффективность работы рудников.</p>
          <div className="hero-actions">
            <a href="#contacts" className="btn-primary">Запросить демо &rarr;</a>
            <a href="#solutions" className="btn-outline">Наши решения</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card"><div className="stat-num">800+</div><div className="stat-label">специалистов в системе<br />«Уралкалия»</div></div>
          <div className="stat-card"><div className="stat-num">#1</div><div className="stat-label">лучший ИТ-проект<br />России и СНГ 2020</div></div>
          <div className="stat-card"><div className="stat-num">193</div><div className="stat-label">проекта-участника<br />в конкурсе</div></div>
        </div>
      </section>
    </SectionWithBgImage>
  );
}

function AwardBanner() {
  return (
    <SectionWithBgImage image={mine2} align="top" id="achivments">
      <div className="award-banner reveal">
        <div className="award-icon">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#1D9E75" strokeWidth="1.5" fill="rgba(29,158,117,0.2)" />
          </svg>
        </div>
        <div className="award-text">
          <div className="award-title">Лучший ИТ-проект России и стран СНГ — GlobalCIO | DigitalExperts</div>
          <div className="award-desc">Проект <span className="award-highlight">«Цифровой двойник рудника»</span> по заказу ПАО «Уралкалий» — первое место в категории «Металлургия и непрерывное производство».</div>
        </div>
        <a href="https://www.uralkali.com/ru/press_center/company_news/item42943/" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Читать о кейсе</a>
      </div>
    </SectionWithBgImage>
  );
}

function ExpandedSolutionView({ data, onBack }) {
  return (
    <div className="solution-expanded animate-in" style={{ position: 'relative', zIndex: 10 }}>
      <div className="expanded-controls">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBack(); }}
          className="btn-outline"
          type="button"
          style={{ cursor: 'pointer', zIndex: 20, position: 'relative' }}
        >
          &larr; Назад к списку
        </button>
        <a href="#contacts" className="btn-primary">
          Узнать стоимость
        </a>
      </div>

      <h3>{data.text}</h3>
      {data.images && data.images.length > 0 && (
        <ImageGallery galleryImages={data.images} galleryCaptions={data.captions || []} />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1rem' }}>РЕШАЕМЫЕ ЗАДАЧИ</h4>
          {data.works.map((work, index) => (
            <div className="work-item" key={index}>{work}</div>
          ))}
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1rem' }}>РЕЗУЛЬТАТЫ ВНЕДРЕНИЯ</h4>
          {data.benefits.map((benefit, index) => (
            <div className="benefit-item" key={index}>{benefit}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SolutionsSection() {
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  return (
    <SectionWithBgImage image={mine3} id="solutions">
      <section className="solutions section" style={{ background: 'transparent' }}>
        <div className="sec-label reveal">Комплексные решения</div>
        <div className="sec-title reveal d1">Полный цикл геолого-<br />маркшейдерских работ</div>
        <p className="sec-sub reveal d2">От разведки месторождения до оперативного планирования горных работ — всё в единой цифровой среде.</p>

        {selectedSolution ? (
          <ExpandedSolutionView
            data={selectedSolution}
            onBack={() => {
              setSelectedSolution(null);
              setIsReturning(true);
              setTimeout(() => {
                document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 10);
            }}
          />
        ) : (
          <div className={`sol-grid ${isReturning ? 'animate-in' : 'reveal d3'}`}>
            {cardsData.map((card, idx) => (
              <div
                className="sol-card"
                key={idx}
                onClick={() => {
                  setSelectedSolution(card);
                  setIsReturning(false);
                  setTimeout(() => {
                    document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 10);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="sol-num">0{idx + 1}</div>
                <div className="sol-icon" dangerouslySetInnerHTML={{ __html: card.icon }} />
                <div className="sol-title">{card.text}</div>
                <div className="sol-desc">{card.description}</div>
                <div style={{ marginTop: '15px', color: 'var(--teal)', fontSize: '0.8rem', fontWeight: 'bold' }}>Смотреть ПО &rarr;</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SectionWithBgImage>
  );
}

function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isReturning, setIsReturning] = useState(false);

  return (
    <SectionWithBgImage image={mine4} id="products">
      <section className="products-sec section" style={{ background: 'transparent' }}>
        <div className="sec-label reveal">Продукты</div>
        <div className="sec-title reveal d1">Коробочные решения<br />для горной отрасли</div>
        <p className="sec-sub reveal d2">Готовые к внедрению программные продукты, созданные на основе многолетнего опыта работы с горнодобывающими предприятиями.</p>

        {selectedProduct ? (
          <ExpandedSolutionView
            data={selectedProduct}
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
                onClick={() => {
                  setSelectedProduct(prod);
                  setIsReturning(false);
                  setTimeout(() => {
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 10);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="prod-tag">ПРОДУКТ</div>
                <div className="prod-title">{prod.text}</div>
                <div className="prod-desc">{prod.description}</div>
                <div style={{ marginTop: '15px', color: 'var(--teal)', fontSize: '0.8rem', fontWeight: 'bold' }}>Смотреть ПО &rarr;</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SectionWithBgImage>
  );
}

function AboutSection() {
  return (
    <SectionWithBgImage image={mineimg} id="about">
      <section className="about section" style={{ background: 'transparent' }}>
        <div className="sec-label reveal">О компании</div>
        <div className="about-grid">
          <div>
            <div className="sec-title reveal d1">ООО «ГИС Решения»</div>
            <div className="divider reveal d2"></div>
            <div className="about-body reveal d3">
              <p>Мы — команда инженеров и разработчиков, специализирующихся исключительно на горно-геологических информационных системах. Наша экспертиза сосредоточена на стыке горного дела, геологии и современных технологий разработки ПО.</p>
              <p>Компания сотрудничает с ведущими горнодобывающими предприятиями России и является <strong>партнёром кафедры «Маркшейдерское дело, геодезия и геоинформационные системы» Пермского Политеха</strong>. Это позволяет нам оставаться в авангарде отраслевых разработок.</p>
              <p>Наш флагманский проект — создание ГГИС и <strong>«цифрового двойника рудника»</strong> для ПАО «Уралкалий» — признан лучшим ИТ-проектом России и стран СНГ по версии профессионального сообщества GlobalCIO | DigitalExperts.</p>
            </div>
          </div>
          <div className="facts reveal d2">
            <div className="fact"><div className="fact-dot"></div><div className="fact-text"><strong>Победа в конкурсе GlobalCIO | DigitalExperts 2020</strong>Лучший ИТ-проект России и СНГ в номинации «Металлургия и непрерывное производство». 193 проекта-участника.</div></div>
            <div className="fact"><div className="fact-dot"></div><div className="fact-text"><strong>800+ пользователей в ПАО «Уралкалий»</strong>Горняки, геологи, маркшейдеры, геомеханики и эксперты АО «ВНИИ Галургии» работают с системой в онлайн-режиме.</div></div>
            <div className="fact"><div className="fact-dot"></div><div className="fact-text"><strong>Партнёрство с Пермским Политехом</strong>Совместные исследования и разработки с кафедрой маркшейдерского дела, геодезии и геоинформационных систем.</div></div>
            <div className="fact"><div className="fact-dot"></div><div className="fact-text"><strong>Фокус на одной нише</strong>Мы не разрабатываем общие ГИС-решения. Наша специализация — исключительно горнодобывающая отрасль.</div></div>
          </div>
        </div>
      </section>
    </SectionWithBgImage>
  );
}

const selectOptions = [
  "Комплексная ГГИС предприятия",
  "Расчёт плановых нормативов потерь",
  "Модуль «3D-Рудник»",
  "Интеграция с существующей ГИС",
  "Разработка под заказ"
];

function CustomSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "Выберите направление"}
      </button>
      <div className={`custom-select-options ${isOpen ? "open" : ""}`}>
        <div
          className={`custom-select-option ${value === "" ? "selected" : ""}`}
          onClick={() => { onChange({ target: { name: 'interest', value: '' } }); setIsOpen(false); }}
        >
          Выберите направление
        </div>
        {selectOptions.map(opt => (
          <div
            key={opt}
            className={`custom-select-option ${value === opt ? "selected" : ""}`}
            onClick={() => { onChange({ target: { name: 'interest', value: opt } }); setIsOpen(false); }}
          >
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsSection() {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', interest: '', message: '' });
  const [btnText, setBtnText] = useState('Отправить заявку →');
  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateMailto = () => {
    const subject = encodeURIComponent(`Заявка от ${formData.name || 'посетителя сайта'}${formData.company ? ` (${formData.company})` : ''}`);
    const body = encodeURIComponent(
      `Имя: ${formData.name}\nКомпания: ${formData.company}\nEmail: ${formData.email}\nИнтересующее решение: ${formData.interest}\n\nСообщение:\n${formData.message}`
    );
    return `mailto:gissolutions@ya.ru?subject=${subject}&body=${body}`;
  };

  const handleSubmit = () => {
    window.location.href = generateMailto();
    setBtnText('Заявка сформирована ✓');
    setIsSent(true);
  };

  return (
    <section className="contacts-sec section" id="contacts">
      <div className="sec-label reveal">Контакты</div>
      <div className="sec-title reveal d1">Начните проект с нами</div>
      <p className="sec-sub reveal d2">Расскажите о задаче — мы свяжемся и обсудим, какое решение подойдёт вашему предприятию.</p>
      <div className="contacts-grid">
        <div className="contact-form reveal d1">
          <div className="form-row">
            <div className="form-group">
              <label>Имя</label>
              <input type="text" name="name" placeholder="Иван Иванов" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Компания</label>
              <input type="text" name="company" placeholder="ПАО «Горняк»" value={formData.company} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="ivan@company.ru" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Интересующее решение</label>
            <CustomSelect value={formData.interest} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Сообщение</label>
            <textarea name="message" placeholder="Опишите вашу задачу или вопрос..." value={formData.message} onChange={handleInputChange}></textarea>
          </div>
          <button className="btn-primary" type="button" style={{ width: 'fit-content' }} onClick={handleSubmit} disabled={isSent}>
            {btnText}
          </button>

          <div className="partner-badge" style={{ marginTop: '2.5rem' }}>
            <div className="pb-label">Внимание</div>
            <div className="pb-text">
              Готовы обсудить цифровизацию вашего предприятия? Свяжитесь с нами прямо сейчас.
            </div>
          </div>
        </div>

        <div className="contact-info reveal d2">
          <div className="ci"><div className="ci-label">Директор</div><div className="ci-val">Антон Вадимович Оверин</div></div>
          <div className="ci"><div className="ci-label">Email</div><a href="mailto:gissolutions@ya.ru" className="ci-val">gissolutions@ya.ru</a></div>
          <div className="ci"><div className="ci-label">Телефон</div><a href="tel:+73422799654" className="ci-val">+7 (3422) 799-654</a></div>
          <div className="ci" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
            <div className="ci-label">Адрес</div>
            <div className="ci-val">Российская Федерация, г. Пермь<br />ул. Монастырская, д. 12, офис 104</div>
          </div>
          <div style={{ marginTop: '0.5rem', width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <MapSection />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-left">
        <a href="#" className="footer-logo">
          <img src={logo} alt="ГИС Решения" style={{ width: '32px', height: '32px' }} />
          <span className="footer-brand">ГИС РЕШЕНИЯ</span>
        </a>
        <div className="footer-copy">© 2025 ООО «ГИС Решения». Все права защищены.</div>
      </div>
      <div className="footer-links">
        <a href="#solutions">Решения</a>
        <a href="#products">Продукты</a>
        <a href="#about">О компании</a>
        <a href="#contacts">Контакты</a>
      </div>
    </footer>
  );
}

function App() {
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
  }, []);

  return (
    <div>
      <CustomCursor />
      <Header />
      <NavigationDots sections={sectionsDef} visibleSections={visibleSections} />
      <HeroSection />
      <AwardBanner />
      <SolutionsSection />
      <ProductsSection />
      <AboutSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}

export default App;