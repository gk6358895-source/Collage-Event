import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Calendar, Users, Share2, 
  ExternalLink, MessageCircle, Navigation, 
  Sparkles, Globe, Trophy, Info
} from 'lucide-react';

const EventDetailsOverlay = ({ event, isOpen, onClose, onOpenAI, onRegisterInternal }) => {
  if (!isOpen || !event) return null;

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the event *${event.title}* at ${event.collegeName}. Can I get more details?`;
    window.open(`https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    const text = `Check out this event: ${event.title}\n📍 ${event.location.address}\n📅 ${new Date(event.date).toLocaleDateString()}\nJoin me! 📡`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-md p-0 lg:p-10">
        <motion.div
           initial={{ y: '100%', opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: '100%', opacity: 0 }}
           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
           className="bg-white w-full max-w-4xl h-[92vh] lg:h-auto lg:max-h-[85vh] lg:rounded-[48px] rounded-t-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative"
        >
          {/* Close Button Mobile */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white/40 transition-all lg:hidden"
          >
            <X size={24} />
          </button>

          {/* Image & Main Info (Left Side) */}
          <div className="lg:w-1/2 w-full h-80 lg:h-auto relative overflow-hidden group">
            <img 
              src={event.poster || 'https://images.unsplash.com/photo-1540575861501-7ce0e224271a?auto=format&fit=crop&q=80&w=800'} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                  {event.category}
                </span>
                {event.isVerified && (
                  <span className="px-3 py-1 bg-blue-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center">
                    <span className="mr-1">✓</span> Verified
                  </span>
                )}
              </div>
              <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-2 drop-shadow-lg">{event.title}</h2>
              <div className="flex items-center text-white/80 text-sm font-medium">
                <Globe size={16} className="mr-2" />
                <span>{event.collegeName || 'Anonymous Organizer'}</span>
              </div>
            </div>
          </div>

          {/* Details (Right Side) */}
          <div className="lg:w-1/2 w-full flex flex-col h-full bg-white relative">
             {/* Close Button Desktop */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 bg-gray-50 p-3 rounded-2xl text-gray-400 hover:text-gray-900 transition-all hidden lg:block"
            >
              <X size={24} />
            </button>

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar space-y-8">
              {/* Quick Info Bar */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-purple-50 rounded-[32px] border border-purple-100 flex items-center space-x-4">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                       <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">When</p>
                      <p className="text-base font-black text-purple-900">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                 </div>

                 <div className="p-5 bg-orange-50 rounded-[32px] border border-orange-100 flex items-center space-x-4">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                       <span className="text-xl font-bold">₹</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Entry</p>
                      <p className="text-base font-black text-orange-900">{event.price > 0 ? `₹${event.price}` : 'Free'}</p>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                    <Info size={14} className="mr-2" /> About Event
                 </h3>
                 <p className="text-gray-800 leading-relaxed text-base font-medium">
                    {event.description}
                 </p>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                   {event.tags.map(tag => (
                     <span key={tag} className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-500 shadow-sm">
                        #{tag}
                     </span>
                   ))}
                </div>
              )}

              {/* Location Card */}
              <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start space-x-4">
                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <MapPin size={24} />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue Location</p>
                    <p className="text-sm font-bold text-gray-800 leading-snug">{event.location.address}</p>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.location.coordinates[1]},${event.location.coordinates[0]}`, '_blank')}
                      className="text-purple-600 font-black text-[10px] uppercase tracking-widest flex items-center pt-2 hover:underline"
                    >
                      <Navigation size={12} className="mr-1.5" /> Get Directions
                    </button>
                 </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-8 lg:p-10 border-t border-gray-50 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white sticky bottom-0">
               <button 
                 onClick={onOpenAI}
                 className="col-span-2 lg:col-span-2 py-4 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
               >
                 <Sparkles size={18} />
                 <span>Ask AI Genius</span>
               </button>

               <button 
                 onClick={handleWhatsApp}
                 className="py-4 bg-green-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
               >
                 <MessageCircle size={18} className="mr-2" />
                 <span>Chat</span>
               </button>

               <button 
                 onClick={handleShare}
                 className="py-4 bg-gray-100 text-gray-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
               >
                 <Share2 size={18} className="mr-2" />
                 <span>Share</span>
               </button>

               <button 
                 onClick={() => onRegisterInternal(event)}
                 className="col-span-2 lg:col-span-4 py-3 bg-purple-50 text-purple-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-100 transition-all border border-purple-100 active:scale-95"
               >
                 ✨ Use Internal Registration Form
               </button>

               <button 
                 onClick={() => {
                    if (event.registrationLink) {
                      window.open(event.registrationLink, '_blank');
                    } else if (event.link) {
                      window.open(event.link, '_blank');
                    } else {
                      // Fallback: Message organizer for link
                      const msg = `Hi, I want to register for *${event.title}*. Could you please send me the registration link?`;
                      window.open(`https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                    }
                 }}
                 className="col-span-2 lg:col-span-4 py-5 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-[32px] font-black text-sm uppercase tracking-[0.1em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center border border-white/10"
               >
                 <span>
                    {event.registrationLink ? 'OPEN REGISTRATION FORM' : (event.link ? 'VISIT EVENT WEBSITE' : 'REQUEST LINK FROM ORGANIZER')}
                 </span>
                 <ExternalLink size={18} className="ml-2" />
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventDetailsOverlay;
