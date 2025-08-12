import { useEffect, useRef, useState } from 'react'
import './mdggisStyle.css'
import pnipulogo from './assets/pinpulogo.png'
import log1 from './assets/mdggis.jpg'
import log2 from './assets/ukk.jpg'
import log3 from './assets/eurohim.jpg'
import { useSpring, animated } from '@react-spring/web';
import SphereScene from './SphereScene'
import { Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function YandexMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Prevent duplicate script injection
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      document.body.appendChild(script);
      script.onload = initMap;
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initMap();
    }

    function initMap() {
      window.ymaps.ready(() => {
        // Remove previous map instance if exists
        if (mapRef.current && mapRef.current.innerHTML) {
          mapRef.current.innerHTML = '';
        }
        new window.ymaps.Map(mapRef.current, {
          center: [58.015566, 56.233252],
          zoom: 17,
        });
      });
    }
  }, []);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '12px' }}></div>
  );
}


//  <p> Наши клиенты </p>
//           <ImageGallery
//           style={{ marginTop: 10 }}
//           />

const sections = [
  {
    type: 'header',
    title: 'О компании',
    //image: pnipulogo,
    bg: 'bc-gradient',
  },
  {
    type: 'achivments',
    title: 'Наши достижения',
    content: (
      <div style={{ textAlign: 'justify' }}>
        Выполненный нашей командой проект "Создание и внедрение горно-геологической информационной системы (ГГИС) на рудниках ПАО "Уралкалий" (цифровой двойник рудника)" стал лучшим ИТ-проектом России и стран СНГ (категория — «Лучшее отраслевое решение, номинация — «Металлургия и непрерывное производство») по версии профессионального сообщества лидеров цифровой трансформации GlobalCIO|DigitalExperts. <br/><br/>
        Всего в конкурсе участвовало 193 ИТ-проекта. <a href="https://www.uralkali.com/ru/press_center/company_news/item42943/" target="_blank" rel="noopener noreferrer">Ссылка на сайт</a>. <br/><br/>
        Проект выполнялся по заказу компании ПАО "Уралкалий" и на начало июня 2020 года с различными модулями ГГИС в онлайн-режиме работают более 300 специалистов «Уралкалия» — горняки, геологи, маркшейдеры, геомеханики, а также эксперты АО «ВНИИ Галургии» и Горного института Уральского отделения РАН.
      </div>
    ),
    bg: ''
  },
  {
    type: 'location',
    title: 'Наше местоположение',
    content: '', 
    bg: 'bc-gradient',
    mapSection: true, // специальный флаг для секции с картой
  },
  {
    type: 'contact',
    title: 'Контакты',
    content: 'Свяжитесь с нами для получения дополнительной информации',
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

function MapSection(section) {
  return section.mapSection ? (
    (
      <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%',
      maxWidth: '900px'}}>
      <div 
       className="section-content" style={{ textAlign: 'center'}}
      > Российская Федерация, г. Пермь, ул. Монастырская, д. 12, офис 104</div>
    
  <div
    style={{
      position: 'relative',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 2,
      cursor: 'grab',
      background: 'transparent',
    }}
    tabIndex={0}
    aria-label="Для взаимодействия с картой кликните"
    onClick={e => {
      e.currentTarget.style.pointerEvents = 'none';
    }}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.currentTarget.style.pointerEvents = 'none';
      }
    }}
  />
  <YandexMap />
      </div>
  )) : null
  
}

function Contacts() {
  return (
    <div className="section-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fab fa-telegram" style={{ fontSize: '1.5rem', color: '#0088cc' }}></i>
        <a href="https://t.me/gartchiza90" target="_blank" rel="noopener noreferrer" style={{ color: '#0088cc', textDecoration: 'none' }}>
          @gartchiza90
        </a>
      </p> */}
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
          background: 'linear-gradient(to bottom, #113f83ff, #7a0dacff)', /* Adjusted gradient to match palette */
          padding: '20px'
        }}
      >
      
      <SphereScene />
      <div className='section-content' style={{color:"#f5f9faff", justifyContent: 'center', alignItems: 'center', minHeight: '100%', marginBottom: '0px'}}>
      
      <span style={{display: 'block' }} >{'ООО "ГИС РЕШЕНИЯ"'}</span>
      <span style={{display: 'block', textAlign: 'left'}}>{''}</span>
      </div>
      
    </section>
  )
}

function ProductSection({ isVisible, onClose }) {
  
  return (
    <div
      className={`section ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div >
        <button
        onClick={onClose}
        style={{
          marginBottom: '20px',
          fontSize: '1.5rem',
          padding: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Назад"
      >
        ←
      </button>
      <h3 className='section-title'>Продукты и решения</h3>
      <Row>
        <Col md={4}>
          <Card style={{ marginBottom: '10px' }}>
            <Card.Img variant="top" src="/src/assets/abcd.jpg" alt="Продукт 1" />
            <Card.Body>
              <Card.Title>Продукт 1</Card.Title>
              <Card.Text>Описание продукта 1</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ marginBottom: '10px' }}>
            <Card.Img variant="top" src="/src/assets/abce.jpg" alt="Продукт 2" />
            <Card.Body>
              <Card.Title>Продукт 2</Card.Title>
              <Card.Text>Описание продукта 2</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ marginBottom: '10px' }}>
            <Card.Img variant="top" src="/src/assets/mdggis.jpg" alt="Продукт 3" />
            <Card.Body>
              <Card.Title>Продукт 3</Card.Title>
              <Card.Text>Описание продукта 3</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  );
}

function App() {
  const sectionRefs = useRef([])
  const [visibleSections, setVisibleSections] = useState([])
  const [isProductSectionVisible, setProductSectionVisible] = useState(false);
 const toggleProductSection = () => {
    setProductSectionVisible(!isProductSectionVisible);
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

  useEffect(() => {
    if (!visibleSections[0] && isProductSectionVisible) {
      setProductSectionVisible(false);
    }
  }, [visibleSections, isProductSectionVisible]);

  return (
    <div>
      <Header />
      <CompanyLogoSection />
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
            
            {section.type === 'header' && 
            (<div className="section-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p>ООО "ГИС-Решения" - это команда профессионалов, которая занимается разработкой и внедрением горно-геологических информационных систем (ГГИС) для предприятий горнодобывающей отрасли.</p>
              <p>Мы создаем программные продукты, которые позволяют оптимизировать процессы добычи, повысить безопасность и эффективность работы.</p>
              <button className='main-action-btn' onClick={toggleProductSection}>Продукты и решения</button>
              <ProductSection
              isVisible={isProductSectionVisible}
              onClose={() => setProductSectionVisible(false)}
            />
            </div>
           
            )}
            
            {section.type === 'participants' && (
              <div>
                <div className="section-content"> Участники </div>
              <ImageGallery
              style={{ marginTop: 10 }}
              />
              </div>
            )}

            {section.type === 'location' && (MapSection(section))}
            
            {section.type === 'registration' && <Registration />}
            
            {section.type === 'contact' &&  <Contacts />}
          </animated.section>
        )
      })}
      
    </div>
  )
}

export default App
