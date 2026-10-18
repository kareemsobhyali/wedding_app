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

export const FloralRomanceTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode, metadata }) => {
  const dirClass = direction === "RTL" ? "rtl" : "ltr";

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className={\`min-h-screen relative bg-[#FFF9F9] text-[#5C4D4D] font-serif \${dirClass}\`} dir={direction === "RTL" ? "rtl" : "ltr"}>
      <style dangerouslySetInnerHTML={{__html: \`
        @import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap");
        .font-vibes { font-family: "Great Vibes", cursive; }
        .font-cormorant { font-family: "Cormorant Garamond", serif; }
        .floral-bg {
          background-image: url("https://www.transparenttextures.com/patterns/floral-motif.png");
        }
      \`}} />

      {data.music && <AudioPlayer url={data.music.url} />}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 floral-bg">
        <div className="absolute top-0 left-0 w-64 h-64 opacity-40 mix-blend-multiply bg-[url('https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png')] bg-contain bg-no-repeat -scale-x-100"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-40 mix-blend-multiply bg-[url('https://cdn.pixabay.com/photo/2017/08/17/08/19/watercolor-2650117_1280.png')] bg-contain bg-no-repeat rotate-180"></div>
        
        {data.coverImage && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="mb-12 rounded-full overflow-hidden w-64 h-64 md:w-96 md:h-96 border-8 border-white shadow-2xl relative z-10"
          >
            <img 
              src={data.coverImage.url} 
              alt={data.coverImage.alt || "Cover"} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
        
        <motion.div className="relative z-20 max-w-2xl bg-white/50 p-8 rounded-3xl backdrop-blur-sm border border-pink-50" initial="hidden" animate="visible" variants={scaleUp}>
          <h3 className="font-cormorant tracking-[0.2em] uppercase text-sm text-[#B38B8B] mb-4">Together with their families</h3>
          <h1 className="text-6xl md:text-8xl mb-2 font-vibes text-[#8C6B6B]">
            {data.groomName}
          </h1>
          <div className="text-3xl text-[#D4B5B5] my-2 font-cormorant italic">&amp;</div>
          <h1 className="text-6xl md:text-8xl mb-8 font-vibes text-[#8C6B6B]">
            {data.brideName}
          </h1>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4B5B5] to-transparent mx-auto mb-6"></div>
          <p className="text-2xl font-cormorant italic text-[#7A6363]">
            {formatEventDate(data.weddingDate, direction)}
          </p>
        </motion.div>
      </section>

      {/* Countdown Section */}
      {data.countdownEnabled && (
        <section className="py-20 bg-gradient-to-b from-[#FFF9F9] to-[#FDF5F5] relative border-y border-pink-100/50">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="max-w-4xl mx-auto text-center">
             <div className="scale-110"><Countdown date={data.weddingDate} time={data.weddingTime} /></div>
          </motion.div>
        </section>
      )}

      {/* Details Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl font-vibes mb-12 text-[#8C6B6B]">When &amp; Where</h2>
          
          <div className="bg-white p-16 rounded-[40px] shadow-xl shadow-pink-900/5 border border-pink-50 relative">
            <div className="absolute top-4 left-4 w-12 h-12 opacity-30 bg-[url('https://cdn.pixabay.com/photo/2016/12/27/18/12/watercolor-1934521_1280.png')] bg-contain bg-no-repeat"></div>
            <h3 className="text-3xl font-cormorant font-semibold mb-4 text-[#5C4D4D]">{data.venueName}</h3>
            {data.venueAddress && <p className="text-xl font-cormorant text-[#7A6363] mb-10">{data.venueAddress}</p>}
            
            {data.googleMapsUrl && (
              <TrackedLink 
                eventType="MAP_CLICK"
                href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                target={mode === "PREVIEW" ? undefined : "_blank"}
                rel="noreferrer"
                className="inline-block px-10 py-3 bg-[#B38B8B] text-white font-cormorant text-lg hover:bg-[#8C6B6B] transition-colors rounded-full shadow-md"
              >
                Get Directions
              </TrackedLink>
            )}
          </div>
        </motion.div>
      </section>

      {/* Optional Message */}
      {data.weddingMessage && (
        <section className="py-20 px-6 bg-[#FDF5F5] text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="max-w-2xl mx-auto">
            <p className="text-3xl leading-relaxed italic font-cormorant text-[#7A6363]">
              {data.weddingMessage}
            </p>
          </motion.div>
        </section>
      )}

      {/* Optional Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp}>
            <h2 className="text-5xl font-vibes text-center mb-16 text-[#8C6B6B]">Captured Moments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.galleryImages.map((img, i) => (
                <div key={i} className={\`bg-white p-4 pb-12 shadow-xl shadow-pink-900/10 transform transition-transform hover:scale-105 hover:-rotate-1 \${i%2===0 ? "rotate-2" : "-rotate-2"}\`}>
                  <img src={img.url} alt={img.alt || "Gallery image"} className="w-full h-72 object-cover border border-gray-100" />
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer / Contacts */}
      <footer className="py-24 px-6 text-center relative overflow-hidden floral-bg">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="relative z-10">
          <h2 className="text-4xl font-cormorant font-semibold mb-12 text-[#5C4D4D]">We Cannot Wait to Celebrate!</h2>
          {(data.groomPhone || data.bridePhone) && (
            <div className="flex justify-center gap-6 flex-wrap font-cormorant text-xl">
              {data.groomPhone && (
                <TrackedLink eventType="GROOM_CONTACT" href={\`tel:\${data.groomPhone}\`} className="px-8 py-3 bg-white text-[#8C6B6B] border border-pink-100 shadow-sm hover:shadow-md hover:text-[#5C4D4D] rounded-full transition-all">
                  RSVP Groom
                </TrackedLink>
              )}
              {data.bridePhone && (
                <TrackedLink eventType="BRIDE_CONTACT" href={\`tel:\${data.bridePhone}\`} className="px-8 py-3 bg-white text-[#8C6B6B] border border-pink-100 shadow-sm hover:shadow-md hover:text-[#5C4D4D] rounded-full transition-all">
                  RSVP Bride
                </TrackedLink>
              )}
            </div>
          )}
          
          {metadata.supportedFeatures.includes("SHARE") && (
            <div className="mt-16">
              <ShareWidget mode={mode} />
            </div>
          )}
        </motion.div>
      </footer>

      {/* Preview Banner */}
      {mode === "PREVIEW" && (
        <div className="fixed top-0 left-0 w-full bg-pink-500 text-white text-center py-2 text-sm z-50 shadow-md font-semibold font-cormorant tracking-widest uppercase">
          Preview Mode
        </div>
      )}
    </div>
  );
};`;
fs.writeFileSync("apps/web/src/templates/designs/floral-romance/index.tsx", newCode);
