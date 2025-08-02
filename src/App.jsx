import { useEffect, useRef, useState } from 'react'
import './mdggisStyle.css'
import pnipulogo from './assets/pinpulogo.png'
import log1 from './assets/mdggis.jpg'
import log2 from './assets/ukk.jpg'
import log3 from './assets/eurohim.jpg'
import { useSpring, animated } from '@react-spring/web';
import SphereScene from './SphereScene'

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
          center: [58.008295, 56.240250],
          zoom: 17,
        });
      });
    }
  }, []);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '12px' }}></div>
  );
}

const sections = [
  {
    type: 'header',
    title: 'О компании',
    content: "Мы были одними из первых, кто начал создание и внедрение цифровых технологий в добывающих компаниях",
    //image: pnipulogo,
    bg: 'bc-gradient',
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
    <header className="main-header">
      <nav className="main-nav">
        <a
          href='#aboutus'
          className="nav-link"
        >
          О нас
        </a>
        <a href="#contact" className="nav-link">Контакты</a>
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
      > г. Пермь, Комсомольский проспект, 29, кафедра МДГиГИС Пермского Политеха</div>
    
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
      <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fab fa-telegram" style={{ fontSize: '1.5rem', color: '#0088cc' }}></i>
        <a href="https://t.me/gartchiza90" target="_blank" rel="noopener noreferrer" style={{ color: '#0088cc', textDecoration: 'none' }}>
          @gartchiza90
        </a>
      </p>
      <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fas fa-envelope" style={{ fontSize: '1.5rem', color: '#444' }}></i>
        <a href="mailto:gartanastasiya90@gmail.com" style={{ color: '#444', textDecoration: 'none' }}>
          gartanastasiya90@gmail.com
        </a>
      </p>
      <p>
        cот.: +7-919-492-44-58
      </p>
        <p>
        Гарт Анастасия Андреевна, менеджер по работе с клиентами
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
      
      <span style={{display: 'block' }} >{'ГЕОИНФОРМАЦИОННЫЕ'}</span>
      <span style={{display: 'block', textAlign: 'left'}}>{'РЕШЕНИЯ'}</span>
      </div>
      
    </section>
  )
}

function App() {
  const sectionRefs = useRef([])
  const [visibleSections, setVisibleSections] = useState([])

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
            
            {section.type === 'header' && (
              <div className="section-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div className="section-content"> Сегодня группа предоставляет комплекс услуг по созданию, внедрению и поддержке горно-геологических информационных систем для добывающих компаний</div>
                <div className="section-content"> Наши клиенты </div>
              <ImageGallery
              style={{ marginTop: 10 }}
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
