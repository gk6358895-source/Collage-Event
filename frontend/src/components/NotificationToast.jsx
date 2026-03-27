import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Info, X, Zap, Sparkles } from 'lucide-react';

const NotificationToast = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center space-y-3 pointer-events-none w-full max-w-sm px-6">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto w-full"
          >
            <div className={`relative overflow-hidden p-4 rounded-[28px] shadow-2xl border flex items-center space-x-4 backdrop-blur-xl ${
               notif.type === 'success' 
               ? 'bg-green-500/95 border-green-400 text-white' 
               : 'bg-white/95 border-gray-100 text-gray-800'
            }`}>
              {/* Animated Glow Background for highlights */}
              {notif.type === 'success' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              )}

              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                notif.type === 'success' ? 'bg-white/20' : 'bg-purple-100 text-purple-600'
              }`}>
                {notif.type === 'success' ? <Sparkles size={22} className="animate-pulse" /> : <Bell size={22} />}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p className={`text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5 ${
                  notif.type === 'success' ? 'text-white' : 'text-purple-600'
                }`}>
                  {notif.title || 'Notification'}
                </p>
                <p className="text-xs font-bold leading-tight line-clamp-2">
                  {notif.message}
                </p>
              </div>

              <button 
                onClick={() => removeNotification(notif.id)}
                className={`p-2 rounded-xl transition-colors ${
                  notif.type === 'success' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-400'
                }`}
              >
                <X size={16} />
              </button>
              
              {/* Progress bar for auto-dismiss */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${
                  notif.type === 'success' ? 'bg-white/40' : 'bg-purple-500/40'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
