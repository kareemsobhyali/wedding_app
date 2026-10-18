const fs = require('fs');
let code = fs.readFileSync('apps/web/src/templates/designs/golden-arabic/index.tsx', 'utf8');

const startIdx = code.indexOf('return (');
const cssPart = code.substring(0, startIdx);

const newJSX = `return (
    <div className={\`min-h-screen relative font-arabic bg-warm-white text-text-dark overflow-x-hidden selection:bg-gold-primary selection:text-white \${!isOpen ? 'h-screen overflow-hidden' : ''}\`} dir="rtl">
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;600;700&family=Noto+Naskh+Arabic:wght@400;700&family=Playfair+Display:wght@400;600&family=Great+Vibes&display=swap');
        
        :root {
            --gold-primary: #c9a96e;
            --gold-bright: #d4af37;
            --gold-dark: #b8860b;
            --rose-gold: #b76e79;
            --sage-green: #7ea38b;
            --ivory: #fffff0;
            --warm-white: #fdfbf7;
            --cream: #f5eedc;
            --pearl-white: #eae0c8;
            --text-dark: #333;
            --font-arabic: 'Amiri', serif;
            --font-cairo: 'Cairo', sans-serif;
            --font-naskh: 'Noto Naskh Arabic', serif;
            --font-english: 'Playfair Display', serif;
            --font-vibes: 'Great Vibes', cursive;
        }

        .font-arabic { font-family: var(--font-arabic); }
        .font-cairo { font-family: var(--font-cairo); }
        .font-naskh { font-family: var(--font-naskh); }
        .font-english { font-family: var(--font-english); }
        .font-vibes { font-family: var(--font-vibes); }
        .bg-warm-white { background: linear-gradient(135deg, var(--warm-white), var(--cream), var(--pearl-white)); background-size: 400% 400%; animation: gradientBG 15s ease infinite; }
        .text-text-dark { color: var(--text-dark); }
        .text-gold-dark { color: var(--gold-dark); }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .floating-hearts-container {
            position: fixed;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 10;
        }

        .floating-heart {
            position: absolute;
            bottom: -50px;
            color: var(--rose-gold);
            font-size: 1.5rem;
            opacity: 0;
            animation: floatUp 8s linear infinite;
        }

        @keyframes floatUp {
            0% { transform: translateY(0) scale(0.8) rotate(0deg); opacity: 0; }
            10% { opacity: 0.6; }
            50% { transform: translateY(-50vh) scale(1.2) rotate(20deg); opacity: 0.4; }
            90% { opacity: 0.6; }
            100% { transform: translateY(-100vh) scale(0.8) rotate(-20deg); opacity: 0; }
        }

        .paper-texture::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E');
            pointer-events: none;
            z-index: 0;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(201, 169, 110, 0.4);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(201, 169, 110, 0.15);
            border-color: var(--gold-bright);
        }

        .shimmer-text {
            background: linear-gradient(-45deg, var(--gold-primary) 20%, #fff 40%, var(--gold-bright) 60%, var(--gold-primary) 80%);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: shimmer 3s linear infinite;
            display: inline-block;
        }

        @keyframes shimmer {
            to { background-position: 200% center; }
        }

        .btn-gold {
            background: linear-gradient(135deg, var(--gold-primary), var(--gold-bright));
            color: #fff;
            border: none;
            padding: 12px 30px;
            border-radius: 30px;
            font-family: var(--font-cairo);
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(201, 169, 110, 0.4);
            text-decoration: none;
            display: inline-block;
            position: relative;
            overflow: hidden;
        }
        
        .btn-gold::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: rgba(255,255,255,0.2);
            transform: rotate(45deg);
            transition: all 0.3s ease;
            opacity: 0;
        }
        .btn-gold:hover::after {
            opacity: 1;
            transform: rotate(45deg) translate(50%, 50%);
        }
        .btn-gold:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(201, 169, 110, 0.6);
            color: #fff;
        }

        .intro-screen {
            position: fixed;
            inset: 0;
            background: radial-gradient(ellipse at center, #1a1510 0%, #0a0805 50%, #000 100%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            transition: opacity 1.5s ease, visibility 1.5s ease;
        }

        .intro-screen::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image:
                radial-gradient(2px 2px at 20% 30%, rgba(201,169,110,0.4), transparent),
                radial-gradient(2px 2px at 40% 70%, rgba(212,175,55,0.3), transparent),
                radial-gradient(1px 1px at 60% 20%, rgba(201,169,110,0.5), transparent),
                radial-gradient(2px 2px at 80% 50%, rgba(212,175,55,0.3), transparent),
                radial-gradient(1px 1px at 10% 80%, rgba(201,169,110,0.4), transparent),
                radial-gradient(2px 2px at 70% 90%, rgba(212,175,55,0.2), transparent),
                radial-gradient(1px 1px at 90% 10%, rgba(201,169,110,0.5), transparent),
                radial-gradient(2px 2px at 30% 50%, rgba(212,175,55,0.2), transparent),
                radial-gradient(1px 1px at 50% 60%, rgba(201,169,110,0.3), transparent);
            animation: sparkleFloat 8s ease-in-out infinite alternate;
            pointer-events: none;
        }

        @keyframes sparkleFloat {
            0% { transform: translateY(0); opacity: 0.6; }
            100% { transform: translateY(-15px); opacity: 1; }
        }

        .svg-line-container {
            position: absolute;
            top: 15%;
            width: 80%;
            max-width: 300px;
        }
        
        .svg-line {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawLine 2s ease forwards;
        }
        
        @keyframes drawLine {
            to { stroke-dashoffset: 0; }
        }

        .rings-container {
            position: relative;
            width: 80px; height: 80px;
            margin-bottom: 30px;
            opacity: 0;
            animation: fadeIn 1s 0.2s forwards;
        }

        .ring {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 2px solid var(--gold-primary);
        }
        .ring1 {
            width: 60px; height: 60px;
            left: 45%;
        }
        .ring2 {
            width: 50px; height: 50px;
            left: 55%; top: 45%;
            border-color: var(--gold-bright);
        }

        .envelope-wrapper {
            position: relative;
            width: 360px;
            height: 250px;
            max-width: 90vw;
            opacity: 0;
            transform: translateY(50px);
            animation: slideUpFade 1s 0.5s forwards;
            perspective: 1000px;
        }
        
        @keyframes slideUpFade {
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn { to { opacity: 1; } }

        .vintage-envelope {
            width: 100%; height: 100%;
            background: #e6cfa3;
            position: absolute;
            top: 0; left: 0;
            border-radius: 4px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(101, 53, 15, 0.4), inset 0 0 15px rgba(101, 53, 15, 0.3);
            border: 1px solid rgba(101, 53, 15, 0.4);
            z-index: 4;
            transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .washi-tape {
            position: absolute;
            top: -10px; left: 50%;
            transform: translateX(-50%) rotate(-2deg);
            width: 120px; height: 30px;
            background: rgba(255,255,255,0.4);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            z-index: 5;
        }
        
        .postmark {
            position: absolute;
            top: 15px; right: 15px;
            width: 55px; height: 55px;
            border: 2px solid rgba(30, 30, 30, 0.7);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: rgba(30, 30, 30, 0.7);
            transform: rotate(-15deg);
        }
        .postmark i { font-size: 1.4rem; margin-top: -2px; }
        .postmark span { font-size: 0.45rem; font-weight: bold; letter-spacing: 1px; margin-top: 2px; font-family: sans-serif; }
        
        .vintage-sticker {
            position: absolute;
            filter: sepia(0.8) opacity(0.7) contrast(1.3) grayscale(0.2);
            font-size: 2.5rem;
        }
        .sticker-1 { top: 10px; right: 20px; transform: rotate(15deg); font-size: 3rem; }
        .sticker-2 { bottom: 10px; left: 10px; transform: rotate(-10deg); font-size: 3.5rem; }
        .sticker-3 { bottom: 20px; right: 20px; transform: rotate(-25deg); }
        
        .vintage-quote {
            font-family: var(--font-arabic);
            font-size: 1.4rem;
            font-weight: 700;
            color: #3b2c1f;
            text-align: center;
            z-index: 10;
            line-height: 1.6;
            margin-top: 10px;
            text-shadow: 0 1px 1px rgba(255,255,255,0.2);
        }

        .envelope-card {
            position: absolute;
            top: 5%; left: 5%; width: 90%; height: 90%;
            background: #fff;
            border: 2px solid var(--gold-primary);
            border-radius: 5px;
            z-index: 2;
            transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s, opacity 1s 0.5s;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            text-align: center;
            opacity: 0;
            transform: scale(0.9);
        }
        
        .envelope-wrapper.open .vintage-envelope {
            transform: translateY(150px) rotateX(20deg);
            opacity: 0;
            pointer-events: none;
        }
        .envelope-wrapper.open .envelope-card {
            transform: scale(1);
            opacity: 1;
        }

        .open-btn {
            margin-top: 40px;
            opacity: 0;
            animation: fadeIn 1s 1s forwards;
            font-size: 1.2rem;
            padding: 15px 45px;
        }

        .bismillah {
            font-family: var(--font-naskh);
            font-size: 2rem;
            margin-bottom: 20px;
            color: var(--gold-dark);
        }

        .quran-verse {
            font-family: var(--font-arabic);
            font-size: 1.5rem;
            line-height: 1.8;
            color: var(--text-dark);
            margin: 20px 0;
            padding: 0 20px;
        }

        .divider {
            margin: 30px auto;
            width: 80%;
            max-width: 400px;
        }

        .hero-names {
            font-family: var(--font-arabic);
            font-size: 4rem;
            font-weight: 700;
            margin: 40px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        @media (min-width: 768px) {
            .hero-names { flex-direction: row; font-size: 5rem; gap: 30px; }
        }

        .heart-icon {
            color: var(--rose-gold);
            font-size: 2rem;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); text-shadow: 0 0 15px rgba(183, 110, 121, 0.6); }
            100% { transform: scale(1); }
        }

        .timeline {
            position: relative;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px 0;
        }
        .timeline::before {
            content: '';
            position: absolute;
            top: 0; left: 50%;
            transform: translateX(-50%);
            width: 2px; height: 100%;
            background: linear-gradient(to bottom, transparent, var(--gold-primary), transparent);
        }
        .timeline-item {
            margin-bottom: 50px;
            position: relative;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .timeline-item:nth-child(even) {
            justify-content: flex-end;
        }
        .timeline-content {
            width: 45%;
            padding: 20px;
            text-align: right;
        }
        .timeline-item:nth-child(even) .timeline-content {
            text-align: right;
        }
        .timeline-icon {
            position: absolute;
            left: 50%; top: 50%;
            transform: translate(-50%, -50%);
            width: 50px; height: 50px;
            background: var(--cream);
            border: 2px solid var(--gold-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--gold-dark);
            z-index: 2;
        }

        .countdown-container {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin: 40px 0;
            direction: ltr;
        }
        .countdown-box {
            width: 80px; height: 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px;
        }
        @media (min-width: 768px) {
            .countdown-box { width: 120px; height: 140px; gap: 10px; }
        }
        .countdown-number {
            font-family: var(--font-english);
            font-size: 2rem;
            font-weight: 600;
            color: var(--gold-dark);
            text-shadow: 0 2px 10px rgba(201, 169, 110, 0.4);
        }
        @media (min-width: 768px) {
            .countdown-number { font-size: 3.5rem; }
        }
        .countdown-label {
            font-family: var(--font-cairo);
            font-size: 0.9rem;
            color: var(--text-dark);
            margin-top: 5px;
        }

        .botanical-corner {
            position: fixed;
            width: 250px;
            pointer-events: none;
            z-index: 5;
            opacity: 0.7;
            background-image: url('https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png');
            background-size: cover;
            height: 250px;
        }
        .corner-tl { top: -50px; left: -50px; transform: rotate(0deg); }
        .corner-tr { top: -50px; right: -50px; transform: rotate(90deg) scaleY(-1); }
      \`}} />

      {/* Hidden Audio */}
      {data.music && <audio ref={audioRef} src={data.music.url} loop />}

      <div className="paper-texture"></div>
      <div className="botanical-corner corner-tl"></div>
      <div className="botanical-corner corner-tr"></div>

      {/* Floating Hearts */}
      <div className="floating-hearts-container fixed">
        {[
          { left: '10%', delay: '0s', size: '1.2rem' },
          { left: '25%', delay: '3s', size: '1.8rem' },
          { left: '40%', delay: '1s', size: '1.4rem' },
          { left: '55%', delay: '4s', size: '2rem' },
          { left: '70%', delay: '2s', size: '1.5rem' },
          { left: '85%', delay: '5s', size: '1.1rem' },
          { left: '15%', delay: '6s', size: '1.7rem' },
          { left: '35%', delay: '2.5s', size: '1.3rem' },
          { left: '60%', delay: '7s', size: '1.9rem' },
          { left: '80%', delay: '1.5s', size: '1.6rem' },
          { left: '95%', delay: '4.5s', size: '1.4rem' },
          { left: '50%', delay: '0.5s', size: '1.2rem' }
        ].map((heart, i) => (
          <div 
            key={i} 
            className="floating-heart" 
            style={{ 
              left: heart.left, 
              animationDelay: heart.delay,
              fontSize: heart.size
            }}
          >
            🤍
          </div>
        ))}
      </div>

      {/* Intro Screen */}
      <div 
        className="intro-screen"
        style={{ 
          opacity: isOpen ? 0 : 1, 
          pointerEvents: isOpen ? 'none' : 'auto',
          visibility: isOpen ? 'hidden' : 'visible',
          transition: 'opacity 1.5s ease, visibility 1.5s ease'
        }}
      >
        <svg className="svg-line-container" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path className="svg-line" d="M0,10 Q50,0 100,10" fill="none" stroke="#c9a96e" strokeWidth="0.5" />
        </svg>

        <div className="rings-container">
          <div className="ring ring1"></div>
          <div className="ring ring2"></div>
        </div>

        <div className={\`envelope-wrapper \${isOpen ? 'open' : ''}\`}>
          <div className="envelope-card">
            <h2 className="font-arabic text-gold-dark mb-2 text-2xl">{data.caption || 'دعوة زفاف'}</h2>
            <h3 className="font-vibes text-text-dark text-3xl">
              {data.groomName} &amp; {data.brideName}
            </h3>
          </div>
          
          <div className="vintage-envelope">
            <div className="washi-tape"></div>
            <div className="postmark">
              <span className="text-xl">🕊️</span>
              <span>AIR MAIL</span>
            </div>
            <div className="vintage-sticker sticker-1">🌸</div>
            <div className="vintage-sticker sticker-2">🌺</div>
            <div className="vintage-sticker sticker-3">🌿</div>
            
            <div className="vintage-quote">
              <p>إلى توأم الروح.. رفيق الدرب</p>
              <p>اليوم يكتمل الحلم 🤍</p>
            </div>
          </div>
        </div>

        {!isOpen && (
          <button onClick={handleOpen} className="btn-gold open-btn font-cairo">
            اضغط لفتح الدعوة
          </button>
        )}
      </div>

      {/* Main Content */}
      <div 
        className="relative z-10 pt-20 pb-40 px-4"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 1.5s ease 0.5s'
        }}
      >
        
        {/* Floating Audio Button */}
        {data.music && (
          <button 
            onClick={toggleAudio}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg border border-gold-primary text-gold-dark hover:scale-110 transition-transform"
          >
            {isPlaying ? '🎵' : '🔇'}
          </button>
        )}

        <div className="max-w-4xl mx-auto text-center space-y-24">
          
          <RevealWrapper>
            <section className="mt-12">
              <h1 className="bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</h1>
              <p className="quran-verse">{data.weddingMessage || '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾'}</p>
              <svg className="divider" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,10 L40,10 L50,0 L60,10 L100,10" fill="none" stroke="#c9a96e" strokeWidth="1" />
              </svg>
              <h2 className="font-cairo text-2xl mt-8 font-normal leading-loose">
                إلى توأم الروح.. رفيق الدرب.. ونس الأيام الحلوة
              </h2>
            </section>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <section>
              <div className="hero-names">
                <span className="shimmer-text">{data.groomName}</span>
                <span className="heart-icon">🤍</span>
                <span className="shimmer-text">{data.brideName}</span>
              </div>
              <svg className="divider" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,10 L40,10 L50,20 L60,10 L100,10" fill="none" stroke="#c9a96e" strokeWidth="1" />
              </svg>
            </section>
          </RevealWrapper>

          {data.coverImage && (
            <RevealWrapper>
              <div className="w-64 h-64 mx-auto rounded-full p-2 border-4 border-[#c9a96e] shadow-xl overflow-hidden glass-card">
                <img src={data.coverImage.url} alt="Cover" className="w-full h-full object-cover rounded-full" />
              </div>
            </RevealWrapper>
          )}

          <RevealWrapper>
            <section>
              <h2 className="font-arabic text-4xl text-gold-dark mb-12">قصتنا</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-icon">🕊️</div>
                  <div className="timeline-content glass-card">
                    <h3 className="text-gold-dark font-cairo text-xl font-bold">اللقاء الأول</h3>
                    <p className="font-cairo text-sm mt-2">يوم التقينا وتلاقت الأرواح</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">💍</div>
                  <div className="timeline-content glass-card">
                    <h3 className="text-gold-dark font-cairo text-xl font-bold">الخطوبة</h3>
                    <p className="font-cairo text-sm mt-2">وعدنا بعضنا على الحب والوفاء</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">✨</div>
                  <div className="timeline-content glass-card">
                    <h3 className="text-gold-dark font-cairo text-xl font-bold">يوم الفرح</h3>
                    <p className="font-cairo text-sm mt-2">نتوج حبنا ببداية حياة جديدة</p>
                  </div>
                </div>
              </div>
            </section>
          </RevealWrapper>

          {data.countdownEnabled && (
            <RevealWrapper>
              <section>
                <h2 className="font-arabic text-4xl text-gold-dark mb-8">العد التنازلي</h2>
                <div className="countdown-container">
                  <div className="glass-card countdown-box">
                    <span className="countdown-number">{timeLeft.days}</span>
                    <span className="countdown-label">يوم</span>
                  </div>
                  <div className="glass-card countdown-box">
                    <span className="countdown-number">{timeLeft.hours}</span>
                    <span className="countdown-label">ساعة</span>
                  </div>
                  <div className="glass-card countdown-box">
                    <span className="countdown-number">{timeLeft.minutes}</span>
                    <span className="countdown-label">دقيقة</span>
                  </div>
                  <div className="glass-card countdown-box">
                    <span className="countdown-number">{timeLeft.seconds}</span>
                    <span className="countdown-label">ثانية</span>
                  </div>
                </div>
              </section>
            </RevealWrapper>
          )}

          <RevealWrapper>
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-8 flex flex-col items-center gap-4 text-center">
                  <span className="text-4xl text-gold-dark">📅</span>
                  <h3 className="font-cairo text-xl font-bold">التاريخ</h3>
                  <p className="font-cairo text-lg text-gold-dark">{dateArabic}</p>
                </div>
                {data.weddingTime && (
                  <div className="glass-card p-8 flex flex-col items-center gap-4 text-center">
                    <span className="text-4xl text-gold-dark">⏰</span>
                    <h3 className="font-cairo text-xl font-bold">الوقت</h3>
                    <p className="font-cairo text-lg text-gold-dark">{timeArabic}</p>
                  </div>
                )}
                <div className="glass-card p-8 flex flex-col items-center gap-4 text-center">
                  <span className="text-4xl text-gold-dark">📍</span>
                  <h3 className="font-cairo text-xl font-bold">المكان</h3>
                  <p className="font-cairo text-lg text-gold-dark">{data.venueName}</p>
                  {data.venueAddress && <p className="font-cairo text-sm">{data.venueAddress}</p>}
                </div>
                <div className="glass-card p-8 flex flex-col items-center gap-4 text-center">
                  <span className="text-4xl text-gold-dark">👔</span>
                  <h3 className="font-cairo text-xl font-bold">Dress Code</h3>
                  <p className="font-cairo text-lg text-gold-dark">رسمي / Formal</p>
                </div>
              </div>
            </section>
          </RevealWrapper>

          {data.googleMapsUrl && (
            <RevealWrapper>
              <section>
                <h2 className="font-arabic text-4xl text-gold-dark mb-8">موقع الحفل</h2>
                <TrackedLink 
                  eventType="MAP_CLICK"
                  href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                  target={mode === "PREVIEW" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="btn-gold font-cairo shadow-xl"
                >
                  اضغط هنا للوصول عبر الخرائط 🗺️
                </TrackedLink>
              </section>
            </RevealWrapper>
          )}

          {data.galleryImages && data.galleryImages.length > 0 && (
            <RevealWrapper>
              <section>
                <h2 className="font-arabic text-4xl text-gold-dark mb-8">معرض الصور</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.galleryImages.map((img, i) => (
                    <div key={i} className="glass-card overflow-hidden h-40">
                      <img src={img.url} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </section>
            </RevealWrapper>
          )}

          <RevealWrapper>
            <section className="pb-16 pt-16 border-t border-[#c9a96e]/30">
              <p className="font-arabic text-3xl text-gold-dark shimmer-text leading-loose">بحضوركم تكتمل فرحتنا ♥</p>
              
              {(data.groomPhone || data.bridePhone) && (
                <div className="flex justify-center gap-4 mt-8">
                  {data.groomPhone && (
                    <TrackedLink eventType="GROOM_CONTACT" href={\`tel:\${data.groomPhone}\`} className="btn-gold text-sm px-6">
                      تواصل مع العريس
                    </TrackedLink>
                  )}
                  {data.bridePhone && (
                    <TrackedLink eventType="BRIDE_CONTACT" href={\`tel:\${data.bridePhone}\`} className="btn-gold text-sm px-6">
                      تواصل مع العروس
                    </TrackedLink>
                  )}
                </div>
              )}
            </section>
          </RevealWrapper>

        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('fix-arabic.js', `
const fs = require('fs');
let code = fs.readFileSync('apps/web/src/templates/designs/golden-arabic/index.tsx', 'utf8');
const startIdx = code.indexOf('return (');
const cssPart = code.substring(0, startIdx);
fs.writeFileSync('apps/web/src/templates/designs/golden-arabic/index.tsx', cssPart + ${JSON.stringify(newJSX)});
`);
