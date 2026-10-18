"use client";
import React, { useState, useRef } from "react";
import { TemplateRenderContext } from "../../types";
import { formatEventDate } from "../../utils/date";
import { Countdown } from "../../utils/Countdown";
import { TrackedLink } from "../../utils/TrackedLink";
import { RevealWrapper } from "../../utils/useScrollReveal";
import { FloatingElements } from "../../utils/FloatingElements";
import confetti from "canvas-confetti";

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const BotanicalRusticTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode }) => {
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
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#4A533E', '#8C7A5E', '#A3B19B', '#ffffff']
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

  const rawDate = data.weddingDate ? new Date(data.weddingDate) : new Date();
  const weddingDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const day = weddingDate.getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const emptyDays = (firstDay === 0 ? 6 : firstDay - 1);
  const calendarDays = Array.from({ length: 42 }).map((_, i) => {
    const dayNum = i - emptyDays + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const timelineEvents = [
    { time: custom.timeline1Time || "15:00", label: custom.timeline1Title || "Guest Arrival", icon: "M12 4.318l-1.318 1.318L8.414 3.371l1.586-1.586a2 2 0 012.828 0l1.586 1.586-2.268 2.265L12 4.318zm0 15.364l1.318-1.318 2.268 2.265-1.586 1.586a2 2 0 01-2.828 0l-1.586-1.586 2.268-2.265L12 19.682z" },
    { time: custom.timeline2Time || "16:00", label: custom.timeline2Title || "Ceremony", icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" },
    { time: custom.timeline3Time || "18:00", label: custom.timeline3Title || "Banquet", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { time: custom.timeline4Time || "20:30", label: custom.timeline4Title || "Dinner & Speeches", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="min-h-screen relative bg-[#F4F1EB] text-[#4A533E] font-serif overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Lato:wght@300;400;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-vibes { font-family: 'Great Vibes', cursive; }
        .font-lato { font-family: 'Lato', sans-serif; }
        
        .bg-paper {
          background-color: #F4F1EB;
          background-image: url("https://www.transparenttextures.com/patterns/cream-paper.png");
        }
        
        .torn-edge-bottom {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' preserveAspectRatio='none'%3E%3Cpath d='M0,0 v20 Q10,35 25,20 T50,20 T75,20 T100,20 T125,20 T150,20 T175,20 T200,20 T225,20 T250,20 T275,20 T300,20 T325,20 T350,20 T375,20 T400,20 T425,20 T450,20 T475,20 T500,20 T525,20 T550,20 T575,20 T600,20 T625,20 T650,20 T675,20 T700,20 T725,20 T750,20 T775,20 T800,20 T825,20 T850,20 T875,20 T900,20 T925,20 T950,20 T975,20 T1000,20 v-20 Z' fill='black'/%3E%3C/svg%3E");
          mask-size: 100% 100%;
        }

        .torn-edge-top {
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' preserveAspectRatio='none'%3E%3Cpath d='M0,40 v-20 Q10,5 25,20 T50,20 T75,20 T100,20 T125,20 T150,20 T175,20 T200,20 T225,20 T250,20 T275,20 T300,20 T325,20 T350,20 T375,20 T400,20 T425,20 T450,20 T475,20 T500,20 T525,20 T550,20 T575,20 T600,20 T625,20 T650,20 T675,20 T700,20 T725,20 T750,20 T775,20 T800,20 T825,20 T850,20 T875,20 T900,20 T925,20 T950,20 T975,20 T1000,20 v20 Z' fill='black'/%3E%3C/svg%3E");
          mask-size: 100% 100%;
        }

        /* Wax Seal */
        .wax-seal {
          background: radial-gradient(circle at 30% 30%, #8b1e1e 0%, #5a1010 100%);
          box-shadow: 
            inset 0 0 10px rgba(0,0,0,0.5), 
            0 4px 6px rgba(0,0,0,0.3),
            0 1px 2px rgba(255,255,255,0.2) inset;
          border-radius: 45% 55% 50% 50% / 55% 45% 50% 50%;
          position: relative;
        }
        .wax-seal::after {
          content: '';
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
        }
      `}} />

      {/* Hidden Audio */}
      {data.music && <audio ref={audioRef} src={data.music.url} loop />}

      {/* Welcome Envelope Overlay */}
      <div 
        className={`absolute inset-0 z-50 flex items-center justify-center bg-[#4A533E] transition-transform duration-[1.5s] ease-[cubic-bezier(0.8,0,0.2,1)] ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-overlay"></div>
        
        {/* Flap Graphic */}
        <div className="absolute top-0 w-full h-1/2 border-b border-[#F4F1EB]/10 z-0 bg-[#3A4230] rounded-b-[50%_20%] opacity-50 shadow-2xl"></div>
        
        <div className="relative z-10 bg-[#F4F1EB] p-12 max-w-sm w-11/12 text-center rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#A3B19B]/30 transform transition-transform duration-700 hover:scale-[1.02]">
          
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 wax-seal flex items-center justify-center z-20 cursor-pointer" onClick={handleOpen}>
            <span className="font-playfair text-xl text-[#F4F1EB]/80">
              {(data.groomName || 'G').trim().charAt(0)}
            </span>
          </div>

          <h3 className="font-lato tracking-[0.2em] uppercase text-xs text-[#8C7A5E] mb-2 mt-4">{custom.welcomeHeader || "You Are Invited"}</h3>
          <h1 className="text-4xl font-playfair text-[#4A533E] my-6">
            {data.groomName} <br/><span className="font-vibes text-3xl text-[#8C7A5E] my-2 block">&amp;</span> {data.brideName}
          </h1>
          <button 
            onClick={handleOpen}
            className="mt-8 w-full py-4 bg-[#4A533E] text-[#F4F1EB] font-lato text-sm tracking-widest uppercase hover:bg-[#3A4230] transition-all duration-300 cursor-pointer flex justify-center items-center gap-3 shadow-lg"
          >
            Open Invitation
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`h-screen overflow-y-auto overflow-x-hidden transition-opacity duration-1000 bg-paper ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Replay Entrance Button */}
        {isOpen && (
          <button
            onClick={handleReset}
            title="إعادة غلق المظروف لتجربة الحركة مجدداً"
            className="fixed top-6 left-6 z-50 px-3.5 py-1.5 rounded-full bg-[#F4F1EB] border border-[#A3B19B] text-xs font-lato font-semibold text-[#4A533E] shadow-sm hover:bg-[#EAE5D9] flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
          >
            <span>🔄</span>
            <span>Replay Entrance</span>
          </button>
        )}

        {data.music && (
          <button 
            onClick={toggleAudio}
            className="fixed top-6 right-6 z-50 w-12 h-12 bg-[#F4F1EB] border border-[#A3B19B] rounded-full flex items-center justify-center text-[#4A533E] hover:bg-[#EAE5D9] transition-all cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            )}
          </button>
        )}

        <div className="relative z-10 w-full max-w-xl mx-auto shadow-[0_0_50px_rgba(0,0,0,0.1)] bg-paper min-h-screen">
          
          <div className="absolute top-0 left-0 w-full h-40 opacity-50 mix-blend-multiply bg-[url('https://cdn.pixabay.com/photo/2016/12/27/18/12/watercolor-1934521_1280.png')] bg-cover bg-center pointer-events-none z-20" style={{ transform: 'rotate(180deg)' }}></div>

          {/* Hero Section */}
          <section className="pt-32 pb-16 px-8 text-center flex flex-col items-center relative z-10">
            <RevealWrapper delay={300}>
              <h3 className="font-lato tracking-[0.2em] uppercase text-xs text-[#4A533E] mb-6">{custom.welcomeSubtitle || "Together with their families"}</h3>
            </RevealWrapper>
            
            <RevealWrapper delay={400}>
              <svg className="w-4 h-4 text-[#8C7A5E] mb-8 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </RevealWrapper>

            <RevealWrapper delay={500}>
              <h1 className="text-5xl md:text-6xl font-playfair text-[#4A533E] leading-tight mb-2 uppercase">
                {data.groomName}
              </h1>
            </RevealWrapper>
            <RevealWrapper delay={600}>
              <div className="font-vibes text-4xl text-[#8C7A5E] my-1">and</div>
            </RevealWrapper>
            <RevealWrapper delay={700}>
              <h1 className="text-5xl md:text-6xl font-playfair text-[#4A533E] leading-tight mb-8 uppercase">
                {data.brideName}
              </h1>
            </RevealWrapper>

            <RevealWrapper delay={800}>
              <p className="font-lato tracking-widest text-xs uppercase text-[#4A533E] mb-4">Invite you to their</p>
              <p className="font-vibes text-5xl text-[#8C7A5E] mb-12">Wedding</p>
            </RevealWrapper>

            {data.coverImage && (
              <RevealWrapper delay={900}>
                <div className="relative mb-12 w-64 h-[400px] mx-auto group">
                  <div className="absolute -inset-4 border border-[#A3B19B] rounded-t-full rounded-b-xl z-0 transition-transform duration-700 group-hover:scale-105"></div>
                  <img 
                    src={data.coverImage.url} 
                    alt="Couple" 
                    className="w-full h-full object-cover rounded-t-full rounded-b-xl border-4 border-[#F4F1EB] shadow-lg relative z-10" 
                  />
                </div>
              </RevealWrapper>
            )}

            <RevealWrapper>
              <h2 className="font-vibes text-4xl text-[#8C7A5E] mb-2">We are getting</h2>
              <h3 className="font-playfair text-3xl tracking-[0.2em] text-[#4A533E] uppercase mb-6">Married</h3>
              
              <svg className="w-4 h-4 text-[#8C7A5E] mb-6 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </RevealWrapper>

            {data.weddingMessage && (
              <RevealWrapper>
                <p className="font-lato text-sm font-light text-[#4A533E] max-w-xs mx-auto leading-relaxed mb-16 text-center">
                  {data.weddingMessage}
                </p>
              </RevealWrapper>
            )}

            <RevealWrapper>
              <h3 className="font-playfair tracking-[0.2em] text-[#8C7A5E] uppercase mb-4">Save the Date</h3>
              <p className="text-3xl font-playfair text-[#4A533E] tracking-widest mb-2">
                {String(day).padStart(2, '0')} . {String(month + 1).padStart(2, '0')} . {year}
              </p>
              <p className="font-lato text-xs tracking-[0.2em] uppercase text-[#4A533E] mb-8">
                {weddingDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </RevealWrapper>

            <RevealWrapper delay={200}>
              <div className="w-full max-w-xs mx-auto mb-16">
                <div className="grid grid-cols-7 gap-y-4 text-center mb-4 border-b border-[#A3B19B]/50 pb-2">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                    <div key={d} className="font-lato text-[10px] tracking-wider text-[#8C7A5E] uppercase">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-4 text-center font-playfair text-sm text-[#4A533E]">
                  {calendarDays.map((d, i) => (
                    <div key={i} className="relative flex justify-center items-center h-6">
                      {d === day ? (
                        <div className="absolute w-8 h-8 bg-[#4A533E] text-[#F4F1EB] rounded-full flex items-center justify-center shadow-md">
                          {d}
                        </div>
                      ) : (
                        <span>{d}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </RevealWrapper>
          </section>

          <div className="w-full h-12 bg-[#4A533E] torn-edge-top -mb-1 relative z-20"></div>

          <section className="bg-[#4A533E] py-16 px-8 text-center text-[#F4F1EB] relative z-10">
            <RevealWrapper>
              <h3 className="font-playfair tracking-[0.2em] uppercase text-xl mb-4 text-[#8C7A5E]">{custom.dressCodeTitle || "Dress Code"}</h3>
              <svg className="w-4 h-4 text-[#8C7A5E] mb-8 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>

              <div className="flex justify-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-full bg-[#F4F1EB] border-2 border-white/20 shadow-md transform hover:-translate-y-1 transition-transform"></div>
                <div className="w-8 h-8 rounded-full bg-[#A3B19B] border-2 border-white/20 shadow-md transform hover:-translate-y-1 transition-transform"></div>
                <div className="w-8 h-8 rounded-full bg-[#4A533E] border-2 border-white/40 shadow-inner transform hover:-translate-y-1 transition-transform"></div>
                <div className="w-8 h-8 rounded-full bg-[#8C7A5E] border-2 border-white/20 shadow-md transform hover:-translate-y-1 transition-transform"></div>
                <div className="w-8 h-8 rounded-full bg-[#2C3E2D] border-2 border-white/20 shadow-md transform hover:-translate-y-1 transition-transform"></div>
              </div>
            </RevealWrapper>

            <RevealWrapper delay={200}>
              <p className="font-lato text-sm font-light leading-relaxed max-w-xs mx-auto mb-12 text-[#EAE5D9]">
                {custom.giftNote || "Our most important gift is your presence. However, if you wish to honour us with a gift, a contribution towards our honeymoon would be appreciated."}
              </p>
            </RevealWrapper>

            <RevealWrapper delay={400}>
              <div className="text-4xl text-[#8C7A5E] font-playfair mb-4">“</div>
              <p className="font-playfair italic text-sm max-w-xs mx-auto text-[#A3B19B]">
                {custom.quoteText || "A successful marriage requires falling in love many times, always with the same person."}
              </p>
            </RevealWrapper>
          </section>

          <div className="w-full h-12 bg-[#4A533E] torn-edge-bottom -mt-1 relative z-20"></div>

          <section className="py-20 px-8 bg-paper">
            <RevealWrapper>
              <h2 className="text-3xl font-playfair text-center text-[#4A533E] tracking-widest uppercase mb-2">Wedding</h2>
              <h3 className="font-vibes text-5xl text-center text-[#8C7A5E] mb-6">Program</h3>
              <svg className="w-4 h-4 text-[#8C7A5E] mb-12 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </RevealWrapper>

            <div className="relative max-w-xs mx-auto">
              <div className="absolute left-[39px] top-0 bottom-0 w-[1px] bg-[#8C7A5E]/30"></div>
              
              <div className="space-y-12">
                {timelineEvents.map((event, idx) => (
                  <RevealWrapper key={idx} delay={idx * 150} direction="left" distance={20}>
                    <div className="flex items-center gap-8 relative z-10 group">
                      <div className="w-20 h-20 rounded-full bg-[#4A533E] text-[#F4F1EB] flex items-center justify-center shrink-0 shadow-lg border-4 border-[#F4F1EB] group-hover:bg-[#8C7A5E] transition-colors duration-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={event.icon} />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-playfair text-xl text-[#4A533E] font-bold">{event.time}</h4>
                        <p className="font-lato text-sm text-[#8C7A5E] uppercase tracking-wide mt-1">{event.label}</p>
                      </div>
                    </div>
                  </RevealWrapper>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 px-8 text-center bg-white border-y border-[#A3B19B]/30 relative">
            <RevealWrapper>
              <h2 className="font-playfair tracking-[0.2em] uppercase text-2xl text-[#4A533E] mb-4">Venue</h2>
              <svg className="w-4 h-4 text-[#8C7A5E] mb-10 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </RevealWrapper>

            <RevealWrapper delay={200}>
              {data.galleryImages && data.galleryImages[0] ? (
                <img src={data.galleryImages[0].url} alt="Venue" className="w-full h-64 object-cover rounded-sm mb-10 shadow-lg border-4 border-[#F4F1EB] hover:scale-[1.02] transition-transform duration-700" />
              ) : (
                <div className="w-full h-64 bg-[#EAE5D9] rounded-sm mb-10 shadow-md border-4 border-[#F4F1EB] flex items-center justify-center">
                  <span className="font-playfair text-[#A3B19B] italic">Venue Photo</span>
                </div>
              )}
            </RevealWrapper>

            <RevealWrapper delay={300}>
              <h3 className="font-vibes text-5xl text-[#8C7A5E] mb-4">{data.venueName}</h3>
              {data.venueAddress && (
                <p className="font-lato text-sm text-[#4A533E] max-w-xs mx-auto mb-8 uppercase tracking-widest leading-loose">
                  {data.venueAddress}
                </p>
              )}
            </RevealWrapper>

            {data.googleMapsUrl && (
              <RevealWrapper delay={400}>
                <TrackedLink 
                  eventType="MAP_CLICK"
                  href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                  target={mode === "PREVIEW" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="inline-block px-10 py-4 bg-[#4A533E] text-[#F4F1EB] font-lato text-xs tracking-widest uppercase hover:bg-[#3A4230] hover:shadow-lg transition-all duration-300 shadow-md rounded-sm"
                >
                  View on Map
                </TrackedLink>
              </RevealWrapper>
            )}
          </section>

          {data.galleryImages && data.galleryImages.length > 0 && (
            <section className="py-20 px-4 text-center bg-paper">
              <RevealWrapper>
                <h2 className="font-playfair tracking-[0.2em] uppercase text-2xl text-[#4A533E] mb-4">Gallery</h2>
                <svg className="w-4 h-4 text-[#8C7A5E] mb-10 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </RevealWrapper>

              <div className="grid grid-cols-2 gap-2 mb-8">
                {data.galleryImages.slice(0,4).map((img, i) => (
                  <RevealWrapper key={i} delay={i * 200}>
                    <div className={`overflow-hidden rounded-sm group ${i === 0 ? 'row-span-2 col-span-1 h-full' : 'h-32'}`}>
                      <img src={img.url} alt="Gallery" className="w-full h-full object-cover border-2 border-white group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </RevealWrapper>
                ))}
              </div>
            </section>
          )}

          <footer className="relative py-32 px-8 text-center bg-[#4A533E] text-[#F4F1EB] overflow-hidden">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            {data.coverImage && (
              <div className="absolute inset-0 z-0">
                <img src={data.coverImage.url} alt="Footer BG" className="w-full h-full object-cover blur-sm opacity-60" />
              </div>
            )}
            
            <div className="relative z-20">
              <RevealWrapper>
                <h2 className="font-vibes text-7xl text-[#F4F1EB] mb-4 drop-shadow-lg">{custom.closingTitle || "Thank You!"}</h2>
                <p className="font-lato text-sm tracking-widest uppercase mb-8 opacity-90 drop-shadow-md">{custom.closingSubtitle || "We can't wait to celebrate with you!"}</p>
                <svg className="w-6 h-6 text-[#8C7A5E] mx-auto drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </RevealWrapper>

              {(data.groomPhone || data.bridePhone) && (
                <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6 flex-wrap">
                  {data.groomPhone && (
                    <RevealWrapper delay={200} direction="up">
                      <a 
                        href={`https://wa.me/${data.groomPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                        target="_blank"
                        className="px-8 py-4 bg-[#25D366] text-white font-lato text-xs tracking-widest uppercase rounded-sm shadow-xl hover:bg-[#1ebd5a] transition-all flex items-center gap-2 font-bold"
                      >
                        WhatsApp Groom
                      </a>
                    </RevealWrapper>
                  )}
                  {data.bridePhone && (
                    <RevealWrapper delay={400} direction="up">
                      <a 
                        href={`https://wa.me/${data.bridePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Congratulations! Confirming RSVP for the wedding of ${data.groomName} & ${data.brideName}`)}`}
                        target="_blank"
                        className="px-8 py-4 bg-[#E1306C] text-white font-lato text-xs tracking-widest uppercase rounded-sm shadow-xl hover:bg-[#c9265e] transition-all flex items-center gap-2 font-bold"
                      >
                        WhatsApp Bride
                      </a>
                    </RevealWrapper>
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
