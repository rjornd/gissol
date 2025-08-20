import { useEffect, useRef, useState } from 'react'
import './mdggisStyle.css'
import log2 from './assets/ukk.jpg'
import log3 from './assets/eurohim.jpg'
import { useSpring, animated } from '@react-spring/web';

import { Card, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/cards.css';
import SectionWithParticles from "./ParticlesBg";
import mineimg from './assets/shahta.png?inline'
import mine2 from './assets/mine2.jpg?inline'
import mine3 from './assets/mine3.jpg?inline'
import logo from './assets/Logo.svg'
import MapSection from './MapSection';
import cardsData from './cardsData.js';

function AnimatedCard({ children, delay, isVisible }) {
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 100, friction: 20 },
    delay: isVisible ? delay : 0, // Apply delay only when appearing
  });

  return <animated.div style={animation}>{children}</animated.div>;
}

function CardGrids({ isVisible, toggleProductSection }) {
  return (
    <div className='section-content'>
      <Container>
        <div className="cards-row">
          {cardsData.map((card, idx) => (
            <AnimatedCard key={idx} delay={idx * 200} isVisible={isVisible}>
              <a onClick={() => toggleProductSection(card)} className="card-link">
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
    type: 'products',
    title: '',
    nav: "Продукты и решения",
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
    type: 'location',
    title: 'Наше местоположение',
    content: '', 
    bg: 'bc-gradient',
    nav: "Местоположение",
    mapSection: true, // специальный флаг для секции с картой
  },
  {
    type: 'contact',
    title: 'Контакты',
    content: 'Свяжитесь с нами для получения дополнительной информации',
    nav: "Контакты",
    bg: '',
  } 
]

const galleryImages = [
  log2,
  log3
]

const galleryCaptions = [
  'ПАО "Уралкалий"',
  'АО "Еврохим"'
]

function ImageGallery({ style }) {
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)

  const startInterval = () => {
    // Очищаем предыдущий интервал, если он существует
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    // Создаем новый интервал
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % galleryImages.length)
    }, 6500)
  }

  // Функция для ручного переключения с перезапуском интервала
  const handleManualChange = (newIndex) => {
    setIndex(newIndex)
    startInterval() // Перезапускаем интервал
  }

  useEffect(() => {
    startInterval() // Запускаем интервал при монтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="gallery-image-wrapper" style={style}>
      <img
        src={galleryImages[index]}
        alt={galleryCaptions[index] || 'Gallery'}
        className="gallery-image"
        loading="lazy"
        onClick={() => handleManualChange((index + 1) % galleryImages.length)}
        style={{ cursor: 'pointer' }}
      />
      <div className="gallery-caption" style={{ marginTop: 12, fontSize: '1.1rem', color: '#444', textAlign: 'center', minHeight: 24 }}>
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
    </div>
  )
}

function Header() {
  return (
    <header className="main-header-class">
      <nav className="main-nav-class">
        <a
          href='#aboutus'
          className="nav-link-class"
        >
          О нас
        </a>
        <a href="#contact" className="nav-link-class">Контакты</a>
      </nav>
    </header>
  )
}


function Contacts() {
  return (
    <div className="section-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fas fa-envelope" style={{ fontSize: '1.5rem', color: '#444' }}></i>
        <a href="mailto:gissolutions@ya.ru" style={{ color: '#444', textDecoration: 'none' }}>
          gissolutions@ya.ru
        </a>
      </p>
      <p>
        cот.: +7(3422)-799-654
      </p>
        <p>
        Директор ООО "ГИС-Решения": Антон Вадимович Оверин
      </p>
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
      
      <img src={logo} alt={"logo"} style={{marginRight: '20px'}}></img>
      <div className='section-content' style={{color:"#f5f9faff", justifyContent: 'center', alignItems: 'center', minHeight: '100%', marginBottom: '0px'}}>
      
      <span style={{display: 'block' }} >{'ООО "ГИС РЕШЕНИЯ"'}</span>
      <span style={{display: 'block', textAlign: 'left'}}>{''}</span>
      </div>
      
    </section>
  )
}

