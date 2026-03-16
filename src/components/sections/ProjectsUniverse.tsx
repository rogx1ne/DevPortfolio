import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '../../data/projects';
import Magnetic from '../effects/Magnetic';

export default function ProjectsUniverse() {
  return (
    <section id="projects" className="relative min-h-screen py-24 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-right"
        >
          <h2 className="text-2xl md:text-3xl font-display text-white mb-4 flex items-center justify-end gap-4 uppercase">
            Projects Universe <span className="text-cyan-400">.03</span>
          </h2>
          <div className="h-1 w-32 bg-cyan-500 ml-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <Magnetic key={project.id} strength={0.05}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative h-full"
              >
                <div className="relative bg-black pixel-border hover:bg-cyan-950 pixel-shadow-hover transition-none p-6 md:p-8 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-cyan-500 border-2 border-white flex items-center justify-center`}>
                      <span className="text-white font-display text-lg md:text-xl">{project.title.charAt(0)}</span>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                      <a href={project.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-none z-10 bg-black border-2 border-slate-700 hover:border-white p-1.5 md:p-2">
                        <Github className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                      <a href={project.demo} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-none z-10 bg-black border-2 border-slate-700 hover:border-cyan-400 p-1.5 md:p-2">
                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-display text-white mb-3 md:mb-4 group-hover:text-cyan-300 transition-none uppercase leading-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-400 leading-relaxed mb-6 md:mb-8 flex-grow font-mono text-sm md:text-base">
                    {project.description}
                  </p>

                  <ul className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((tech) => (
                      <li key={tech} className="text-xs font-mono text-cyan-300 bg-black px-3 py-1 border-2 border-cyan-500 uppercase">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}
