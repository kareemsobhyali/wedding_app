const fs = require("fs");

const newCode = `"use client";
import React from "react";
import { TemplateRenderContext } from "../../types";
import { formatEventDate } from "../../utils/date";
import { Countdown } from "../../utils/Countdown";
import { AudioPlayer } from "../../utils/AudioPlayer";
import { ShareWidget } from "../../utils/ShareWidget";
import { TrackedLink } from "../../utils/TrackedLink";
import { motion } from "framer-motion";

export const ClassicEleganceTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode, metadata }) => {
  const dirClass = direction === "RTL" ? "rtl" : "ltr";

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className={\`min-h-screen relative bg-[#FDFBF7] text-[#2C3E2D] font-serif \${dirClass}\`} dir={direction === "RTL" ? "rtl" : "ltr"}>
      <style dangerouslySetInnerHTML={{__html: \`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap");
        .font-playfair { font-family: "Playfair Display", serif; }
        .font-lato { font-family: "Lato", sans-serif; }
      \`}} />

      {data.music && <AudioPlayer url={data.music.url} />}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        {data.coverImage ? (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src={data.coverImage.url} 
              alt={data.coverImage.alt || "Cover"} 
              className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#EAE3D2] to-[#FDFBF7]"></div>
        )}
        
        <motion.div 
          className={\`relative z-20 p-12 md:p-24 border border-white/20 backdrop-blur-sm \${data.coverImage ? "text-white" : "text-[#2C3E2D]"}\`}
          initial="hidden" animate="visible" variants={fadeIn}
        >
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 1.2 }}>
            <h1 className="text-6xl md:text-8xl mb-6 font-playfair tracking-wide font-medium">
              {data.groomName} <span className="text-3xl md:text-5xl mx-4 italic font-light text-[#CBA365]">&</span> {data.brideName}
            </h1>
          </motion.div>
          <div className="w-24 h-[1px] bg-[#CBA365] mx-auto mb-6"></div>
          <p className="text-xl md:text-3xl italic font-playfair tracking-widest uppercase">
            {formatEventDate(data.weddingDate, direction)}
          </p>
        </motion.div>
      </section>

      {/* Countdown Section */}
      {data.countdownEnabled && (
        <section className="py-16 bg-[#2C3E2D] text-[#EAE3D2]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-4xl mx-auto px-6 text-center">
             <h3 className="font-lato tracking-[0.2em] uppercase text-sm mb-8 text-[#CBA365]">Save The Date</h3>
             <div className="scale-125"><Countdown date={data.weddingDate} time={data.weddingTime} /></div>
          </motion.div>
        </section>
      )}

      {/* Details Section */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
          <div className="text-[#CBA365] mb-6">?</div>
          <h2 className="text-4xl md:text-5xl font-playfair mb-12 text-[#2C3E2D]">The Wedding</h2>
          
          <div className="bg-white p-12 shadow-xl shadow-stone-200/50 rounded-sm border border-stone-100">
            <h3 className="text-2xl font-playfair mb-2">{data.venueName}</h3>
            {data.venueAddress && <p className="text-lg font-lato text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">{data.venueAddress}</p>}
            
            {data.googleMapsUrl && (
              <TrackedLink 
                eventType="MAP_CLICK"
                href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                target={mode === "PREVIEW" ? undefined : "_blank"}
                rel="noreferrer"
                className="inline-block px-10 py-4 bg-[#2C3E2D] text-[#EAE3D2] font-lato uppercase tracking-widest text-sm hover:bg-[#CBA365] hover:text-white transition-all duration-300"
              >
                View on Map
              </TrackedLink>
            )}
          </div>
        </motion.div>
      </section>

      {/* Optional Message */}
      {data.weddingMessage && (
        <section className="py-24 px-6 bg-[#EAE3D2]/30 text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-3xl mx-auto relative z-10">
            <span className="text-8xl text-[#CBA365] opacity-20 absolute -top-12 left-0 right-0">"</span>
            <p className="text-2xl md:text-4xl leading-relaxed italic font-playfair text-[#2C3E2D] py-8">
              {data.weddingMessage}
            </p>
          </motion.div>
        </section>
      )}

      {/* Optional Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <section className="py-32 px-6 max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair mb-4 text-[#2C3E2D]">Memories</h2>
              <div className="w-16 h-[1px] bg-[#CBA365] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.galleryImages.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="overflow-hidden group shadow-lg"
                >
                  <img 
                    src={img.url} 
                    alt={img.alt || "Gallery image"} 
                    className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer / Contacts */}
      <footer className="py-20 px-6 text-center bg-[#2C3E2D] text-[#EAE3D2]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-3xl font-playfair mb-12 text-[#CBA365]">We look forward to celebrating with you!</h2>
          {(data.groomPhone || data.bridePhone) && (
            <div className="flex justify-center gap-6 flex-wrap font-lato">
              {data.groomPhone && (
                <TrackedLink eventType="GROOM_CONTACT" href={\`tel:\${data.groomPhone}\`} className="px-8 py-3 border border-[#CBA365] text-[#CBA365] hover:bg-[#CBA365] hover:text-white transition-all">
                  Contact Groom
                </TrackedLink>
              )}
              {data.bridePhone && (
                <TrackedLink eventType="BRIDE_CONTACT" href={\`tel:\${data.bridePhone}\`} className="px-8 py-3 border border-[#CBA365] text-[#CBA365] hover:bg-[#CBA365] hover:text-white transition-all">
                  Contact Bride
                </TrackedLink>
              )}
            </div>
          )}
          
          {metadata.supportedFeatures.includes("SHARE") && (
            <div className="mt-16 pt-16 border-t border-white/10">
              <ShareWidget mode={mode} />
            </div>
          )}
        </motion.div>
      </footer>

      {/* Preview Banner */}
      {mode === "PREVIEW" && (
        <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-center py-2 text-sm z-50 shadow-md font-bold font-lato uppercase tracking-wider">
          Preview Mode
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync("apps/web/src/templates/designs/classic-elegance/index.tsx", newCode);

