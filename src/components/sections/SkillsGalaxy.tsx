import { motion } from 'motion/react';
import { skills } from '../../data/skills';

export default function SkillsGalaxy() {
  const categories = Object.keys(skills) as (keyof typeof skills)[];

  return (
    <section id="skills" className="relative min-h-screen py-24 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-display text-white mb-4 uppercase">
            <span className="text-indigo-400">02.</span> Skills Galaxy
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm md:text-lg uppercase">
            A constellation of technologies I've mastered over the years.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative bg-black pixel-border p-5 md:p-6 h-full flex flex-col hover:bg-indigo-950 pixel-shadow-hover transition-none">
                <h3 className="text-base md:text-lg font-display text-white uppercase mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                  <span className="w-2 h-2 md:w-3 md:h-3 bg-indigo-400 border-2 border-white" />
                  {category}
                </h3>
                
                <div className="space-y-4 md:space-y-6 flex-grow">
                  {skills[category].map((skill, i) => (
                    <div key={skill.name} className="relative font-mono">
                      <div className="flex justify-between text-xs md:text-sm mb-1.5 md:mb-2 uppercase">
                        <span className="text-slate-300">{skill.name}</span>
                        <span className="text-indigo-400">{skill.level}%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-900 border-2 border-slate-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "linear" }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
