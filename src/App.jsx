import { useEffect, useRef, useState } from 'react'
import './mdggisStyle.css'
import { useSpring, animated } from '@react-spring/web';

import { Card, Row, Col, Container, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/cards.css';
import SectionWithParticles from "./ParticlesBg";
import mineimg from './assets/shahta.png?inline'
import mine2 from './assets/mine2.jpg?inline'
import mine3 from './assets/mine3.jpg?inline'
import mine4 from './assets/mine4.jpg?inline'
import logo from './assets/Logo.png'
import MapSection from './MapSection';
import {cardsData, productsCardsData} from './cardsData.js';

import NavigationDots from './NavigationDots.jsx';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import meun from './assets/menu.svg'

function AnimatedCard({ children, delay, isVisible }) {
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 100, friction: 20 },
    delay: isVisible ? delay : 0, // Apply delay only when appearing
  });

  return <animated.div style={animation}>{children}</animated.div>;
}

function CardGrids({ isVisible, toggleSection, cardsData }) {
  return (
    <div className='section-content'>
      <Container>
        <div className="cards-grid">
          {cardsData.map((card, idx) => (
            <AnimatedCard key={idx} delay={idx * 200} isVisible={isVisible}>
              <a onClick={() => toggleSection(card)} className="card-link">
                <Card className="custom-card">
                  <div>{card.text}</div>
                </Card>
              </a>
            </AnimatedCard>
          ))}
        </div>
      </Container>
    </div>
  );
}
  
function SectionWithBgImage({ children, image }) {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Фон с маской через ::before */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, rgba(27, 58, 95, 1) 0%, rgba(18, 42, 64, 0.8) 50%,rgba(27, 58, 95, 1) 100%), url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            maskRepeat: "no-repeat",
            maskSize: "100% 100%",
        }}
      />

      {/* Контент поверх */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}


//  <p> Наши клиенты </p>
//           <ImageGallery
//           style={{ marginTop: 10 }}
//           />

const sections = [
  {
    type: 'header',
    title: '',
    nav: "О компании",
    //image: pnipulogo,
    bg: '',
  },
  {
    type: 'solutions',
    title: '',
    nav: "Комплексные решения",
    //image: pnipulogo,
    bg: 'bc-gradient',
  },
  {
    type: 'products',
    title: '',
    nav: "Продукты",
    //image: pnipulogo,
    bg: 'bc-gradient',
  },
  {
    type: 'achivments',
    title: '',
    content: "",
    nav: "Достижения",
    bg: ''
  },
  {
    type: 'contact',
    title: 'Контакты',
    content: '',
    nav: "Контакты",
    bg: '',
  } 
]