function ProductSection({ text, works, benefits, onBack }) {
  return (
    <div>
      <button
        onClick={onBack}>{"<-"}</button>
      <div className='section-content'>
        
       <div className="container py-5">
        <h3 className="section-title">{text}</h3>
      <div className="row">
        {/* Комплекс работ */}
        <div className="col-md-6">
          <h4 className="mb-4 fw-bold">КОМПЛЕКС РАБОТ</h4>
          {works.map((work, index) => (
            <div className="card mb-3 border-0 shadow-sm" style={{ backgroundColor: "#2C4876", color: "white" }} key={index}>
              <div className="card-body">
                <i className="bi bi-check-circle me-2"></i>
                {work}
              </div>
            </div>
          ))}
        </div>

        {/* Преимущества внедрения */}
        <div className="col-md-6">
          <h4 className="mb-4 fw-bold">ПРЕИМУЩЕСТВА ВНЕДРЕНИЯ</h4>
          {benefits.map((benefit, index) => (
            <div className="card mb-3 border-0 shadow-sm" style={{ backgroundColor: "#F28C28", color: "white" }} key={index}>
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
      </div>
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
      </div> 
      </SectionWithBgImage>
  );
}

function Products({ isProductSectionVisible, handleBack, productData, isVisible, toggleProductSection }) {
  return (
    <SectionWithBgImage image={mine2}>
    <div className='section-title'>Продукты и решения</div> 
    {
      isProductSectionVisible ? 
      <ProductSection
        text={productData.text}
        works={productData.works}
        benefits={productData.benefits}
        onBack={handleBack}
      /> : 
      <SectionWithParticles>
        <div className='section-content'>
          <p>Мы предлагаем широкий спектр продуктов и решений для горнодобывающей отрасли</p>
          <CardGrids isVisible={isVisible} toggleProductSection={toggleProductSection}/>
        </div>
      </SectionWithParticles> 
    }
    </SectionWithBgImage> 
  )
}

function NavigationDots({ sections, visibleSections }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleScrollToSection = (index) => {
    const sectionElement = document.getElementById(sections[index].type);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000, // Ensures dots are above background
      }}
    >
      {sections.map((section, index) => {
        const isActive = visibleSections[index];
        const spring = useSpring({
          scale: hoveredIndex === index || isActive ? 1.5 : 1,
          opacity: hoveredIndex === index || isActive ? 1 : 0.8,
          backgroundColor: isActive ? '#28f2b5ff' : '#4FA3C3',
          config: { tension: 220, friction: 15 },
        });

        const tooltipSpring = useSpring({
          opacity: hoveredIndex === index ? 1 : 0,
          config: { tension: 220, friction: 15 },
        });

        return (
          <div key={index} style={{ position: 'relative' }}>
            <animated.div
              style={{
                ...spring,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 1001, // Ensures individual dots are above other elements
              }}
              onClick={() => handleScrollToSection(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {hoveredIndex === index && (
              <animated.div
                style={{
                  ...tooltipSpring,
                  position: 'absolute',
                  right: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#1B3A5F',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  whiteSpace: 'nowrap',
                  zIndex: 1002, // Ensures tooltip is above everything
                }}
              >
                {section.nav}
              </animated.div>
            )}
          </div>
        )
      })}
    </div>
  );
}

function App() {
  const sectionRefs = useRef([])
  const [visibleSections, setVisibleSections] = useState([])
  const [isProductSectionVisible, setProductSectionVisible] = useState(false);
  const [productData, setProductData] = useState(null);

  const toggleProductSection = (data) => {
    setProductData(data);
    setProductSectionVisible(true);
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'instant' });
    }
  };

  const handleBack = () => {
    setProductData(null);
    setProductSectionVisible(false);
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
            
            {section.type === 'products' && <Products isProductSectionVisible={isProductSectionVisible} handleBack={handleBack} productData={productData} isVisible={isVisible} toggleProductSection={toggleProductSection}/>}

            {section.type === 'achivments' && (
            <SectionWithBgImage image={mine3}>
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

            {section.type === 'location' &&  <MapSection mapSection={section} />}
            
            {section.type === 'registration' && <Registration />}
            
            {section.type === 'contact' &&  <Contacts />}
          </animated.section>
        )
      })}
     
    </div>
  )
}

export default App;
