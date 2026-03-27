import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, School, Send, CheckCircle2, BookOpen, Layers } from 'lucide-react';

const RegistrationFormModal = ({ event, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '1st Year'
  });
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate successful registration
    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(event, formData);
        onClose();
        setIsSuccess(false); // reset for next time
        setFormData({ name: '', email: '', phone: '', college: '', department: '', year: '1st Year' });
      }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-white/20"
      >
        {isSuccess ? (
          <div className="p-12 text-center space-y-6">
             <div className="h-24 w-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 leading-tight">Registration Successful!</h3>
                <p className="text-gray-500 font-medium">You are all set for **${event.title}**. Check your email for more details! 📡</p>
             </div>
             <div className="pt-4">
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-green-100 animate-pulse">
                   Redirecting to Dashboard...
                </span>
             </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-8 bg-gradient-to-r from-gray-900 to-indigo-950 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <h2 className="text-xl font-black tracking-tight mb-1 uppercase">Event Registration</h2>
                    <p className="text-xs text-gray-400 font-medium line-clamp-1">Registering for: {event.title}</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <div className="relative">
                       <input 
                         required
                         type="text" 
                         placeholder="Gowtham..." 
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                       <User size={14} className="absolute left-4 top-3.5 text-gray-300" />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Gmail Address</label>
                    <div className="relative">
                       <input 
                         required
                         type="email" 
                         placeholder="name@gmail.com" 
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                       <Mail size={14} className="absolute left-4 top-3.5 text-gray-300" />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                    <div className="relative">
                       <input 
                         required
                         type="tel" 
                         placeholder="9198765..." 
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       />
                       <Phone size={14} className="absolute left-4 top-3.5 text-gray-300" />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Academic Year</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium appearance-none"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                    >
                       <option>1st Year</option>
                       <option>2nd Year</option>
                       <option>3rd Year</option>
                       <option>4th Year</option>
                       <option>Post Graduate</option>
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">College / Institution</label>
                <div className="relative">
                   <input 
                     required
                     type="text" 
                     placeholder="Anna University..." 
                     className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
                     value={formData.college}
                     onChange={(e) => setFormData({...formData, college: e.target.value})}
                   />
                   <School size={14} className="absolute left-4 top-3.5 text-gray-300" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Department</label>
                <div className="relative">
                   <input 
                     required
                     type="text" 
                     placeholder="Computer Science..." 
                     className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
                     value={formData.department}
                     onChange={(e) => setFormData({...formData, department: e.target.value})}
                   />
                   <BookOpen size={14} className="absolute left-4 top-3.5 text-gray-300" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2 ${
                    submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:shadow-purple-100'
                  }`}
                >
                  {submitting ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : (
                    <Send size={18} className="mr-2" />
                  )}
                  <span>{submitting ? 'PROCESSING...' : 'CONFIRM REGISTRATION'}</span>
                </button>
              </div>
            </form>

            <div className="px-8 pb-8 text-center">
               <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Powered by INOEVENT Cloud ⚡</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default RegistrationFormModal;