function ImageGallery({ style, galleryImages, galleryCaptions }) {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef(null);

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % galleryImages.length);
    }, 6500);
  };

  const handleManualChange = (newIndex) => {
    setIndex(newIndex);
    startInterval();
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="gallery-image-wrapper" style={{ marginBottom: '0px' }}>
      <img
        src={galleryImages[index]}
        alt={galleryCaptions[index] || 'Gallery'}
        className="gallery-image"
        loading="lazy"
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
      />
      <div className="section-content" style={{ textAlign: 'center', marginBottom: '0' }}>
        {galleryCaptions[index]}
      </div>
      <div className="gallery-controls">
        {galleryImages.map((_, i) => (
          <button
            key={i}
            className={`gallery-dot${i === index ? ' active' : ''}`}
            onClick={() => handleManualChange(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      <Modal
  show={showModal}
  onHide={handleCloseModal}
  centered
  fullscreen
  style={{background: 'transparent'}}
>
  <Modal.Body style={{background: 'transparent', color: 'transparent'}} className="d-flex flex-column align-items-center" >
    <TransformWrapper>
      <TransformComponent>
        <img
          src={galleryImages[index]}
          alt={galleryCaptions[index] || 'Gallery'}
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </TransformComponent>
    </TransformWrapper>
    <button
      onClick={handleCloseModal}
      style={{
        marginTop: '20px',
        backgroundColor: '#2C4876',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '1rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#1B3A5F')}
      onMouseOut={(e) => (e.target.style.backgroundColor = '#2C4876')}
    >
      Закрыть
    </button>
  </Modal.Body>
</Modal>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuSpring = useSpring({
    transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
    opacity: menuOpen ? 1 : 0,
    config: { tension: 200, friction: 20 },
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
   <>
    {menuOpen && (
        <animated.div
          style={{
            ...menuSpring,
            position: 'fixed',
            top: '45px',
            right: 0,
            width: '200px',
            height: 'auto',
            backgroundColor: '#1B3A5F',
            color: '#fff',
            padding: '10px 0',
            zIndex: 1002,
          }}
        >
          {sections.map((section, idx) => (
            <a
              key={idx}
              href={`#${section.type}`}
              className="nav-link-class"
              style={{
                
                display: 'block',
                padding: '10px 20px',
                textDecoration: 'none',
                borderBottom: 'none',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {section.nav}
            </a>
          ))}
        </animated.div>
      )}
    <header className="main-header-class">
      <nav className="main-nav-class">
        <a href="#header" className="nav-link-class">
          О нас
        </a>
        <a href="#contact" className="nav-link-class">
          Контакты
        </a>
        <button
          className="nav-link-class"
          style={{ border: 'none', padding: 0, cursor: 'pointer' }}
          onClick={toggleMenu}
        >
          <img className="menu-icon" src={meun} alt="Menu" />
        </button>
      </nav>
       
    </header>
    </>
  )
}


function Contacts() {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+7(3422)-799-654');
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000); // Hide the message after 2 seconds
  };

  return (
    <div className="section-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative' }}>
      <p>
        Директор ООО "ГИС-Решения": Антон Вадимович Оверин
      </p>
      <p>
        Свяжитесь с нами для получения дополнительной информации
      </p>
      <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fas fa-envelope" style={{ fontSize: '1.5rem', color: '#28f2b5ff' }}></i>
        <a href="mailto:gissolutions@ya.ru" style={{ color: '#34be95ff', textDecoration: 'none' }}>
          gissolutions@ya.ru
        </a>
      </p>
      <div style={{ position: 'relative' }}>
        <p 
          style={{ fontSize: '1.5rem', color: '#5bbee6ff', cursor: 'pointer' }}
          onClick={handleCopyPhone}
          title="Кликните, чтобы скопировать номер телефона"
        >
          тел.: +7(3422)-799-654
        </p>
        {showCopied && (
          <animated.div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#1B3A5F',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
              whiteSpace: 'nowrap',
              zIndex: 1002,
              pointerEvents: 'none', // Prevent interaction with the tooltip
            }}
          >
            Телефон скопирован!
          </animated.div>
        )}
      </div>
      <MapSection/>
    </div>
  )
}

function Registration () {
return (
  <div className="section-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>              
    <button className="main-action-btn" onClick={() => window.open('https://t.me/gartchiza90', '_blank', 'noopener,noreferrer')}>Зарегистрироваться</button>
    <div
      className="section-content"
      style={{
        fontSize: '0.95rem',
        color: '#888',
        marginTop: 20,
      }}
    >
      * Организационный взнос за участие не предусмотрен
    </div>
    
      <button className="small-action-btn"
      onClick={e => {
        window.open(doc, '_blank', 'noopener,noreferrer')
        e.preventDefault()
    }}
      >Получить программу</button>
  </div>
)}

function CompanyLogoSection(){
  return (
    <section
        key={0}
        className='logo-section'
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'left', 
          justifyContent: 'center', 
          //background: 'linear-gradient(to bottom, #113f83ff, #7a0dacff)', /* Adjusted gradient to match palette */
          padding: '20px'
        }}
      >
      
      <img src={logo} alt={"logo"} style={{
        width: '60px',
        height: '60px',
        marginRight: '20px'}}></img>
      <div className='section-content' style={{color:"#f5f9faff", justifyContent: 'center', alignItems: 'center', minHeight: '100%', marginBottom: '0px'}}>
      
      <span style={{display: 'block' }} >{'ООО "ГИС РЕШЕНИЯ"'}</span>
      <span style={{display: 'block', textAlign: 'left'}}>{''}</span>
      </div>
      
    </section>
  )
}

function SolutionSection({ text, works, benefits, onBack, animation, images, captions }) {
  return (
    <animated.div style={animation}>
      <button
        onClick={onBack}
        style={{
          backgroundColor: '#2C4876',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '1rem',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1B3A5F'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2C4876'}
      >
        {'< Назад'}
      </button>
      <div className='section-content'>
       <div className="container py-5">
        <h3 className="section-title">{text}</h3>
        {images ? <ImageGallery
      style={{marginTop: '0px'}}
        galleryImages={images}
        galleryCaptions={{}}
      /> : <></>}
      <div className="row">
        {/* Комплекс работ */}
        <div className="col-md-6">
          <h4 className="mb-4 fw-bold">КОМПЛЕКС РАБОТ</h4>
          {works.map((work, index) => (
            <div className="card mb-3 border-0 shadow-sm" style={{ backgroundColor: "#2c4876bd", color: "white" }} key={index}>
              <div className="card-body">
                <i className="bi bi-check-circle me-2"></i>
                {work}
              </div>
            </div>
          ))}
        </div>

        {/* Преимущества внедрения */}
        <div className="col-md-6">
          <h4 className="mb-4 fw-bold" style={{textWrap: 'nowrap'}}>ПРЕИМУЩЕСТВА ВНЕДРЕНИЯ</h4>
          {benefits.map((benefit, index) => (
            <div className="card mb-3 border-0 shadow-sm" style={{ backgroundColor: "#2c5276bd", color: "white" }} key={index}>
              <div className="card-body">
                <i className="bi bi-check-circle me-2"></i>
                {benefit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      </div>
    </animated.div>
  );
}



function AboutUsSection() {
  return (
    <SectionWithBgImage image={mineimg}> <div className="section-title">О Компании</div>
      <div
        className="section-content"
      >
        <p>
          ООО "ГИС-Решения" - это команда профессионалов, которая занимается
          разработкой и внедрением горно-геологических информационных систем
          (ГГИС) для предприятий горнодобывающей отрасли.
        </p>
        <p>
          Мы создаем программные продукты, которые позволяют оптимизировать
          процессы добычи, повысить безопасность и эффективность работы.
        </p>
        <p>
          Мы являемся партнером кафедры Маркшейдерское дело, геодезия и геоинформационные системы Пермского Политеха.
        </p>
      </div> 
      </SectionWithBgImage>
  );
}

function Solutions({ isSolSectionVisible, handleBack, solutionData, isVisible, toggleSolSection }) {
  const solutionAnimation = useSpring({
    opacity: isSolSectionVisible ? 1 : 0,
    transform: isSolSectionVisible ? 'translateX(0px)' : 'translateX(50px)',
    config: { tension: 200, friction: 30 }
  });
  return (
    <SectionWithBgImage image={mine3}>
    <div className='section-title'>Комплексные решения</div> 
    {
      isSolSectionVisible ? 
      <SolutionSection
        text={solutionData.text}
        works={solutionData.works}
        benefits={solutionData.benefits}
        onBack={handleBack}
        isVisible={isSolSectionVisible}
        animation={solutionAnimation}
      /> : 
      <SectionWithParticles height={parent.height}>
        <div className='section-content'>
          <p>Мы предлагаем широкий спектр комплексных решений для горнодобывающей отрасли</p>
          <CardGrids cardsData={cardsData} isVisible={isVisible} toggleSection={toggleSolSection}/>
        </div>
      </SectionWithParticles> 
    }
    </SectionWithBgImage> 
  )
}

function Products({ isProductSectionVisible, handleBack, productData, isVisible, toggleProdSection }) {
   const solutionAnimation = useSpring({
    opacity: isProductSectionVisible ? 1 : 0,
    transform: isProductSectionVisible ? 'translateX(0px)' : 'translateX(50px)',
    config: { tension: 200, friction: 30 }
  });
  return (
    <SectionWithBgImage image={mine4}>
    <div  className='section-title'>Продукты</div> 
    {
      isProductSectionVisible ? 
     
      <SolutionSection
        text={productData.text}
        works={productData.works}
        benefits={productData.benefits}
        onBack={handleBack}
        isVisible={isProductSectionVisible}
        animation={solutionAnimation}
        images={productData.images}
        captions={productData.captions}
      /> : 
      <SectionWithParticles>
        <div className='section-content' >
          <p>Мы предлагаем коробочные продукты для горнодобывающей отрасли</p>
          <CardGrids cardsData={productsCardsData} isVisible={isVisible} toggleSection={toggleProdSection}/>
        </div>
      </SectionWithParticles> 
    }
    </SectionWithBgImage> 
  )
}



function App() {
  const sectionRefs = useRef([])
  const [visibleSections, setVisibleSections] = useState([])
  const [isSolSectionVisible, setSolSectionVisible] = useState(false);
  const [solutionData, setSolutionData] = useState(null);
  const [productData, setProductData] = useState(null);

  const [isProductSectionVisible, setProductSectionVisible] = useState(false);
  const toggleProdSection = (data) => {
    setProductData(data);
    setProductSectionVisible(true);
    const prodSection = document.getElementById('products');
    if (prodSection) {
      prodSection.scrollIntoView({ behavior: 'instant' });
    }
  };
  const toggleSolSection = (data) => {
    setSolutionData(data);
    setSolSectionVisible(true);
    const solSection = document.getElementById('solutions');
    if (solSection) {
      solSection.scrollIntoView({ behavior: 'instant' });
    }
  };
  const handleProdBack = () => {
    setProductData(null);
    setProductSectionVisible(false);
  };
  const handleBack = () => {
    setSolutionData(null);
    setSolSectionVisible(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setVisibleSections(
        sectionRefs.current.map(ref => {
          if (!ref) return false
          const rect = ref.getBoundingClientRect()
          return rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.2
        })
      )
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <Header />
      <CompanyLogoSection />
      <NavigationDots sections={sections} visibleSections={visibleSections} />
      {sections.map((section, idx) => {
        const isVisible = visibleSections[idx]
        const spring = useSpring({
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
          scale: isVisible ? 1 : 0.98,
          config: { tension: 220, friction: 15 },
          delay: 100,
          background: section.bg ? section.bg : 'transparent',
        })
        return (
          <animated.section
            key={idx+1}
            ref={el => sectionRefs.current[idx] = el}
            style={spring}
            className={`section ${section.bg} `}
            id={section.type}
          >
            {section.image ? <img
              src={section.image}
              alt={section.title}
              className="section-image"
              loading="lazy"
            /> : null}
            <div className="section-title">{section.title}</div>
            <div className="section-content">{section.content}</div>
            
            {section.type === 'header' && <AboutUsSection/>}
            
            {section.type === 'solutions' && <Solutions isSolSectionVisible={isSolSectionVisible} handleBack={handleBack} solutionData={solutionData} isVisible={isVisible} toggleSolSection={toggleSolSection}/>}
            {section.type === 'products' && <Products isProductSectionVisible={isProductSectionVisible} handleBack={handleProdBack} productData={productData} isVisible={isVisible} toggleProdSection={toggleProdSection}/>}
            {section.type === 'achivments' && (
            <SectionWithBgImage image={mine2}>
              <div className="section-title">Наши достижения</div>
              <div className="section-content" style={{ textAlign: 'justify' }}>
                Выполненный нашей командой проект "Создание и внедрение горно-геологической информационной системы (ГГИС) на рудниках ПАО "Уралкалий" (цифровой двойник рудника)" стал лучшим ИТ-проектом России и стран СНГ (категория — «Лучшее отраслевое решение, номинация — «Металлургия и непрерывное производство») по версии профессионального сообщества лидеров цифровой трансформации GlobalCIO|DigitalExperts. <br/><br/>
                Всего в конкурсе участвовало 193 ИТ-проекта. <a href="https://www.uralkali.com/ru/press_center/company_news/item42943/" target="_blank" rel="noopener noreferrer">Ссылка на сайт</a>. <br/><br/>
                Проект выполнялся по заказу компании ПАО "Уралкалий" и на начало июня 2020 года с различными модулями ГГИС в онлайн-режиме работают более 300 специалистов «Уралкалия» — горняки, геологи, маркшейдеры, геомеханики, а также эксперты АО «ВНИИ Галургии» и Горного института Уральского отделения РАН.
              </div>
            </SectionWithBgImage>
            )
            }

            {section.type === 'participants' && (
              <div>
                <div className="section-content"> Участники </div>
              <ImageGallery
              style={{ marginTop: 10 }}
              />
              </div>
            )}

            {section.type === 'registration' && <Registration />}
            
            {section.type === 'contact' &&  <Contacts />}
          </animated.section>
        )
      })}
    </div>
  )
}

export default App;
