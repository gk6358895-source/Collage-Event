import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, MessageSquare, Wand2, Edit3 } from 'lucide-react';

import AIPosterGenerator from './AIPosterGenerator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateEventModal = ({ isOpen, onClose, userLocation, selectedLocation, onEventCreated, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    date: '',
    address: '',
    collegeName: '',
    poster: '',
    link: '',
    // Advanced fields
    whatsappNumber: '',
    price: '0',
    capacity: '100',
    tags: '',
    organizerName: '',
    registrationLink: ''
  });
  const [otherCategoryName, setOtherCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Auto-fill address if location is selected from map
  React.useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setError('');
    }

    if (selectedLocation && isOpen) {
      const fetchAddress = async () => {
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`;
          const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
          const data = await response.json();
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }));
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        }
      };
      fetchAddress();
    }

    if (isOpen && initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || prev.title,
        description: initialData.description || prev.description,
        category: initialData.category || prev.category,
        date: initialData.date || prev.date,
        address: initialData.address || prev.address
      }));
    }
  }, [selectedLocation, isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const saveToBackend = async (lat, lng) => {
      try {
        const backendData = {
          ...formData,
          category: formData.category === 'Others' && otherCategoryName ? otherCategoryName : formData.category,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          longitude: lng,
          latitude: lat
        };

        const response = await axios.post(`${API_URL}/events`, backendData);
        onEventCreated(response.data);
        onClose();
        setFormData({
          title: '',
          description: '',
          category: 'Workshop',
          date: '',
          address: formData.address,
          collegeName: '',
          poster: '',
          link: '',
          whatsappNumber: '',
          price: '0',
          capacity: '100',
          tags: '',
          organizerName: '',
          registrationLink: ''
        });
      } catch (apiErr) {
        console.error('Backend API Error:', apiErr);
        setError(apiErr.response?.data?.error || 'Database error: Could not save event.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedLocation) {
      await saveToBackend(selectedLocation.lat, selectedLocation.lng);
      return;
    }

    try {
      let validationFinished = false;
      const timeoutId = setTimeout(() => {
        if (!validationFinished) {
          validationFinished = true;
          saveToBackend(13.0827, 80.2707);
        }
      }, 3000);

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`;
      const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await response.json();

      if (validationFinished) return;
      validationFinished = true;
      clearTimeout(timeoutId);

      if (data && data.length > 0) {
        await saveToBackend(parseFloat(data[0].lat), parseFloat(data[0].lon));
      } else {
        await saveToBackend(13.0827, 80.2707);
      }
    } catch (err) {
      if (loading) await saveToBackend(13.0827, 80.2707);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold">Post Advanced Event</h2>
            <p className="text-xs text-purple-100 opacity-80 mt-1">Stand out with innovative features</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Event Title</label>
              <input
                required
                type="text"
                placeholder="e.g. AI Startup Summit 2026"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Organizer / Club Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Robotics Club Anna University"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">WhatsApp Number</label>
              <input
                type="text"
                placeholder="e.g. 919876543210 (with country code)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-medium text-sm"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Workshop</option>
                <option>Hackathon</option>
                <option>Meetup</option>
                <option>Conference</option>
                <option>Paper presentation</option>
                <option>Seminar</option>
                <option>Others</option>
              </select>

              <AnimatePresence>
                {formData.category === 'Others' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="mt-3"
                  >
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        placeholder="What kind of event?" 
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold placeholder:text-indigo-300"
                        value={otherCategoryName}
                        onChange={(e) => setOtherCategoryName(e.target.value)}
                      />
                      <Edit3 size={14} className="absolute left-4 top-3.5 text-indigo-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Date</label>
              <input
                required
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Ticket Price (₹)</label>
              <input
                type="number"
                placeholder="0 for Free"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Max Capacity</label>
              <input
                type="number"
                placeholder="e.g. 500"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. #React, #AI, #Innovation"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Location / Venue Address</label>
            <input
              required
              type="text"
              placeholder="Full venue address"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ">Poster URL</label>
                <button
                  type="button"
                  onClick={() => setIsAIModalOpen(true)}
                  className="flex items-center space-x-1 text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
                >
                   <Sparkles size={10} />
                   <span>GENERATE WITH AI</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Image link"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration Link</label>
                <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase">Paste Google Form here!</span>
              </div>
              <input
                type="url"
                placeholder="https://docs.google.com/forms/..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
                value={formData.registrationLink}
                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
              />
            </div>
          </div>

          <AIPosterGenerator 
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            onSelect={(url) => {
               setFormData(prev => ({ ...prev, poster: url }));
               setIsAIModalOpen(false);
            }}
            eventTitle={formData.title}
            eventCategory={formData.category}
          />

          <div>
            <div className="flex justify-between items-center mb-1.5 ">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
              <button
                type="button"
                onClick={() => {
                  if(!formData.title) {
                    setError("Enter an Event Title first to use AI enhancer!");
                    return;
                  }
                  setLoading(true);
                  setTimeout(() => {
                    const enhanced = `Join us for **${formData.title}**! 🚀 This **${formData.category}** is designed to bring together the best minds at **${formData.collegeName || 'our venue'}**. Whether you're a beginner or an expert, you'll find immense value, networking opportunities, and hands-on learning. Don't miss out on this incredible experience planned for ${formData.date || 'the upcoming date'}! 📡`;
                    setFormData(prev => ({ ...prev, description: enhanced }));
                    setLoading(false);
                  }, 1500);
                }}
                className="flex items-center space-x-1 text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
              >
                <Wand2 size={10} />
                <span>AI ENHANCE</span>
              </button>
            </div>
            <textarea
              required
              rows="3"
              placeholder="Tell us more about the event, syllabus, speakers..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none resize-none font-medium text-sm"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-200'
                }`}
            >
              {loading && <span className="animate-spin mr-2">⏳</span>}
              <span>{loading ? 'POSTING EVENT...' : 'POST INNOVATIVE EVENT'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;

