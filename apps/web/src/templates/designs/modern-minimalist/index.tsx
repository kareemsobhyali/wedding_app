"use client";
import React, { useState, useRef } from "react";
import { TemplateRenderContext } from "../../types";
import { formatEventDate } from "../../utils/date";
import { Countdown } from "../../utils/Countdown";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { FloatingElements } from "../../utils/FloatingElements";
import confetti from "canvas-confetti";

export const ModernMinimalistTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode }) => {
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#111111', '#555555', '#999999', '#ffffff']
      });
    }, 500);
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

  return (
    <div className="min-h-screen relative bg-white text-[#111] font-sans overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Montserrat:wght@100;200;300;400;600&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        
        .ken-burns { animation: kenBurns 30s infinite alternate linear; }
        @keyframes kenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}} />

      {/* Hidden Audio */}
      {data.music && <audio ref={audioRef} src={data.music.url} loop />}

      {/* Modern Welcome Overlay */}
      <div 
        className={`absolute inset-0 z-50 flex items-center justify-center bg-[#FAFAFA] transition-transform duration-[1.5s] ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="text-center px-6 max-w-2xl w-full">
          <div className="overflow-hidden mb-8">
            <h3 className="font-inter tracking-[0.5em] uppercase text-xs text-gray-400 transform transition-transform duration-1000 translate-y-0">{custom.welcomeHeader || "The Invitation"}</h3>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-montserrat font-thin tracking-tighter mb-4 text-[#111] uppercase">
            {(data.groomName || 'Groom').trim().split(' ')[0]} 
            <span className="text-gray-300 font-inter font-thin mx-4 md:mx-6">&amp;</span> 
            {(data.brideName || 'Bride').trim().split(' ')[0]}
          </h1>
          
          <div className="w-0 h-[1px] bg-[#111] mx-auto my-10 transition-all duration-1000 ease-out" style={{ width: '60px' }}></div>
          
          <p className="font-inter text-gray-400 font-light mb-16 tracking-[0.3em] uppercase text-xs md:text-sm">
            {formatEventDate(data.weddingDate, direction)}
          </p>
          
          <button 
            onClick={handleOpen}
            className="px-12 py-5 bg-[#111] text-white font-inter text-xs tracking-[0.3em] uppercase hover:bg-gray-800 transition-all duration-500 cursor-pointer group flex items-center gap-4 mx-auto overflow-hidden relative"
          >
            <span className="relative z-10">{custom.enterButtonText || "Enter Experience"}</span>
            <svg className="w-4 h-4 relative z-10 transform group-hover:translate-x-3 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`h-screen overflow-y-auto overflow-x-hidden transition-opacity duration-1000 delay-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Audio Button */}
        {data.music && (
          <button 
            onClick={toggleAudio}
            className="fixed top-8 right-8 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full flex items-center justify-center text-[#111] hover:bg-gray-50 hover:scale-110 transition-all duration-500 cursor-pointer shadow-lg"
          >
            {isPlaying ? (
              <div className="flex gap-1 items-center justify-center h-4 w-4">
                <div className="w-[2px] h-full bg-[#111] animate-pulse"></div>
                <div className="w-[2px] h-3/4 bg-[#111] animate-pulse delay-75"></div>
                <div className="w-[2px] h-full bg-[#111] animate-pulse delay-150"></div>
              </div>
            ) : (
              <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            )}
          </button>
        )}

        {/* Replay Entrance Button */}
        {isOpen && (
          <button
            onClick={handleReset}
            title="إعادة تجربة الدخول"
            className="fixed top-8 left-8 z-50 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-[10px] font-inter font-semibold uppercase tracking-widest text-[#111] hover:bg-[#111] hover:text-white transition-all cursor-pointer shadow-md flex items-center gap-2"
          >
            <span>↺</span>
            <span>Replay</span>
          </button>
        )}

        {/* Hero Section */}
        <section className="min-h-[100vh] flex flex-col md:flex-row bg-[#FAFAFA]">
          {data.coverImage && (
            <div className="w-full md:w-1/2 h-[60vh] md:h-[100vh] relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 z-10 mix-blend-overlay"></div>
              <img 
                src={data.coverImage.url} 
                alt="Cover" 
                className="w-full h-full object-cover ken-burns grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          )}
          
          <div className={`w-full ${data.coverImage ? 'md:w-1/2' : 'md:w-full'} flex flex-col justify-center items-center md:items-start p-12 md:p-32 bg-white relative z-20`}>
            <RevealWrapper delay={200} distance={60}>
              <h3 className="font-inter tracking-[0.4em] uppercase text-[10px] text-gray-400 mb-10 md:mb-16">{custom.heroTagline || "The Wedding Day"}</h3>
            </RevealWrapper>
            
            <RevealWrapper delay={400} distance={60}>
              <h1 className="text-6xl md:text-8xl xl:text-9xl mb-6 font-montserrat font-thin tracking-tighter leading-[0.8] uppercase text-[#111]">
                {data.groomName} <br/><span className="text-gray-200 font-inter font-thin block my-4">&amp;</span> {data.brideName}
              </h1>
            </RevealWrapper>
            
            <RevealWrapper delay={600} distance={60}>
              <div className="w-10 h-10 border-b border-r border-[#111] transform rotate-45 my-16 opacity-30"></div>
            </RevealWrapper>
            
            <RevealWrapper delay={800} distance={60}>
              <p className="text-xl md:text-2xl font-inter text-gray-500 font-light tracking-wide uppercase">
                {formatEventDate(data.weddingDate, direction)}
              </p>
            </RevealWrapper>
            
            {data.weddingTime && (
              <RevealWrapper delay={1000} distance={60}>
                <p className="font-inter text-gray-400 mt-4 tracking-[0.3em] uppercase text-xs">{data.weddingTime}</p>
              </RevealWrapper>
            )}
          </div>
        </section>

        {/* The Program */}
        <section className="py-40 px-8 md:px-24 bg-white text-center border-t border-gray-100">
          <RevealWrapper>
            <h2 className="text-4xl md:text-5xl font-montserrat font-thin mb-32 tracking-tight uppercase text-[#111]">{custom.programTitle || "The Program"}</h2>
          </RevealWrapper>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
             <RevealWrapper delay={200}>
               <div className="flex flex-col items-center group">
                  <div className="w-[1px] h-20 bg-gray-200 mb-8 group-hover:h-24 group-hover:bg-[#111] transition-all duration-500"></div>
                  <h4 className="font-inter uppercase tracking-[0.3em] text-[10px] font-semibold mb-3 text-gray-400 group-hover:text-[#111] transition-colors">{custom.event1Title || "Ceremony"}</h4>
                  <p className="font-montserrat text-[#111] text-3xl font-thin">{custom.event1Time || "4:00 PM"}</p>
               </div>
             </RevealWrapper>
             <RevealWrapper delay={400}>
               <div className="flex flex-col items-center group">
                  <div className="w-[1px] h-20 bg-gray-200 mb-8 group-hover:h-24 group-hover:bg-[#111] transition-all duration-500"></div>
                  <h4 className="font-inter uppercase tracking-[0.3em] text-[10px] font-semibold mb-3 text-gray-400 group-hover:text-[#111] transition-colors">{custom.event2Title || "Cocktails"}</h4>
                  <p className="font-montserrat text-[#111] text-3xl font-thin">{custom.event2Time || "5:30 PM"}</p>
               </div>
             </RevealWrapper>
             <RevealWrapper delay={600}>
               <div className="flex flex-col items-center group">
                  <div className="w-[1px] h-20 bg-gray-200 mb-8 group-hover:h-24 group-hover:bg-[#111] transition-all duration-500"></div>
                  <h4 className="font-inter uppercase tracking-[0.3em] text-[10px] font-semibold mb-3 text-gray-400 group-hover:text-[#111] transition-colors">{custom.event3Title || "Reception"}</h4>
                  <p className="font-montserrat text-[#111] text-3xl font-thin">{custom.event3Time || "7:00 PM"}</p>
               </div>
             </RevealWrapper>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-40 px-8 md:px-24 bg-[#111] text-white flex flex-col items-center md:items-start">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-24 justify-between">
            <div className="flex-1">
               <RevealWrapper>
                 <h2 className="text-6xl md:text-8xl font-montserrat font-thin mb-12 tracking-tighter uppercase">The Venue</h2>
               </RevealWrapper>
               {data.weddingMessage && (
                 <RevealWrapper delay={200}>
                   <p className="text-2xl md:text-3xl leading-relaxed font-inter font-thin text-gray-400 max-w-xl">
                     {data.weddingMessage}
                   </p>
                 </RevealWrapper>
               )}
            </div>
            
            <div className="flex-1 bg-white/5 p-16 md:p-20 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors duration-500">
              <RevealWrapper delay={300}>
                <h3 className="text-[10px] font-inter uppercase tracking-[0.4em] text-gray-500 mb-6">Location</h3>
                <h4 className="text-4xl md:text-5xl font-montserrat font-thin mb-6 leading-tight uppercase">{data.venueName}</h4>
                {data.venueAddress && <p className="text-gray-400 font-inter font-light mb-16 leading-relaxed tracking-wide">{data.venueAddress}</p>}
                
                {data.googleMapsUrl && (
                  <TrackedLink 
                    eventType="MAP_CLICK"
                    href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                    target={mode === "PREVIEW" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="inline-flex items-center gap-6 px-10 py-5 bg-white text-[#111] font-inter text-xs tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors group"
                  >
                    Get Directions
                    <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </TrackedLink>
                )}
              </RevealWrapper>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {data.galleryImages && data.galleryImages.length > 0 && (
          <section className="py-40 px-4 max-w-[1800px] mx-auto">
            <RevealWrapper>
              <h2 className="text-center text-[10px] font-inter uppercase tracking-[0.5em] text-gray-400 mb-24">Captured Moments</h2>
            </RevealWrapper>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {data.galleryImages.map((img, i) => (
                <RevealWrapper key={i} delay={(i % 4) * 150} distance={40}>
                  <div className="break-inside-avoid relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[#111]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                    <img 
                      src={img.url} 
                      alt="Gallery" 
                      className="w-full h-auto object-cover grayscale hover:grayscale-0 transform hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                    />
                  </div>
                </RevealWrapper>
              ))}
            </div>
          </section>
        )}

        {/* Footer / RSVP */}
        <footer className="py-40 px-8 text-center bg-[#FAFAFA] border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <RevealWrapper>
              <h2 className="text-6xl md:text-8xl font-montserrat font-thin tracking-tighter mb-10 uppercase text-[#111]">{custom.closingTitle || "Join Us"}</h2>
            </RevealWrapper>
            
            <RevealWrapper delay={200}>
              <p className="font-inter text-gray-500 mb-20 tracking-[0.2em] uppercase text-xs">{custom.closingSubtitle || "Please let us know if you can make it."}</p>
            </RevealWrapper>

            {(data.groomPhone || data.bridePhone) && (
              <div className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap font-inter items-center">
                {data.groomPhone && (
                  <RevealWrapper delay={300} direction="up" distance={30}>
                    <a 
                      href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                      target="_blank"
                      className="px-10 py-5 bg-[#111] text-white hover:bg-black transition-all text-xs uppercase tracking-[0.3em] font-medium border border-black shadow-sm flex items-center gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                      <span>WhatsApp Groom</span>
                    </a>
                  </RevealWrapper>
                )}
                {data.bridePhone && (
                  <RevealWrapper delay={400} direction="up" distance={30}>
                    <a 
                      href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                      target="_blank"
                      className="px-10 py-5 bg-[#111] text-white hover:bg-black transition-all text-xs uppercase tracking-[0.3em] font-medium border border-black shadow-sm flex items-center gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#E1306C]"></span>
                      <span>WhatsApp Bride</span>
                    </a>
                  </RevealWrapper>
                )}
              </div>
            )}
          </div>
        </footer>

      </div>
    </div>
  );
};
