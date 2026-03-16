import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Github, Linkedin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactStation() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const response = await fetch("/api/transmit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAiFeedback(data.aiFeedback);
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMessage(data.error || 'Transmission failure. Check comms link.');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setErrorMessage('Unable to reach the transmit endpoint.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-24 flex items-center justify-center overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-900 opacity-50 pointer-events-none pixel-border" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display text-white mb-4 md:mb-6 uppercase">
            <span className="text-cyan-400">05.</span> Space Station
          </h2>
          <p className="text-sm md:text-lg text-slate-300 mb-8 md:mb-12 font-mono uppercase">
            Let's build something amazing together.
            <br />
          </p>

          <div className="bg-black pixel-border p-6 md:p-12 pixel-shadow relative overflow-hidden">
            {/* Decorative UI elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-cyan-500" />
            <div className="absolute top-4 md:top-6 left-4 md:left-6 w-3 h-3 md:w-4 md:h-4 bg-red-500 animate-pulse border-2 border-white" />
            <div className="absolute top-4 md:top-6 right-4 md:right-6 text-[10px] md:text-xs font-display text-slate-500 uppercase">
              SYS.ONLINE
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-pulse" />
                  <h3 className="text-xl font-display text-white uppercase tracking-widest">Transmission Received</h3>
                  <div className="bg-cyan-500/10 border-2 border-cyan-500/50 p-6 max-w-md">
                    <p className="text-cyan-400 font-mono text-sm uppercase leading-relaxed">
                      {aiFeedback || "Message relayed to the commander successfully."}
                    </p>
                  </div>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-xs text-slate-500 hover:text-white font-mono uppercase tracking-tighter mt-4"
                  >
                    [ NEW TRANSMISSION ]
                  </button>
                </motion.div>
              ) : (
                <form
                  className="space-y-4 md:space-y-6 mt-8 text-left font-mono text-sm md:text-base"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-display text-slate-400 uppercase tracking-wider"
                      >
                        Pilot Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        disabled={status === 'sending'}
                        className="w-full bg-black border-4 border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-none placeholder:text-slate-600 disabled:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-display text-slate-400 uppercase tracking-wider"
                      >
                        Comms Link
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        disabled={status === 'sending'}
                        className="w-full bg-black border-4 border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-none placeholder:text-slate-600 disabled:opacity-50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-display text-slate-400 uppercase tracking-wider"
                    >
                      Transmission
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      disabled={status === 'sending'}
                      className="w-full bg-black border-4 border-slate-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-none placeholder:text-slate-600 resize-none disabled:opacity-50"
                      placeholder="Initiating contact sequence..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-display py-4 border-4 border-cyan-500 transition-none flex items-center justify-center gap-4 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{status === 'sending' ? 'Transmitting...' : 'Transmit'}</span>
                    {status === 'sending' ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-red-500 text-xs uppercase"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMessage || 'Transmission failure. Check comms link.'}</span>
                    </motion.div>
                  )}
                </form>
              )}
            </AnimatePresence>

            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t-4 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex gap-4 md:gap-6">
                <a
                  href="https://github.com/rogx1ne"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition-none p-2 border-2 border-transparent hover:border-white bg-black"
                >
                  <Github className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishek-aditya-jeremy-4659982a7/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-cyan-400 transition-none p-2 border-2 border-transparent hover:border-cyan-400 bg-black"
                >
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </div>
              <p className="text-slate-500 text-[10px] md:text-sm font-mono uppercase text-center md:text-left">
                © {new Date().getFullYear()} Dev Portfolio. All systems
                nominal.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
