import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateEventModal = ({ isOpen, onClose, userLocation, selectedLocation, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    date: '',
    address: '',
    collegeName: '',
    poster: '',
    link: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill address if location is selected from map
  React.useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setError('');
    }
    
    if (selectedLocation && isOpen) {
       // Reverse Geocoding via Nominatim
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
  }, [selectedLocation, isOpen]);


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log("Submitting event to backend...", formData);

    // helper to send to backend
    const saveToBackend = async (lat, lng) => {
      try {
        const backendData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          date: formData.date,
          address: formData.address,
          collegeName: formData.collegeName || 'Anonymous',
          poster: formData.poster,
          link: formData.link,
          longitude: lng,
          latitude: lat
        };

        console.log("Sending to backend:", backendData);
        const response = await axios.post(`${API_URL}/events`, backendData);
        console.log("Successfully saved to DB:", response.data);
        onEventCreated(response.data);
        onClose();
        setFormData({
          title: '',
          description: '',
          category: 'Workshop',
          date: '',
          address: formData.address, // keep address to avoid clearing during retry
          collegeName: '',
          poster: '',
          link: ''
        });
      } catch (apiErr) {

        console.error('Backend API Error:', apiErr);
        setError(apiErr.response?.data?.error || 'Database error: Could not save event.');
      } finally {
        setLoading(false);
      }
    };

    // 1. If we already have coordinates from a map click, use them directly
    if (selectedLocation) {
      console.log("Using map-selected coordinates:", selectedLocation);
      await saveToBackend(selectedLocation.lat, selectedLocation.lng);
      return;
    }

    // 2. Try to geocode with a safety timeout (using free Nominatim API)
    try {
      let validationFinished = false;

      const timeoutId = setTimeout(() => {
        if (!validationFinished) {
          console.warn("Geocoding timed out. Using fallback.");
          validationFinished = true;
          saveToBackend(13.0827, 80.2707);
        }
      }, 3000);

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      const data = await response.json();

      if (validationFinished) return;
      validationFinished = true;
      clearTimeout(timeoutId);

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        await saveToBackend(lat, lon);
      } else {
        console.warn("No results found for address. Using fallback.");
        await saveToBackend(13.0827, 80.2707);
      }
    } catch (err) {
      console.error('Geocoding fetch error:', err);
      if (loading) await saveToBackend(13.0827, 80.2707);
    }
  };





  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Post New Event</h2>
          <button onClick={onClose} className="text-2xl hover:text-purple-200 transition-colors">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 italic">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Event Title</label>
            <input
              required
              type="text"
              placeholder="e.g. React Developers Meetup"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">College Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Anna University, IIT Madras"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.collegeName}
              onChange={(e) => setFormData({...formData, collegeName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Category</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Workshop</option>
                <option>Hackathon</option>
                <option>Meetup</option>
                <option>Conference</option>
                <option>Paper presentation</option>
                <option>Seminar</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Date</label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Location Address</label>
            <input
              required
              type="text"
              placeholder="e.g. Tidel Park, Tharamani, Chennai"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Poster Image URL</label>
            <input
              type="text"
              placeholder="e.g. https://example.com/poster.jpg"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.poster}
              onChange={(e) => setFormData({...formData, poster: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Event / College Website Link</label>
            <input
              type="url"
              placeholder="e.g. https://college-event.ac.in"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Description</label>
            <textarea
              required
              rows="3"

              placeholder="What is this event about?"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
              }`}
            >
              {loading ? 'Validating Address...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
