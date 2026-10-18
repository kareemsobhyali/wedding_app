"use client";
import React, { useState, useRef } from "react";
import { TemplateRenderContext } from "../../types";
import { formatEventDate } from "../../utils/date";
import { Countdown } from "../../utils/Countdown";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { FloatingElements } from "../../utils/FloatingElements";
import confetti from "canvas-confetti";

export const FloralRomanceTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode }) => {
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
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ffc0cb', '#ffb6c1', '#B38B8B', '#ffffff']
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

  // Petals generator
  const petals = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 15 + 15}s`,
    animationDelay: `-${Math.random() * 20}s`, // Negative delay so they start immediately at different positions
    swayDuration: `${Math.random() * 4 + 4}s`,
  }));

  return (
    <div className="min-h-screen relative bg-[#FFF9F9] text-[#5C4D4D] font-serif overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap');
        .font-vibes { font-family: 'Great Vibes', cursive; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .floral-bg {
          background-image: url('https://www.transparenttextures.com/patterns/floral-motif.png');
        }
        
        @keyframes fall {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes sway {
          0% { margin-left: 0px; transform: rotate(0deg); }
          50% { margin-left: 50px; transform: rotate(180deg); }
          100% { margin-left: 0px; transform: rotate(360deg); }
        }
        .petal {
          position: absolute;
          width: 25px;
          height: 25px;
          background: radial-gradient(circle at 30% 30%, #ffc0cb 0%, #ffb6c1 100%);
          border-radius: 0 50% 50% 50%;
          opacity: 0;
          top: -30px;
          box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .petal-sway {
          animation: sway infinite ease-in-out alternate;
        }

        .ken-burns-soft {
          animation: kenBurnsSoft 20s infinite alternate linear;
        }
        @keyframes kenBurnsSoft {
          from { transform: scale(1.05); }
          to { transform: scale(1.1); }
        }
      `}} />

      {/* Hidden Audio */}
      {data.music && <audio ref={audioRef} src={data.music.url} loop />}

      {/* Welcome Envelope Overlay */}
      <div 
        className={`absolute inset-0 z-50 flex items-center justify-center bg-[#FDF5F5] transition-all duration-[1.8s] ease-[cubic-bezier(0.76,0,0.24,1)] floral-bg ${isOpen ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'}`}
      >
        <div className="absolute top-0 left-0 w-80 h-80 opacity-40 mix-blend-multiply bg-[url('https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png')] bg-contain bg-no-repeat -scale-x-100 transform transition-transform duration-[3s] hover:scale-[1.05]"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 opacity-40 mix-blend-multiply bg-[url('https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png')] bg-contain bg-no-repeat rotate-180 transform transition-transform duration-[3s] hover:scale-[1.05]"></div>
        
        <div className="relative z-10 text-center max-w-md w-11/12 p-14 bg-white/70 backdrop-blur-md rounded-[3rem] border border-pink-100 shadow-[0_20px_60px_rgba(255,182,193,0.15)] transform transition-transform duration-[2s] hover:-translate-y-2">
          <div className="w-20 h-20 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-8 shadow-inner border border-pink-100">
            <span className="font-vibes text-5xl text-[#B38B8B] mt-2">
              {(data.groomName || 'G').trim().charAt(0)}{(data.brideName || 'B').trim().charAt(0)}
            </span>
          </div>
          <h3 className="font-cormorant tracking-[0.3em] uppercase text-xs text-[#B38B8B] mb-4">{custom.welcomeSubtitle || "Together with their families"}</h3>
          <h1 className="text-5xl md:text-6xl font-vibes text-[#8C6B6B] my-8 drop-shadow-sm">
            {data.groomName} <br/><span className="text-3xl text-[#D4B5B5]">&amp;</span><br/> {data.brideName}
          </h1>
          <button 
            onClick={handleOpen}
            className="mt-10 px-10 py-4 bg-gradient-to-r from-[#B38B8B] to-[#C9A3A3] text-white font-cormorant tracking-widest text-lg hover:shadow-lg hover:shadow-pink-900/20 transition-all duration-500 rounded-full flex items-center gap-3 mx-auto cursor-pointer group"
          >
            Open Invitation
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`h-screen overflow-y-auto overflow-x-hidden transition-all duration-[1.5s] delay-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* Falling Petals */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {petals.map((p) => (
            <div 
              key={p.id} 
              className="petal" 
              style={{ left: p.left, animation: `fall ${p.animationDuration} linear infinite ${p.animationDelay}` }}
            >
              <div className="w-full h-full petal-sway" style={{ animationDuration: p.swayDuration }}></div>
            </div>
          ))}
        </div>

        {/* Audio Button */}
        {data.music && (
          <button 
            onClick={toggleAudio}
            className="fixed top-8 right-8 z-50 w-14 h-14 bg-white/90 backdrop-blur-md border border-pink-100 rounded-full flex items-center justify-center text-[#8C6B6B] hover:bg-pink-50 hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </button>
        )}

        {/* Replay Entrance Button */}
        {isOpen && (
          <button
            onClick={handleReset}
            title="إعادة تجربة فتح الدعوة"
            className="fixed top-8 left-8 z-50 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 text-xs font-cormorant font-semibold tracking-wider text-[#8C6B6B] hover:bg-pink-50 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>Replay</span>
          </button>
        )}

        <div className="relative z-10 w-full min-h-screen">
          
          {/* Hero Section */}
          <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center py-20 px-6 floral-bg border-b border-pink-100 overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 opacity-30 mix-blend-multiply bg-[url('https://cdn.pixabay.com/photo/2016/12/27/18/12/watercolor-1934521_1280.png')] bg-contain bg-no-repeat -scale-x-100 ken-burns-soft"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 opacity-30 mix-blend-multiply bg-[url('https://cdn.pixabay.com/photo/2016/12/27/18/12/watercolor-1934521_1280.png')] bg-contain bg-no-repeat rotate-180 ken-burns-soft" style={{ animationDelay: '-10s' }}></div>
            
            {data.coverImage && (
              <RevealWrapper delay={400} distance={60}>
                <div className="mb-16 rounded-full overflow-hidden w-64 h-64 md:w-96 md:h-96 border-[12px] border-white shadow-2xl relative z-10 group">
                  <div className="absolute inset-0 bg-pink-100/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-1000"></div>
                  <img src={data.coverImage.url} alt="Cover" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out" />
                </div>
              </RevealWrapper>
            )}
            
            <RevealWrapper delay={600} distance={60}>
              <div className="relative z-20 max-w-2xl bg-white/60 p-16 rounded-[4rem] backdrop-blur-md border border-white shadow-xl shadow-pink-900/10 hover:shadow-2xl hover:shadow-pink-900/20 transition-shadow duration-1000">
                <h3 className="font-cormorant tracking-[0.3em] uppercase text-xs text-[#B38B8B] mb-8">{custom.welcomeSubtitle || "Together with their families"}</h3>
                <h1 className="text-7xl md:text-8xl lg:text-9xl mb-4 font-vibes text-[#8C6B6B] drop-shadow-sm">
                  {data.groomName}
                </h1>
                <div className="text-5xl text-[#D4B5B5] my-6 font-cormorant italic">&amp;</div>
                <h1 className="text-7xl md:text-8xl lg:text-9xl mb-12 font-vibes text-[#8C6B6B] drop-shadow-sm">
                  {data.brideName}
                </h1>
                
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4B5B5] to-transparent mx-auto mb-10"></div>
                
                <p className="text-3xl font-cormorant italic text-[#7A6363] tracking-wider">
                  {formatEventDate(data.weddingDate, direction)}
                </p>
                {data.weddingTime && (
                  <p className="font-cormorant text-lg text-[#B38B8B] mt-4 tracking-[0.2em] uppercase">
                    {data.weddingTime}
                  </p>
                )}
              </div>
            </RevealWrapper>
          </section>

          {/* Our Story Timeline */}
          <section className="py-32 px-6 bg-white relative">
            <RevealWrapper>
              <h2 className="text-6xl font-vibes text-center mb-24 text-[#8C6B6B]">{custom.storyTitle || "Our Journey"}</h2>
            </RevealWrapper>
            
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-pink-100 -translate-x-1/2"></div>
              
              <div className="space-y-24">
                <RevealWrapper delay={200} direction="up" distance={50}>
                  <div className="relative flex flex-col md:flex-row items-center justify-between group">
                    <div className="hidden md:block w-5/12 text-right pr-12">
                      <h3 className="text-3xl font-cormorant font-semibold text-[#5C4D4D] group-hover:text-[#8C6B6B] transition-colors">{custom.story1Title || "First Met"}</h3>
                      <p className="text-[#B38B8B] italic mb-2 font-cormorant text-lg">{custom.story1Subtitle || "A beautiful beginning"}</p>
                    </div>
                    <div className="absolute left-[39px] md:left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-pink-200 rounded-full group-hover:border-[#8C6B6B] transition-colors duration-500 z-10 shadow-md"></div>
                    <div className="w-full pl-24 md:pl-0 md:w-5/12 text-left md:pl-12">
                      <div className="md:hidden">
                        <h3 className="text-3xl font-cormorant font-semibold text-[#5C4D4D] group-hover:text-[#8C6B6B] transition-colors">{custom.story1Title || "First Met"}</h3>
                        <p className="text-[#B38B8B] italic mb-2 font-cormorant text-lg">{custom.story1Subtitle || "A beautiful beginning"}</p>
                      </div>
                      <p className="text-gray-500 font-sans text-sm font-light leading-relaxed">{custom.story1Desc || "It started with a simple hello, and little did we know it was the start of something forever."}</p>
                    </div>
                  </div>
                </RevealWrapper>
                
                <RevealWrapper delay={400} direction="up" distance={50}>
                  <div className="relative flex flex-col md:flex-row items-center justify-between group">
                    <div className="hidden md:block w-5/12 text-right pr-12">
                      <p className="text-gray-500 font-sans text-sm font-light leading-relaxed">{custom.story2Desc || "Under the stars, a promise was made to share a lifetime of love and happiness together."}</p>
                    </div>
                    <div className="absolute left-[39px] md:left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-pink-200 rounded-full group-hover:border-[#8C6B6B] transition-colors duration-500 z-10 shadow-md"></div>
                    <div className="w-full pl-24 md:pl-0 md:w-5/12 text-left md:pl-12">
                      <h3 className="text-3xl font-cormorant font-semibold text-[#5C4D4D] group-hover:text-[#8C6B6B] transition-colors">{custom.story2Title || "The Proposal"}</h3>
                      <p className="text-[#B38B8B] italic mb-2 font-cormorant text-lg">{custom.story2Subtitle || "A moment to remember"}</p>
                      <div className="md:hidden">
                        <p className="text-gray-500 font-sans text-sm font-light leading-relaxed">{custom.story2Desc || "Under the stars, a promise was made to share a lifetime of love and happiness together."}</p>
                      </div>
                    </div>
                  </div>
                </RevealWrapper>
              </div>
            </div>
          </section>

          {/* Details Section */}
          <section className="py-32 px-6 text-center relative overflow-hidden floral-bg">
            <RevealWrapper>
              <h2 className="text-6xl font-vibes mb-16 text-[#8C6B6B]">{custom.venueTitle || "When & Where"}</h2>
            </RevealWrapper>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <RevealWrapper delay={300} distance={60}>
                <div className="bg-white/70 backdrop-blur-md p-16 md:p-24 rounded-[40px] shadow-2xl shadow-pink-900/10 border border-white relative hover:shadow-pink-900/20 transition-shadow duration-500">
                  <div className="absolute top-4 left-4 w-20 h-20 opacity-30 bg-[url('https://cdn.pixabay.com/photo/2016/12/27/18/12/watercolor-1934521_1280.png')] bg-contain bg-no-repeat rotate-45"></div>
                  <div className="absolute bottom-4 right-4 w-20 h-20 opacity-30 bg-[url('https://cdn.pixabay.com/photo/2016/12/27/18/12/watercolor-1934521_1280.png')] bg-contain bg-no-repeat -rotate-135"></div>
                  
                  <h3 className="text-4xl font-cormorant font-semibold mb-6 text-[#5C4D4D]">{data.venueName}</h3>
                  {data.venueAddress && <p className="text-xl font-cormorant text-[#7A6363] mb-12 max-w-md mx-auto leading-relaxed">{data.venueAddress}</p>}
                  
                  {data.googleMapsUrl && (
                    <TrackedLink 
                      eventType="MAP_CLICK"
                      href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                      target={mode === "PREVIEW" ? undefined : "_blank"}
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-white to-pink-50 border border-pink-200 text-[#B38B8B] font-cormorant text-xl tracking-wide hover:from-pink-50 hover:to-pink-100 transition-all duration-300 rounded-full shadow-md hover:shadow-lg group"
                    >
                      View Map &amp; Directions
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </TrackedLink>
                  )}
                </div>
              </RevealWrapper>
            </div>
          </section>

          {/* Optional Message */}
          {data.weddingMessage && (
            <section className="py-32 px-6 bg-white text-center">
              <RevealWrapper>
                <div className="max-w-4xl mx-auto">
                  <div className="text-6xl text-pink-200 font-serif mb-6">"</div>
                  <p className="text-3xl md:text-5xl leading-relaxed italic font-cormorant text-[#7A6363]">
                    {data.weddingMessage}
                  </p>
                  <div className="text-6xl text-pink-200 font-serif mt-6">"</div>
                </div>
              </RevealWrapper>
            </section>
          )}

          {/* Gallery */}
          {data.galleryImages && data.galleryImages.length > 0 && (
            <section className="py-32 px-6 max-w-7xl mx-auto">
              <RevealWrapper>
                <h2 className="text-6xl font-vibes text-center mb-20 text-[#8C6B6B]">Captured Moments</h2>
              </RevealWrapper>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {data.galleryImages.map((img, i) => (
                  <RevealWrapper key={i} delay={i * 150} direction="up" distance={40}>
                    <div className={`bg-white p-6 pb-20 shadow-xl shadow-pink-900/10 transform transition-all duration-700 hover:scale-[1.05] hover:z-20 hover:-rotate-1 relative group cursor-pointer ${i%2===0 ? "rotate-2" : "-rotate-2"}`}>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/50 backdrop-blur-sm rounded-full shadow-inner opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src={img.url} alt="Gallery image" className="w-full h-80 object-cover border border-gray-50" />
                    </div>
                  </RevealWrapper>
                ))}
              </div>
            </section>
          )}

          {/* Footer / Contacts */}
          <footer className="py-40 px-6 text-center relative overflow-hidden bg-gradient-to-b from-[#FDF5F5] to-pink-50 border-t border-pink-100">
            <RevealWrapper>
              <h2 className="text-5xl md:text-7xl font-cormorant font-semibold mb-12 text-[#5C4D4D]">{custom.closingTitle || "We Can't Wait to Celebrate!"}</h2>
            </RevealWrapper>
            
            <RevealWrapper delay={200}>
              {(data.groomPhone || data.bridePhone) && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 flex-wrap font-cormorant text-xl mt-16">
                  {data.groomPhone && (
                    <a 
                      href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                      target="_blank"
                      className="px-10 py-4 bg-[#25D366] text-white shadow-md hover:shadow-xl hover:-translate-y-1 rounded-full transition-all duration-300 font-sans text-sm font-semibold flex items-center gap-2"
                    >
                      WhatsApp Groom
                    </a>
                  )}
                  {data.bridePhone && (
                    <a 
                      href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                      target="_blank"
                      className="px-10 py-4 bg-[#E1306C] text-white shadow-md hover:shadow-xl hover:-translate-y-1 rounded-full transition-all duration-300 font-sans text-sm font-semibold flex items-center gap-2"
                    >
                      WhatsApp Bride
                    </a>
                  )}
                </div>
              )}
            </RevealWrapper>
          </footer>
        </div>
      </div>
    </div>
  );
};