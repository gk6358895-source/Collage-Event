import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Users, TrendingUp, X, Filter, Search, Award } from 'lucide-react';

const DEPARTMENTS_DATA = [
  { id: 1, name: 'Computer Science', count: 420, color: 'from-purple-500 to-indigo-600', trend: '+12%' },
  { id: 2, name: 'Information Technology', count: 385, color: 'from-blue-500 to-cyan-600', trend: '+8%' },
  { id: 3, name: 'Electronics & Comm', count: 310, color: 'from-orange-500 to-red-600', trend: '+5%' },
  { id: 4, name: 'Mechanical Engineering', count: 245, color: 'from-green-500 to-emerald-600', trend: '+15%' },
  { id: 5, name: 'Artificial Intelligence', count: 195, color: 'from-pink-500 to-rose-600', trend: '+20%' },
  { id: 6, name: 'Civil Engineering', count: 160, color: 'from-amber-500 to-yellow-600', trend: '+2%' },
  { id: 7, name: 'Bio Technology', count: 120, color: 'from-teal-500 to-green-600', trend: '-1%' },
];

const Leaderboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('department'); // 'department' or 'college'
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredData = DEPARTMENTS_DATA.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...DEPARTMENTS_DATA.map(d => d.count));

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-white/90 rounded-[48px] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-white/40"
      >
        {/* Header Section */}
        <div className="p-10 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-20 -mb-20"></div>

          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                 <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                    <Trophy size={20} className="text-yellow-400" />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tight">Leaderboard</h2>
              </div>
              <p className="text-indigo-200 text-sm font-medium">Tracking participation across all hotspots 📡</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-110 active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-10 flex items-center space-x-4 overflow-x-auto no-scrollbar">
             <button 
               onClick={() => setActiveTab('department')}
               className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeTab === 'department' ? 'bg-white text-indigo-900 shadow-xl' : 'bg-white/10 text-white/60 hover:bg-white/20'
               }`}
             >
               Departments
             </button>
             <button 
               onClick={() => setActiveTab('college')}
               className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeTab === 'college' ? 'bg-white text-indigo-900 shadow-xl' : 'bg-white/10 text-white/60 hover:bg-white/20'
               }`}
             >
               Top Colleges
             </button>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="px-10 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50">
           <div className="relative group flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search department..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={18} />
           </div>

           <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <div className="flex items-center">
                 <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                 1.2k Total Registrations
              </div>
              <div className="hidden sm:flex items-center">
                 <TrendingUp size={14} className="mr-2 text-purple-600" />
                 Trending: AI Tech
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-white/50">
           <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode='popLayout'>
                 {filteredData.map((dept, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      key={dept.id}
                      className="group flex items-center space-x-6"
                    >
                       <div className="flex flex-col items-center justify-center w-12 shrink-0">
                          {index === 0 ? (
                             <Medal size={28} className="text-yellow-400 animate-bounce" />
                          ) : index === 1 ? (
                             <Medal size={28} className="text-gray-300" />
                          ) : index === 2 ? (
                             <Medal size={28} className="text-amber-600" />
                          ) : (
                             <span className="text-lg font-black text-gray-300 italic">#{index + 1}</span>
                          )}
                       </div>

                       <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-end">
                             <div>
                                <h4 className="text-sm font-black text-gray-800 group-hover:text-indigo-600 transition-colors">{dept.name}</h4>
                                <div className="flex items-center mt-1 space-x-3">
                                   <span className="flex items-center text-[9px] font-bold text-gray-400">
                                      <Users size={10} className="mr-1" />
                                      {dept.count} Members
                                   </span>
                                   <span className={`text-[9px] font-black ${dept.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                      {dept.trend} This week
                                   </span>
                                </div>
                             </div>
                             <span className="text-xl font-black text-gray-900 opacity-20 group-hover:opacity-100 transition-opacity">
                                {Math.round((dept.count / maxCount) * 100)}%
                             </span>
                          </div>

                          <div className="h-3.5 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100 shadow-inner">
                             <motion.div
                               initial={{ width: 0 }}
                               animate={{ width: `${(dept.count / maxCount) * 100}%` }}
                               transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                               className={`h-full rounded-full bg-gradient-to-r shadow-lg shadow-purple-100 ${dept.color}`}
                             />
                          </div>
                       </div>

                       <div className="hidden md:flex flex-col items-end shrink-0">
                          <div className="p-3 bg-gray-100 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer shadow-sm">
                             <Filter size={16} />
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>

           {/* Top 3 Spotlight */}
           {searchTerm === '' && (
              <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col md:flex-row gap-8">
                 <div className="flex-1 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-[40px] p-8 border border-white relative overflow-hidden group">
                    <div className="absolute top-4 right-4 bg-white p-2 rounded-xl shadow-sm text-yellow-500">
                       <Award size={20} />
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Top Contributor</p>
                    <div className="flex items-center space-x-4">
                       <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl flex items-center justify-center text-3xl p-1">🥇</div>
                       <div>
                          <h5 className="font-black text-gray-900 uppercase tracking-tight">Anna University</h5>
                          <p className="text-xs text-gray-500 font-medium">890 registrations</p>
                       </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                       <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-indigo-600 uppercase border border-indigo-100">#1 Venue</span>
                       <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-emerald-600 uppercase border border-emerald-100">Most Active</span>
                    </div>
                 </div>

                 <div className="flex-1 bg-white border border-gray-100 rounded-[40px] p-8 flex flex-col justify-center">
                    <h5 className="text-lg font-black text-gray-900 leading-tight mb-2">Want to boost your department?</h5>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">Invite your batchmates and register for upcoming hackathons to climb the ranks!</p>
                    <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95">
                       Share App Link
                    </button>
                 </div>
              </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] bg-gray-50/50">
           Real-time metrics by INOEVENT Node 🛰️
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
