"use client";
import React, { useState, useRef } from "react";
import { TemplateRenderContext } from "../../types";
import { formatEventDate } from "../../utils/date";
import { Countdown } from "../../utils/Countdown";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { FloatingElements } from "../../utils/FloatingElements";
import confetti from "canvas-confetti";

export const ClassicEleganceTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === "PREVIEW" ? false : false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const custom = data.customData || {};

  const handleOpen = () => {
    setIsOpen(true);
    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#BF953F', '#FCF6BA', '#B38728', '#ffffff']
      });
    }, 600);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    animationDelay: `-${Math.random() * 10}s`,
  }));

  return (
    <div className="min-h-screen relative bg-[#0f1110] text-[#E0D5C1] font-serif overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        
        .gold-gradient-text {
          background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 5s linear infinite;
        }

        .gold-border {
          border-image: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) 1;
        }
        
        .gold-bg {
          background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          50% { transform: translateY(-50px) translateX(20px) scale(1.5); opacity: 0.8; }
          100% { transform: translateY(-100px) translateX(-20px) scale(1); opacity: 0; }
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: #FCF6BA;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px #BF953F;
          opacity: 0;
          animation: floatParticle infinite ease-in-out;
        }
        
        .luxury-shadow {
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.7), 0 18px 36px -18px rgba(191,149,63,0.3);
        }
      `}} />

      {/* Hidden Audio */}
      {data.music && <audio ref={audioRef} src={data.music.url} loop />}

      {/* Welcome Envelope Overlay */}
      <div 
        className={`absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0a0b0a] to-[#1a1c1a] transition-all duration-[2s] ease-[cubic-bezier(0.8,0,0.2,1)] ${isOpen ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        
        <div className="relative z-10 bg-[#0f1110]/80 p-16 max-w-sm w-11/12 text-center border-t-2 border-b-2 gold-border luxury-shadow backdrop-blur-xl transform transition-transform duration-[1s] hover:scale-105">
          <h3 className="font-cinzel tracking-[0.4em] uppercase text-xs text-[#FCF6BA] mb-4 opacity-80">{custom.welcomeTitle || "You Are Invited"}</h3>
          <div className="w-16 h-[1px] gold-bg mx-auto mb-10"></div>
          
          <h1 className="text-4xl font-playfair mb-6 text-[#E0D5C1] font-light leading-tight">
            {data.groomName} <br/><span className="text-xl italic text-[#BF953F] block my-3">&amp;</span> {data.brideName}
          </h1>
          
          <div className="w-16 h-[1px] gold-bg mx-auto mt-10 mb-12"></div>
          
          <button 
            onClick={handleOpen}
            className="px-8 py-3 bg-transparent border border-[#BF953F] text-[#FCF6BA] font-cinzel text-xs tracking-widest uppercase hover:bg-[#BF953F] hover:text-[#0f1110] transition-all duration-500 cursor-pointer flex justify-center items-center gap-3 mx-auto group shadow-[0_0_15px_rgba(191,149,63,0.2)] hover:shadow-[0_0_25px_rgba(191,149,63,0.5)]"
          >
            {custom.openButtonText || "Open Invitation"}
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`h-screen overflow-y-auto overflow-x-hidden transition-opacity duration-1000 delay-300 relative ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Ambient background textures */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none z-0"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a2b25]/20 via-[#0f1110] to-[#0f1110] pointer-events-none z-0"></div>
        
        {/* Floating Particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {particles.map((p) => (
            <div key={p.id} className="particle" style={{ left: p.left, top: p.top, animationDuration: p.animationDuration, animationDelay: p.animationDelay }} />
          ))}
        </div>

        {/* Audio Button */}
        {data.music && (
          <button 
            onClick={toggleAudio}
            className="fixed top-8 right-8 z-50 w-12 h-12 bg-[#0f1110]/80 backdrop-blur-md border border-[#BF953F] rounded-full flex items-center justify-center text-[#FCF6BA] hover:bg-[#BF953F] hover:text-[#0f1110] transition-all duration-500 cursor-pointer shadow-[0_0_15px_rgba(191,149,63,0.3)] hover:shadow-[0_0_25px_rgba(191,149,63,0.6)] group"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            ) : (
              <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            )}
          </button>
        )}

        {/* Replay Entrance Button */}
        {isOpen && (
          <button
            onClick={handleReset}
            title="إعادة غلق المظروف لتجربة الحركة مجدداً"
            className="fixed top-8 left-8 z-50 px-3.5 py-1.5 rounded-full bg-[#0f1110]/80 backdrop-blur-md border border-[#BF953F]/40 text-xs font-semibold text-[#FCF6BA] shadow-sm hover:bg-[#0f1110] flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
          >
            <span>🔄</span>
            <span>Replay Entrance</span>
          </button>
        )}

        <div className="relative z-10 w-full min-h-screen">
          
          {/* Hero Section */}
          <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center p-6 border-b border-[#BF953F]/20">
            {data.coverImage && (
              <RevealWrapper delay={400} distance={40}>
                <div className="mb-12 overflow-hidden w-64 h-80 md:w-80 md:h-[28rem] luxury-shadow relative z-10 border border-[#BF953F]/30 p-2 group bg-[#0f1110]">
                  <div className="absolute inset-2 border border-[#BF953F]/50 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <img src={data.coverImage.url} alt="Cover" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-[3s]" />
                </div>
              </RevealWrapper>
            )}
            
            <RevealWrapper delay={600} distance={50}>
              <div className="max-w-3xl">
                <h3 className="font-cinzel tracking-[0.5em] uppercase text-xs text-[#BF953F] mb-8">{custom.heroSubtitle || "The Wedding Of"}</h3>
                <h1 className="text-5xl md:text-7xl lg:text-8xl mb-4 font-playfair gold-gradient-text leading-tight">
                  {data.groomName}
                </h1>
                <div className="text-4xl text-[#BF953F] my-6 font-playfair italic font-light">&amp;</div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl mb-12 font-playfair gold-gradient-text leading-tight">
                  {data.brideName}
                </h1>
                <div className="w-40 h-[1px] gold-bg mx-auto mb-10"></div>
                <p className="text-xl md:text-2xl font-cinzel text-[#E0D5C1] tracking-widest uppercase">
                  {formatEventDate(data.weddingDate, direction)}
                </p>
                {data.weddingTime && (
                  <p className="font-cinzel text-sm text-[#BF953F] mt-4 tracking-[0.3em] uppercase">
                    {data.weddingTime}
                  </p>
                )}
              </div>
            </RevealWrapper>
          </section>

          {/* Details Section */}
          <section className="py-32 px-6 text-center relative">
            <RevealWrapper>
              <h2 className="text-4xl md:text-5xl font-playfair mb-16 gold-gradient-text">{custom.ceremonyTitle || "Ceremony & Reception"}</h2>
            </RevealWrapper>
            
            <RevealWrapper delay={200} distance={50}>
              <div className="max-w-3xl mx-auto p-12 md:p-20 bg-[#161816] border border-[#BF953F]/20 luxury-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 gold-bg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                <div className="absolute bottom-0 right-0 w-full h-1 gold-bg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-right"></div>
                
                <h3 className="text-3xl font-playfair mb-6 text-[#E0D5C1]">{data.venueName}</h3>
                {data.venueAddress && <p className="text-lg font-cinzel text-[#BF953F] mb-12 max-w-md mx-auto uppercase tracking-wider leading-loose">{data.venueAddress}</p>}
                
                {data.googleMapsUrl && (
                  <TrackedLink 
                    eventType="MAP_CLICK"
                    href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                    target={mode === "PREVIEW" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="inline-block px-10 py-4 bg-transparent border border-[#BF953F] text-[#FCF6BA] font-cinzel text-xs tracking-[0.2em] uppercase hover:bg-[#BF953F] hover:text-[#0f1110] transition-all duration-300 shadow-[0_0_15px_rgba(191,149,63,0.1)] hover:shadow-[0_0_25px_rgba(191,149,63,0.4)]"
                  >
                    View Map &amp; Directions
                  </TrackedLink>
                )}
              </div>
            </RevealWrapper>
          </section>

          {/* Schedule / Timeline Mock */}
          <section className="py-32 px-6 bg-[#0a0b0a] border-y border-[#BF953F]/10">
            <RevealWrapper>
              <h2 className="text-4xl md:text-5xl font-playfair text-center mb-24 gold-gradient-text">{custom.scheduleTitle || "Schedule of Events"}</h2>
            </RevealWrapper>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
               <RevealWrapper delay={100} direction="up" distance={40}>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full border border-[#BF953F]/50 flex items-center justify-center mb-6 group-hover:bg-[#BF953F]/10 transition-colors duration-500 shadow-[0_0_15px_rgba(191,149,63,0.1)]">
                       <span className="font-playfair text-xl text-[#FCF6BA]">{custom.event1Time || "15:00"}</span>
                    </div>
                    <h4 className="font-cinzel uppercase tracking-widest text-[#E0D5C1] mb-2">{custom.event1Title || "Arrival"}</h4>
                    <p className="font-playfair text-sm text-[#BF953F] italic">{custom.event1Desc || "Welcome drinks"}</p>
                 </div>
               </RevealWrapper>

               <RevealWrapper delay={300} direction="up" distance={40}>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full border border-[#BF953F]/50 flex items-center justify-center mb-6 group-hover:bg-[#BF953F]/10 transition-colors duration-500 shadow-[0_0_15px_rgba(191,149,63,0.1)]">
                       <span className="font-playfair text-xl text-[#FCF6BA]">{custom.event2Time || "16:00"}</span>
                    </div>
                    <h4 className="font-cinzel uppercase tracking-widest text-[#E0D5C1] mb-2">{custom.event2Title || "Ceremony"}</h4>
                    <p className="font-playfair text-sm text-[#BF953F] italic">{custom.event2Desc || "Exchange of vows"}</p>
                 </div>
               </RevealWrapper>

               <RevealWrapper delay={500} direction="up" distance={40}>
                 <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full border border-[#BF953F]/50 flex items-center justify-center mb-6 group-hover:bg-[#BF953F]/10 transition-colors duration-500 shadow-[0_0_15px_rgba(191,149,63,0.1)]">
                       <span className="font-playfair text-xl text-[#FCF6BA]">{custom.event3Time || "18:00"}</span>
                    </div>
                    <h4 className="font-cinzel uppercase tracking-widest text-[#E0D5C1] mb-2">{custom.event3Title || "Reception"}</h4>
                    <p className="font-playfair text-sm text-[#BF953F] italic">{custom.event3Desc || "Dinner & Dancing"}</p>
                 </div>
               </RevealWrapper>
            </div>
          </section>

          {/* Optional Message */}
          {data.weddingMessage && (
            <section className="py-32 px-6 text-center">
              <RevealWrapper>
                <div className="max-w-4xl mx-auto">
                  <p className="text-2xl md:text-4xl leading-relaxed italic font-playfair text-[#E0D5C1] opacity-90">
                    "{data.weddingMessage}"
                  </p>
                </div>
              </RevealWrapper>
            </section>
          )}

          {/* Gallery */}
          {data.galleryImages && data.galleryImages.length > 0 && (
            <section className="py-32 px-6 max-w-7xl mx-auto bg-[#0a0b0a] border-y border-[#BF953F]/10">
              <RevealWrapper>
                <h2 className="text-4xl md:text-5xl font-playfair text-center mb-20 gold-gradient-text">Gallery</h2>
              </RevealWrapper>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.galleryImages.map((img, i) => (
                  <RevealWrapper key={i} delay={i * 200} distance={50}>
                    <div className="overflow-hidden border border-[#BF953F]/30 p-2 bg-[#161816] luxury-shadow group cursor-pointer">
                      <div className="relative w-full h-80 overflow-hidden">
                        <div className="absolute inset-0 bg-[#BF953F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-[2s]" />
                      </div>
                    </div>
                  </RevealWrapper>
                ))}
              </div>
            </section>
          )}

          {/* Footer / Contacts */}
          <footer className="py-40 px-6 text-center relative overflow-hidden bg-[#0f1110]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none z-0"></div>
            
            <div className="relative z-10">
              <RevealWrapper>
                <h2 className="text-4xl md:text-6xl font-playfair mb-10 gold-gradient-text">{custom.closingTitle || "We await your presence"}</h2>
                <div className="w-32 h-[1px] gold-bg mx-auto mb-16"></div>
              </RevealWrapper>
              
              <RevealWrapper delay={200}>
                {(data.groomPhone || data.bridePhone) && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap font-cinzel text-xs tracking-widest">
                    {data.groomPhone && (
                      <a 
                        href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                        target="_blank"
                        className="px-8 py-4 bg-[#25D366] text-white hover:bg-[#1ebd5a] transition-all duration-300 uppercase shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] font-bold rounded-sm flex items-center gap-2"
                      >
                        WhatsApp Groom
                      </a>
                    )}
                    {data.bridePhone && (
                      <a 
                        href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                        target="_blank"
                        className="px-8 py-4 bg-[#E1306C] text-white hover:bg-[#c9265e] transition-all duration-300 uppercase shadow-[0_0_15px_rgba(225,48,108,0.3)] hover:shadow-[0_0_25px_rgba(225,48,108,0.6)] font-bold rounded-sm flex items-center gap-2"
                      >
                        WhatsApp Bride
                      </a>
                    )}
                  </div>
                )}
              </RevealWrapper>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
