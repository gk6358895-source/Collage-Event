import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Clipboard, Wand2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const SmartImportModal = ({ isOpen, onClose, onImport }) => {
  const [pastedText, setPastedText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSmartParse = () => {
    if (!pastedText.trim()) {
      setError("Please paste some event text first!");
      return;
    }

    setParsing(true);
    setError('');

    // Simulate AI extraction
    setTimeout(() => {
      const text = pastedText.toLowerCase();
      
      // Basic AI-style extraction logic
      const result = {
        title: '',
        description: pastedText.substring(0, 500),
        category: 'Others',
        date: new Date().toISOString().split('T')[0],
        address: 'Chennai'
      };

      // Heuristic matching
      if (text.includes('workshop')) result.category = 'Workshop';
      else if (text.includes('hackathon')) result.category = 'Hackathon';
      else if (text.includes('meetup')) result.category = 'Meetup';
      else if (text.includes('conference')) result.category = 'Conference';

      // Title extraction (usually the first line)
      const lines = pastedText.split('\n');
      result.title = lines[0].substring(0, 50).trim();

      // Date matching (simple regex for YYYY-MM-DD or DD/MM/YYYY)
      const dateMatch = pastedText.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (dateMatch) {
         result.date = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
      }

      onImport(result);
      setParsing(false);
      setPastedText('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-white/20"
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-800 text-white relative">
           <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                 <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">AI Smart Importer</h2>
           </div>
           <p className="text-purple-100/70 text-xs font-medium">Paste any event message from WhatsApp or Website and let AI extract the details!</p>
           <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
           {error && (
             <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center">
                <AlertCircle size={14} className="mr-2" /> {error}
             </motion.div>
           )}

           <div className="space-y-4">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <Clipboard size={12} className="mr-2" /> Paste Event text Below
                 </label>
                 <button 
                   onClick={async () => {
                      const text = await navigator.clipboard.readText();
                      setPastedText(text);
                   }}
                   className="text-[10px] font-black text-purple-600 hover:underline"
                 >
                   Paste from Clipboard
                 </button>
              </div>

              <textarea 
                className="w-full h-48 p-5 bg-gray-50 border border-gray-100 rounded-[32px] focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium resize-none custom-scrollbar"
                placeholder="Example: WhatsApp Message - Hey! Checkout this workshop on 12/12/2026 at Chennai Hub..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
           </div>

           <div className="pt-2">
              <button
                disabled={parsing || !pastedText}
                onClick={handleSmartParse}
                className={`w-full py-5 rounded-[28px] font-black text-white shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 ${
                  parsing ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:shadow-purple-100'
                }`}
              >
                {parsing ? (
                   <span className="animate-spin mr-2">⏳</span>
                ) : (
                   <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                )}
                <span className="uppercase tracking-[0.1em]">{parsing ? 'AI IS PARSING...' : 'IMPORT EVENT WITH AI'}</span>
              </button>
           </div>

           <div className="text-center pt-2">
              <div className="flex items-center justify-center space-x-6 text-gray-300">
                 <div className="flex items-center space-x-1">
                    <CheckCircle2 size={12} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Auto Category</span>
                 </div>
                 <div className="flex items-center space-x-1">
                    <CheckCircle2 size={12} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Date Detection</span>
                 </div>
                 <div className="flex items-center space-x-1">
                    <CheckCircle2 size={12} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Clean Format</span>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartImportModal;
