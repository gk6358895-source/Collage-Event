import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Check, RefreshCw, X, Image as ImageIcon, Zap } from 'lucide-react';

const AIPosterGenerator = ({ isOpen, onClose, onSelect, eventTitle, eventCategory }) => {
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState([]);

  const steps = [
    "Analyzing Event Context...",
    "Extracting Visual Keywords...",
    "Synthesizing Color Palettes...",
    "Generating High-Res Textures...",
    "Finalizing Masterpiece..."
  ];

  const generatePosters = () => {
    setGenerating(true);
    setStep(0);
    
    // Simulate generation steps
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStep(currentStep);
      } else {
        clearInterval(interval);
        
        // Finalize posters using keywords
        const keywords = `${eventTitle} ${eventCategory} technology college`.split(' ').filter(k => k.length > 3).join(',');
        const newOptions = [
          `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}`,
          `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}`,
          `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}`,
          `https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}`
        ];
        setOptions(newOptions);
        setGenerating(false);
      }
    }, 800);
  };

  useEffect(() => {
    if (isOpen && options.length === 0) {
      generatePosters();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-white/20"
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-between items-center z-10 relative">
            <div className="flex items-center space-x-3">
               <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md animate-pulse">
                  <Wand2 size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">AI Poster Designer</h2>
                  <p className="text-indigo-100 text-xs font-medium uppercase tracking-widest opacity-80">Generative Engine v2.0</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
               <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-10 flex-1 overflow-y-auto min-h-[500px] flex flex-col">
          {generating ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
               <div className="relative w-32 h-32">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-dashed border-purple-200 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Zap size={32} className="text-purple-600 animate-pulse" />
                  </div>
               </div>
               
               <div className="text-center space-y-4">
                  <h3 className="text-xl font-black text-gray-800 transition-all duration-300">{steps[step]}</h3>
                  <div className="flex justify-center space-x-1">
                     {steps.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= step ? 'bg-purple-600' : 'bg-gray-100'}`} 
                        />
                     ))}
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {options.map((url, idx) => (
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       key={idx}
                       className="group relative rounded-[32px] overflow-hidden shadow-xl cursor-pointer aspect-video border-4 border-transparent hover:border-purple-500 transition-all"
                       onClick={() => onSelect(url)}
                     >
                        <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Generated Poster" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                           <div className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center space-x-2 translate-y-4 group-hover:translate-y-0 transition-transform">
                              <Check size={16} />
                              <span>Select Design</span>
                           </div>
                        </div>
                        <div className="absolute top-4 left-4">
                           <span className="bg-white/90 backdrop-blur text-[10px] font-black text-gray-900 px-3 py-1.5 rounded-xl shadow-lg border border-white/20">OPTION {idx + 1}</span>
                        </div>
                     </motion.div>
                  ))}
               </div>

               <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                     <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <ImageIcon size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-black text-gray-800 uppercase tracking-tight">Regenerate Ideas</p>
                        <p className="text-[10px] text-gray-500 font-medium">Not satisfied? Try again for new variations.</p>
                     </div>
                  </div>
                  <button 
                    onClick={generatePosters}
                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center space-x-3 shadow-xl shadow-gray-200 active:scale-95"
                  >
                     <RefreshCw size={16} />
                     <span>Relaunch AI Designer</span>
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="px-10 py-6 bg-gray-50/50 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">INOEVENT Neural Engine • Beta 🚀</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AIPosterGenerator;
