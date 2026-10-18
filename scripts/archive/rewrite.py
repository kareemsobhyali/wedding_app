
code = """\
"use client";
import React, { useState, useRef } from "react";
import { TemplateRenderContext } from "../../types";
import { formatEventDate } from "../../utils/date";
import { Countdown } from "../../utils/Countdown";
import { TrackedLink } from "../../utils/TrackedLink";

export const FloralRomanceTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode }) => {
  const [isOpen, setIsOpen] = useState(mode === "PREVIEW" ? false : false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    if (data.music && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
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
  const petals = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="min-h-screen relative bg-[#FFF9F9] text-[#5C4D4D] font-serif overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{__html: `
        @import url(\"https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap\");
        .font-vibes { font-family: "Great Vibes", cursive; }
        .font-cormorant { font-family: "Cormorant Garamond", serif; }
        .floral-bg {
          background-image: url(\"https://www.transparenttextures.com/patterns/floral-motif.png\");
        }
        
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .petal {
          position: absolute;
          width: 20px;
          height: 20px;
          background: #ffb6c1;
          border-radius: 50% 0 50% 50%;
          opacity: 0.6;
          top: -30px;
          animation: fall infinite linear;
          box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        @keyframes scaleUpFade {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-up { animation: scaleUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
      `}} />

      {/* Hidden Audio */}
      {data.music && <audio ref={audioRef} src={data.music.url} loop />}

      {/* Welcome Envelope Overlay */}
      <div 
        className={`absolute inset-0 z-50 flex items-center justify-center bg-[#FDF5F5] transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] floral-bg ${isOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="absolute top-0 left-0 w-64 h-64 opacity-40 mix-blend-multiply bg-[url(\"https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png\")] bg-contain bg-no-repeat -scale-x-100"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-40 mix-blend-multiply bg-[url(\"https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png\")] bg-contain bg-no-repeat rotate-180"></div>
        
        <div className="relative z-10 text-center max-w-md w-11/12 p-12 bg-white/60 backdrop-blur-md rounded-3xl border border-pink-100 shadow-xl shadow-pink-900/5">
          <div className="w-16 h-16 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-6">
            <span className="font-vibes text-4xl text-[#B38B8B]">{data.groomName.charAt(0)}{data.brideName.charAt(0)}</span>
          </div>
          <h3 className="font-cormorant tracking-[0.2em] uppercase text-sm text-[#B38B8B] mb-2">Together with their families</h3>
          <h1 className="text-4xl md:text-5xl font-vibes text-[#8C6B6B] my-6">
            {data.groomName} &amp; {data.brideName}
          </h1>
          <button 
            onClick={handleOpen}
            className="mt-8 px-8 py-3 bg-[#B38B8B] text-white font-cormorant text-lg hover:bg-[#8C6B6B] transition-colors rounded-full shadow-md flex items-center gap-2 mx-auto cursor-pointer"
          >
            Open Invitation
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`h-screen overflow-y-auto overflow-x-hidden transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        
        {/* Falling Petals */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {petals.map((p) => (
            <div key={p.id} className="petal" style={{ left: p.left, animationDuration: p.animationDuration, animationDelay: p.animationDelay }} />
          ))}
        </div>

        {/* Audio Button */}
        {data.music && (
          <button 
            onClick={toggleAudio}
            className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/80 backdrop-blur-md border border-pink-100 rounded-full flex items-center justify-center text-[#8C6B6B] hover:bg-pink-50 transition-all cursor-pointer shadow-sm"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </button>
        )}

        <div className="relative z-10 w-full min-h-screen">
          
          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 floral-bg border-b border-pink-100">
            <div className="absolute top-0 left-0 w-64 h-64 opacity-30 mix-blend-multiply bg-[url(\"https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png\")] bg-contain bg-no-repeat -scale-x-100"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30 mix-blend-multiply bg-[url(\"https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png\")] bg-contain bg-no-repeat rotate-180"></div>
            
            {data.coverImage && (
              <div className="mb-12 rounded-full overflow-hidden w-64 h-64 md:w-96 md:h-96 border-8 border-white shadow-2xl relative z-10 animate-scale-up">
                <img src={data.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="relative z-20 max-w-2xl bg-white/70 p-12 rounded-[3rem] backdrop-blur-sm border border-white shadow-xl shadow-pink-900/5 animate-scale-up delay-200">
              <h3 className="font-cormorant tracking-[0.2em] uppercase text-sm text-[#B38B8B] mb-6">Together with their families</h3>
              <h1 className="text-6xl md:text-8xl mb-2 font-vibes text-[#8C6B6B]">
                {data.groomName}
              </h1>
              <div className="text-4xl text-[#D4B5B5] my-4 font-cormorant italic">&amp;</div>
              <h1 className="text-6xl md:text-8xl mb-8 font-vibes text-[#8C6B6B]">
                {data.brideName}
              </h1>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4B5B5] to-transparent mx-auto mb-8"></div>
              <p className="text-2xl font-cormorant italic text-[#7A6363]">
                {formatEventDate(data.weddingDate, direction)}
              </p>
              {data.weddingTime && (
                <p className="font-cormorant text-lg text-[#B38B8B] mt-2 tracking-widest uppercase">
                  {data.weddingTime}
                </p>
              )}
            </div>
          </section>

          {/* Our Story Timeline */}
          <section className="py-24 px-6 bg-white relative">
            <h2 className="text-5xl font-vibes text-center mb-16 text-[#8C6B6B] animate-scale-up">Our Journey</h2>
            <div className="max-w-3xl mx-auto border-l-2 border-[#FDF5F5] pl-8 space-y-12">
              <div className="relative animate-scale-up delay-100">
                <div className="absolute -left-[41px] top-1 w-6 h-6 bg-pink-100 border-4 border-white rounded-full"></div>
                <h3 className="text-2xl font-cormorant font-semibold text-[#5C4D4D]">First Met</h3>
                <p className="text-[#B38B8B] italic mb-2 font-cormorant">A beautiful beginning</p>
                <p className="text-gray-500 font-sans text-sm font-light leading-relaxed">It started with a simple hello, and little did we know it was the start of something forever.</p>
              </div>
              <div className="relative animate-scale-up delay-200">
                <div className="absolute -left-[41px] top-1 w-6 h-6 bg-pink-100 border-4 border-white rounded-full"></div>
                <h3 className="text-2xl font-cormorant font-semibold text-[#5C4D4D]">The Proposal</h3>
                <p className="text-[#B38B8B] italic mb-2 font-cormorant">A moment to remember</p>
                <p className="text-gray-500 font-sans text-sm font-light leading-relaxed">Under the stars, a promise was made to share a lifetime of love and happiness together.</p>
              </div>
            </div>
          </section>

          {/* Details Section */}
          <section className="py-24 px-6 text-center relative overflow-hidden floral-bg">
            <div className="max-w-4xl mx-auto relative z-10 animate-scale-up">
              <h2 className="text-5xl font-vibes mb-12 text-[#8C6B6B]">When &amp; Where</h2>
              
              <div className="bg-white/80 backdrop-blur-sm p-16 rounded-[40px] shadow-xl shadow-pink-900/5 border border-pink-50 relative">
                <div className="absolute top-4 left-4 w-12 h-12 opacity-30 bg-[url(\"https://cdn.pixabay.com/photo/2016/12/27/18/12/watercolor-1934521_1280.png\")] bg-contain bg-no-repeat"></div>
                <h3 className="text-3xl font-cormorant font-semibold mb-4 text-[#5C4D4D]">{data.venueName}</h3>
                {data.venueAddress && <p className="text-xl font-cormorant text-[#7A6363] mb-10 max-w-md mx-auto">{data.venueAddress}</p>}
                
                {data.googleMapsUrl && (
                  <TrackedLink 
                    eventType="MAP_CLICK"
                    href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                    target={mode === "PREVIEW" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="inline-block px-10 py-3 bg-white border border-[#B38B8B] text-[#B38B8B] font-cormorant text-lg hover:bg-[#B38B8B] hover:text-white transition-all rounded-full shadow-sm"
                  >
                    View Map &amp; Directions
                  </TrackedLink>
                )}
              </div>
            </div>
          </section>

          {/* Optional Message */}
          {data.weddingMessage && (
            <section className="py-24 px-6 bg-white text-center">
              <div className="max-w-3xl mx-auto animate-scale-up">
                <p className="text-3xl md:text-4xl leading-relaxed italic font-cormorant text-[#7A6363]">
                  "{data.weddingMessage}"
                </p>
              </div>
            </section>
          )}

          {/* Gallery */}
          {data.galleryImages && data.galleryImages.length > 0 && (
            <section className="py-24 px-6 max-w-6xl mx-auto">
              <h2 className="text-5xl font-vibes text-center mb-16 text-[#8C6B6B] animate-scale-up">Captured Moments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.galleryImages.map((img, i) => (
                  <div key={i} className={`bg-white p-4 pb-16 shadow-xl shadow-pink-900/10 transform transition-transform hover:scale-105 hover:z-10 animate-scale-up ${i%2===0 ? "rotate-2" : "-rotate-2"}`}>
                    <img src={img.url} alt="Gallery image" className="w-full h-64 object-cover border border-gray-100" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer / Contacts */}
          <footer className="py-32 px-6 text-center relative overflow-hidden bg-[#FDF5F5] border-t border-pink-100">
            <div className="relative z-10 animate-scale-up">
              <h2 className="text-4xl md:text-5xl font-cormorant font-semibold mb-12 text-[#5C4D4D]">We Cannot Wait to Celebrate!</h2>
              {(data.groomPhone || data.bridePhone) && (
                <div className="flex justify-center gap-6 flex-wrap font-cormorant text-xl">
                  {data.groomPhone && (
                    <TrackedLink eventType="GROOM_CONTACT" href={`tel:${data.groomPhone}`} className="px-8 py-3 bg-white text-[#8C6B6B] border border-pink-100 shadow-sm hover:shadow-md hover:text-[#5C4D4D] rounded-full transition-all">
                      RSVP Groom
                    </TrackedLink>
                  )}
                  {data.bridePhone && (
                    <TrackedLink eventType="BRIDE_CONTACT" href={`tel:${data.bridePhone}`} className="px-8 py-3 bg-white text-[#8C6B6B] border border-pink-100 shadow-sm hover:shadow-md hover:text-[#5C4D4D] rounded-full transition-all">
                      RSVP Bride
                    </TrackedLink>
                  )}
                </div>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
"""

with open("apps/web/src/templates/designs/floral-romance/index.tsx", "w", encoding="utf-8") as f:
    f.write(code)

