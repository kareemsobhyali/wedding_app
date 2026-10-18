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

export const ModernMinimalistTemplate: React.FC<TemplateRenderContext> = ({ data, direction, mode, metadata }) => {
  const dirClass = direction === "RTL" ? "rtl" : "ltr";

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className={\`min-h-screen relative bg-white text-black font-sans \${dirClass}\`} dir={direction === "RTL" ? "rtl" : "ltr"}>
      <style dangerouslySetInnerHTML={{__html: \`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Montserrat:wght@200;300;400;600&display=swap");
        .font-inter { font-family: "Inter", sans-serif; }
        .font-montserrat { font-family: "Montserrat", sans-serif; }
      \`}} />

      {data.music && <AudioPlayer url={data.music.url} />}
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col md:flex-row">
        {data.coverImage && (
          <motion.div 
            className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-black/10 z-10"></div>
            <img 
              src={data.coverImage.url} 
              alt={data.coverImage.alt || "Cover"} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
        
        <div className={\`w-full \${data.coverImage ? "md:w-1/2" : "md:w-full"} h-[50vh] md:h-screen flex flex-col justify-center items-center md:items-start p-12 md:p-24 bg-white z-20\`}>
          <motion.div initial="hidden" animate="visible" variants={slideUp} className="max-w-lg">
            <h3 className="font-inter tracking-[0.3em] uppercase text-xs text-gray-400 mb-8 md:mb-12">We are getting married</h3>
            <h1 className="text-5xl md:text-7xl mb-6 font-montserrat font-light tracking-tighter leading-none">
              {data.groomName} <br/><span className="text-gray-300 font-inter font-thin">&</span><br/> {data.brideName}
            </h1>
            <p className="text-lg md:text-xl font-inter text-gray-500 font-light mt-8">
              {formatEventDate(data.weddingDate, direction)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-8 md:px-24 bg-gray-50 flex flex-col items-center md:items-start">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideUp} className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-16 justify-between">
          <div className="flex-1">
             <h2 className="text-3xl font-montserrat font-light mb-8 tracking-tight">The Celebration</h2>
             {data.weddingMessage && (
               <p className="text-xl leading-relaxed font-inter font-light text-gray-600 mb-12 border-l-2 border-black pl-6">
                 {data.weddingMessage}
               </p>
             )}
          </div>
          
          <div className="flex-1 bg-white p-12 border border-gray-100">
            <h3 className="text-sm font-inter uppercase tracking-[0.2em] text-gray-400 mb-4">Location</h3>
            <h4 className="text-2xl font-montserrat font-light mb-2">{data.venueName}</h4>
            {data.venueAddress && <p className="text-gray-500 font-inter font-light mb-10 leading-relaxed">{data.venueAddress}</p>}
            
            {data.googleMapsUrl && (
              <TrackedLink 
                eventType="MAP_CLICK"
                href={mode === "PREVIEW" ? "#" : data.googleMapsUrl}
                target={mode === "PREVIEW" ? undefined : "_blank"}
                rel="noreferrer"
                className="inline-block px-8 py-3 bg-black text-white font-inter text-sm font-medium hover:bg-gray-800 transition-colors rounded-full"
              >
                Get Directions
              </TrackedLink>
            )}
          </div>
        </motion.div>
      </section>
      
      {/* Countdown Section */}
      {data.countdownEnabled && (
        <section className="py-24 bg-black text-white px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="max-w-4xl mx-auto text-center">
             <h3 className="font-inter tracking-[0.2em] uppercase text-xs text-gray-400 mb-12">Counting Down</h3>
             <Countdown date={data.weddingDate} time={data.weddingTime} />
          </motion.div>
        </section>
      )}

      {/* Optional Gallery */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <section className="py-24 px-4 max-w-[1400px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {data.galleryImages.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i%3) * 0.2, duration: 0.8 }}
                  className="break-inside-avoid relative group"
                >
                  <img 
                    src={img.url} 
                    alt={img.alt || "Gallery"} 
                    className="w-full h-auto object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer / Contacts */}
      <footer className="py-32 px-8 text-center bg-gray-50 border-t border-gray-200">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-montserrat font-light tracking-tight mb-16">Join us on our special day</h2>
          {(data.groomPhone || data.bridePhone) && (
            <div className="flex justify-center gap-4 flex-wrap font-inter">
              {data.groomPhone && (
                <TrackedLink eventType="GROOM_CONTACT" href={\`tel:\${data.groomPhone}\`} className="px-8 py-4 bg-gray-100 text-black hover:bg-black hover:text-white transition-all rounded-full text-sm font-medium">
                  RSVP to Groom
                </TrackedLink>
              )}
              {data.bridePhone && (
                <TrackedLink eventType="BRIDE_CONTACT" href={\`tel:\${data.bridePhone}\`} className="px-8 py-4 bg-gray-100 text-black hover:bg-black hover:text-white transition-all rounded-full text-sm font-medium">
                  RSVP to Bride
                </TrackedLink>
              )}
            </div>
          )}
          
          {metadata.supportedFeatures.includes("SHARE") && (
            <div className="mt-24">
              <ShareWidget mode={mode} />
            </div>
          )}
        </motion.div>
      </footer>

      {/* Preview Banner */}
      {mode === "PREVIEW" && (
        <div className="fixed top-0 left-0 w-full bg-black text-white text-center py-2 text-xs tracking-widest z-50">
          PREVIEW MODE
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync("apps/web/src/templates/designs/modern-minimalist/index.tsx", newCode);

