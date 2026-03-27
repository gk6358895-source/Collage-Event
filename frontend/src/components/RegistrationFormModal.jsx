import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, School, Send, CheckCircle2, BookOpen, Layers, Download, Share2, Calendar } from 'lucide-react';
import QRCode from "react-qr-code";

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
  const [registrationId, setRegistrationId] = useState('');

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate successful registration and generate a random ID
    const newRegId = 'INO-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setRegistrationId(newRegId);

    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
      // We don't close immediately now, to show the ticket
    }, 1500);
  };

  const handleFinish = () => {
    onSuccess(event, formData);
    onClose();
    setIsSuccess(false);
    setFormData({ name: '', email: '', phone: '', college: '', department: '', year: '1st Year' });
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
          <div className="flex flex-col h-full">
             {/* Success Header */}
             <div className="p-8 text-center bg-green-500 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col items-center">
                   <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                      <CheckCircle2 size={32} />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight">Registration Confirmed!</h3>
                   <p className="text-white/80 text-sm font-medium mt-1">Your spot is secured for {event.title}</p>
                </div>
             </div>

             {/* Digital Ticket UI */}
             <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] p-6 relative overflow-hidden">
                   {/* Decorative side notches */}
                   <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r-2 border-gray-100 italic"></div>
                   <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l-2 border-gray-100"></div>

                   <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Admission Pass</p>
                         <h4 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{event.title}</h4>
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Pass ID</p>
                         <p className="font-mono text-[10px] font-bold text-gray-900">{registrationId}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Attendee</p>
                         <p className="text-xs font-bold text-gray-900">{formData.name}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Department</p>
                         <p className="text-xs font-bold text-gray-900">{formData.department}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                         <p className="text-xs font-bold text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">College</p>
                         <p className="text-xs font-bold text-gray-900 line-clamp-1">{formData.college}</p>
                      </div>
                   </div>

                   {/* QR Code */}
                   <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <QRCode 
                        value={JSON.stringify({ 
                           id: registrationId, 
                           event: event.title, 
                           user: formData.name,
                           email: formData.email 
                        })}
                        size={140}
                        viewBox={`0 0 256 256`}
                        className="mb-4"
                      />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Scan at Venue Entry</p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => window.print()}
                     className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center"
                   >
                      <Download size={14} className="mr-2" /> Save PDF
                   </button>
                   <button 
                     onClick={handleFinish}
                     className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-lg shadow-purple-100 transition-all flex items-center justify-center"
                   >
                      Go to Home
                   </button>
                </div>
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
