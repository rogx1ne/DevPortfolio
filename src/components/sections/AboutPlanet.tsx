import { motion } from 'motion/react';
import { User, Code, Globe } from 'lucide-react';
import Magnetic from '../effects/Magnetic';

export default function AboutPlanet() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
      {/* Background Planet with Energy Pulse */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, boxShadow: "0 0 0px rgba(79, 70, 229, 0)" }}
        whileInView={{ 
          scale: 1, 
          opacity: 1, 
          boxShadow: [
            "0 0 0px rgba(79, 70, 229, 0)", 
            "0 0 0px rgba(79, 70, 229, 1)", 
            "10px 10px 0px rgba(79, 70, 229, 0.5)"
          ] 
        }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 2, ease: "linear" }}
        className="absolute right-[-10%] top-[20%] w-[400px] h-[400px] bg-indigo-900 pointer-events-none opacity-50 pixel-border"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display text-white mb-4 flex items-center gap-4 uppercase">
              <span className="text-indigo-400">01.</span> Origin Planet
            </h2>
            <div className="h-1 w-32 bg-indigo-500" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Magnetic strength={0.05}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-black pixel-border p-6 md:p-8 hover:bg-indigo-950 pixel-shadow-hover transition-none"
              >
                <p className="text-slate-300 leading-relaxed mb-6 font-mono text-sm md:text-base">
                  Hello! I'm Abhishek Aditya Jeremy, a Software Developer and BCA student at Arcade Business College, Rajendra Nagar (2023-present). My journey into software development started with a deep curiosity about how systems are architected and scaled.
                </p>
                <p className="text-slate-300 leading-relaxed font-mono text-sm md:text-base">
                  Fast-forward to today, I've built robust desktop applications like a Library Management System and privacy-focused web apps like JournaLOG. I'm also certified in Artificial Intelligence Fundamentals by IBM SkillsBuild, and I continuously expand my knowledge across the stack.
                </p>
              </motion.div>
            </Magnetic>

            <div className="space-y-6">
              {[
                { icon: User, title: "Curious Explorer", desc: "Always learning new technologies and frameworks." },
                { icon: Code, title: "Clean Code Advocate", desc: "Writing maintainable, scalable, and efficient code." },
                { icon: Globe, title: "Global Perspective", desc: "Building applications for a diverse, worldwide audience." }
              ].map((item, i) => (
                <Magnetic key={i} strength={0.1}>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-black pixel-border hover:bg-indigo-900 pixel-shadow-hover transition-none cursor-default"
                  >
                    <div className="p-3 bg-indigo-500 text-white border-2 border-white shrink-0">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-display text-[10px] md:text-xs mb-1 md:mb-2 uppercase leading-tight">{item.title}</h3>
                      <p className="text-xs md:text-sm text-slate-400 font-mono">{item.desc}</p>
                    </div>
                  </motion.div>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
