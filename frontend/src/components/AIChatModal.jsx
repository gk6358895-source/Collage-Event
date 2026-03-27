import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, User, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

const AIChatModal = ({ event, isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && event) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: `Hi there! 👋 I'm the AI Assistant for **${event.title}**. Ask me any questions about the event, its location, or details!`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, event]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase();
    
    // Smart matching logic based on event data
    if (q.includes('price') || q.includes('cost') || q.includes('registration fee') || q.includes('free')) {
      return event.price > 0 
        ? `The entry fee for this event is **₹${event.price}**. It's a great investment for the value offered!` 
        : `Exciting news! This event is **completely FREE** to attend. 🎉`;
    }
    
    if (q.includes('location') || q.includes('where') || q.includes('venue') || q.includes('place')) {
      return `The event is happening at **${event.location.address}**. It's hosted by **${event.collegeName || 'the organizer'}**.`;
    }
    
    if (q.includes('date') || q.includes('when') || q.includes('time')) {
      const dateStr = new Date(event.date).toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return `Mark your calendar! The event is scheduled for **${dateStr}**.`;
    }
    
    if (q.includes('capacity') || q.includes('many people') || q.includes('seats')) {
      return `The total capacity is **${event.capacity || 100} people**. I recommend registering soon to secure your spot!`;
    }

    if (q.includes('contact') || q.includes('whatsapp') || q.includes('organizer') || q.includes('talk')) {
      return `You can chat directly with the organizer on WhatsApp! Should I prepare a message for you? Click the "Connect with Organizer" button below.`;
    }

    if (q.includes('about') || q.includes('what') || q.includes('detail') || q.includes('description')) {
      return `Here's a quick summary: ${event.description}. Sounds interesting, right?`;
    }

    // Default fallback
    return `That's a great question about **${event.title}**! Based on what I know, it's organized by ${event.collegeName}. For more specific details, you might want to message the organizer directly!`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleWhatsAppWithAI = () => {
    const message = `Hi, I was chatting with your AI assistant about *${event.title}*. I'm interested in attending and had a few more questions.`;
    window.open(`https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[600px] border border-white/20"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex items-center space-x-3 z-10">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-none">Event Genius AI</h3>
              <p className="text-[10px] text-purple-100 font-bold uppercase tracking-widest mt-1 opacity-80">Powered by Gemini & Collage Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 bg-black/10 hover:bg-black/20 rounded-2xl flex items-center justify-center transition-colors z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar scroll-smooth"
        >
          {messages.map((msg) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mb-1 ${
                  msg.role === 'user' ? 'bg-purple-600 text-white ml-2' : 'bg-white border border-gray-100 text-purple-600 mr-2 shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-lg' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-lg'
                }`}>
                  <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                  <span className={`text-[9px] mt-2 block opacity-40 font-bold uppercase ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start items-center space-x-2">
              <div className="h-8 w-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <Bot size={14} className="text-purple-600" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl flex space-x-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-100">
           <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setInput("Is this event free?")} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl text-[10px] font-bold transition-colors border border-purple-100">💰 Pricing?</button>
              <button onClick={() => setInput("Where exactly is it?")} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-bold transition-colors border border-indigo-100">📍 Location?</button>
              <button onClick={() => setInput("Who is organizing this?")} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-[10px] font-bold transition-colors border border-blue-100">🏢 Organizer?</button>
           </div>
           
           <div className="flex space-x-3 mb-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Type your question..." 
                  className="w-full pl-4 pr-12 py-4 bg-gray-100/80 border-none rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 h-10 w-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 transition-all active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
              
              <button 
                onClick={handleWhatsAppWithAI}
                className="px-6 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-600 transition-all flex items-center space-x-2"
              >
                <span>WhatsApp</span>
                <ArrowRight size={14} />
              </button>
           </div>
           
           <div className="text-center pt-2">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[.2em]">Collage AI Smart Assist</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIChatModal;
