import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  Share2,
  LayoutGrid,
  Calendar,
  Trophy,
  Users,
  Presentation,
  Sparkles,
  Navigation
} from 'lucide-react';
import MapView from './components/MapView';
import CreateEventModal from './components/CreateEventModal';
import Login from './components/Login';
import AIChatModal from './components/AIChatModal';
import EventDetailsOverlay from './components/EventDetailsOverlay';
import NotificationToast from './components/NotificationToast';
import RegistrationFormModal from './components/RegistrationFormModal';
import SmartImportModal from './components/SmartImportModal';
import Leaderboard from './components/Leaderboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  { name: 'All', icon: <LayoutGrid size={14} /> },
  { name: 'Workshop', icon: <Presentation size={14} /> },
  { name: 'Hackathon', icon: <Trophy size={14} /> },
  { name: 'Meetup', icon: <Users size={14} /> },
  { name: 'Conference', icon: <Sparkles size={14} /> },
  { name: 'Paper presentation', icon: <Presentation size={14} /> },
  { name: 'Seminar', icon: <Users size={14} /> },
  { name: 'Others', icon: <Navigation size={14} /> }
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]); // Start with empty array
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [aiSelectedEvent, setAiSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'events', 'add', 'profile'
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 });
  const [notifications, setNotifications] = useState([]);
  const [isRegisteringFormOpen, setIsRegisteringFormOpen] = useState(false);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [isSmartImportOpen, setIsSmartImportOpen] = useState(false);
  const [smartImportData, setSmartImportData] = useState(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setSidebarOpen(true);
    if (event?.location?.coordinates) {
      setMapCenter({
        lat: event.location.coordinates[1],
        lng: event.location.coordinates[0]
      });
    }
  };

  const handleWhatsAppChat = (event) => {
    if (!event.whatsappNumber) {
      alert("WhatsApp number not provided for this event.");
      return;
    }
    const message = `Hi, I noticed your event *${event.title}* on Collage Event app. I'm interested and would like to know more details.`;
    window.open(`https://wa.me/${event.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = (event) => {
    const text = `Hey! Check out this event: *${event.title}* at ${event.collegeName}. 
Location: ${event.location.address}
Link: ${event.link || 'Open Collage Event App'}
Shared via Collage Event 📡`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };


  // 0. Handle Login
  const handleLogin = (userData) => {
    console.log("Login successful for:", userData.email);
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 0.5 Handle Map Click
  const handleMapClick = (coords) => {
    setSelectedLocation(coords);
    setIsModalOpen(true);
  };

  // 1. Get User Location and Fetch Events
  useEffect(() => {
    if (isLoggedIn) {
      if (navigator.geolocation) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(coords);
            setMapCenter(coords); // Update center on load
            fetchNearbyEvents(coords);
          },
          (error) => {
            console.error("Error getting location:", error);
            const defaultCoords = { lat: 13.0827, lng: 80.2707 };
            setUserLocation(defaultCoords);
            fetchNearbyEvents(defaultCoords);
          }
        );
      } else {
        fetchAllEvents();
      }
    }
  }, [isLoggedIn]);

  // 2. API Fetching
  const fetchNearbyEvents = async (coords, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await axios.get(`${API_URL}/events/nearby`, {
        params: {
          lng: coords.lng,
          lat: coords.lat,
          distance: 1000000 // Increase to 1000km for better visibility
        }
      });
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching nearby events:", err);
      fetchAllEvents(silent); // Fallback to all events
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchAllEvents = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching all events:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleRegistrationSuccess = (event, data) => {
    addNotification(`Success! You have registered for **${event.title}**. See you there! 🚀`, "success", "System Broadcast");
  };

  const addNotification = (message, type = 'info', title = 'Live Feed 📡') => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, type, title, timestamp: new Date() }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };


  // Simulation: Trigger a "User Just Joined" or "Someone Posted" notification periodically
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        addNotification("Someone from Anna University just posted a new Hackathon event! 🚀", "info", "New Activity");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);



  // 3. Search Filter Logic


  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Temporarily disable past-date filter for better visibility
      // const eventDate = new Date(e.date);
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);
      // if (eventDate < today) return false;

      // Category filter
      if (selectedCategory !== 'All' && e.category !== selectedCategory) {
        if (selectedCategory === 'Others' && e.category === 'Other') {
          // allow
        } else {
          return false;
        }
      }

      const matchesSearch =
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.collegeName && e.collegeName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [events, searchQuery, selectedCategory]);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (

    <div className="flex h-screen w-full overflow-hidden bg-gray-50 font-sans antialiased text-gray-900">

      <SmartImportModal 
        isOpen={isSmartImportOpen}
        onClose={() => setIsSmartImportOpen(false)}
        onImport={(data) => {
          setSmartImportData(data);
          setIsModalOpen(true);
          addNotification("AI Successfully extracted event details! 🚀", "success", "AI Magic");
        }}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        initialData={smartImportData}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLocation(null);
        }}
        userLocation={userLocation}
        selectedLocation={selectedLocation}
        onEventCreated={(newEvent) => {
          console.log("New event received in App:", newEvent);
          
          // Show Success Notification (Broadcast)
          addNotification(`Success! Your ${newEvent.category} event is now LIVE! 📡`, "success", "Event Genius");
          
          // Switch to the correct view to SEE the new event
          setSelectedCategory(newEvent.category);
          setActiveTab('events');

          // Add to local state immediately
          setEvents(prev => {
            // Check if already exists to avoid duplicates if refresh hits quickly
            const exists = prev.find(e => e._id === newEvent._id);
            if (exists) return prev;
            return [newEvent, ...prev];
          });

          // Switch to map view to see the new marker
          setActiveTab('map');
          if (newEvent.location?.coordinates) {
            setMapCenter({
              lat: newEvent.location.coordinates[1],
              lng: newEvent.location.coordinates[0]
            });
          }
        }}
      />

      <AIChatModal 
        isOpen={!!aiSelectedEvent}
        onClose={() => setAiSelectedEvent(null)}
        event={aiSelectedEvent}
      />

      <EventDetailsOverlay
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onOpenAI={() => {
          setAiSelectedEvent(selectedEvent);
        }}
        onRegisterInternal={(event) => {
          setRegisteringEvent(event);
          setIsRegisteringFormOpen(true);
        }}
      />

      <RegistrationFormModal 
        isOpen={isRegisteringFormOpen}
        onClose={() => setIsRegisteringFormOpen(false)}
        event={registeringEvent}
        onSuccess={handleRegistrationSuccess}
      />

      <Leaderboard 
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <NotificationToast 
        notifications={notifications}
        removeNotification={removeNotification}
      />


      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-96' : 'w-0'
          } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col h-full shadow-xl z-20 overflow-hidden relative hidden lg:flex`}
      >
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">⚡</span>
              <h1 className="text-2xl font-black tracking-tight uppercase">INOEVENT</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="text-purple-100 text-[10px] uppercase tracking-[0.2em] mt-1 opacity-90 font-black">The Land of Search</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Search Bar */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Search local events..."
              className="w-full pl-10 pr-4 py-3.5 bg-gray-100/80 border-none rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-4 text-gray-400 group-focus-within:text-purple-500 transition-colors">
              <Search size={18} />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
             {/* New Add Event Quick Action */}
             <button
               onClick={() => setIsModalOpen(true)}
               className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-[24px] shadow-lg shadow-purple-100 flex flex-col items-start space-y-2 group hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
               <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                 <Sparkles size={18} className="text-white" />
               </div>
               <div className="text-left">
                 <p className="font-black text-[10px] uppercase tracking-wider">Host Event</p>
               </div>
             </button>

             {/* Leaderboard Quick Action */}
             <button
               onClick={() => setIsLeaderboardOpen(true)}
               className="p-4 bg-white border border-gray-100 text-gray-800 rounded-[24px] shadow-sm flex flex-col items-start space-y-2 group hover:scale-[1.02] hover:bg-gray-50 active:scale-[0.98] transition-all"
             >
               <div className="bg-indigo-50 p-2 rounded-xl">
                 <Trophy size={18} className="text-indigo-600" />
               </div>
               <div className="text-left">
                 <p className="font-black text-[10px] uppercase tracking-wider">Rankings</p>
               </div>
             </button>
          </div>

          {/* Category Quick Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all active:scale-95 ${selectedCategory === cat.name
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-10 w-10 border-4 border-purple-100 border-t-purple-600 rounded-full mb-4"
              ></motion.div>
              <p className="font-bold text-xs uppercase tracking-widest opacity-60">Scanning Map...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-5xl mb-4">🛸</div>
              <h3 className="font-bold text-gray-800 text-lg">Nothing here yet</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">No events matching your search or location. Why not initiate one or import from WhatsApp?</p>
              
              <div className="flex flex-col space-y-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-[0.98]"
                >
                  + Post Event
                </button>
                <button
                  onClick={() => setIsSmartImportOpen(true)}
                  className="w-full py-4 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center space-x-2 border border-white/10"
                >
                  <Sparkles size={16} />
                  <span>AI Smart Import</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                  <span className="mr-2">🚀</span> Startup Hotspots
                </h2>
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">{filteredEvents.length} active</span>
              </div>

              <AnimatePresence mode='popLayout'>
                {filteredEvents.map((event, idx) => {
                  const dist = userLocation ? calculateDistance(
                    userLocation.lat, userLocation.lng,
                    event.location.coordinates[1], event.location.coordinates[0]
                  ) : null;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={event._id}
                      onClick={() => handleEventSelect(event)}
                      className={`p-5 border rounded-[32px] transition-all cursor-pointer group relative overflow-hidden ${selectedEvent?._id === event._id
                        ? 'bg-purple-50/50 border-purple-200 shadow-2xl shadow-purple-100'
                        : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-2xl'
                        } ${event.isFeatured ? 'border-l-4 border-l-orange-400' : ''}`}
                    >
                      <div className="h-48 -mx-5 -mt-5 mb-5 overflow-hidden relative border-b border-gray-50">
                        <img
                          src={event.poster || 'https://images.unsplash.com/photo-1540575861501-7ce0e224271a?auto=format&fit=crop&q=80&w=800'}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-purple-700 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center w-fit">
                            {CATEGORIES.find(c => c.name === event.category)?.icon}
                            <span className="ml-1.5">{event.category}</span>
                          </span>
                          {event.isVerified && (
                            <span className="px-3 py-1.5 bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center w-fit">
                              <span className="mr-1.5">✓</span> VERIFIED
                            </span>
                          )}
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 animate-bounce">
                          <span className={`px-3 py-1.5 rounded-xl font-black text-[10px] shadow-lg ${event.price > 0 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                            }`}>
                            {event.price > 0 ? `₹${event.price}` : 'FREE'}
                          </span>
                        </div>

                        {/* Floating Action Buttons */}
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setAiSelectedEvent(event); }}
                            className="h-10 w-10 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-purple-200 transition-all transform hover:-translate-y-1 active:scale-90 border border-white/20"
                            title="Ask AI Assistant"
                          >
                            <Sparkles size={18} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleWhatsAppChat(event); }}
                            className="h-10 w-10 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-green-600 transition-all transform hover:-translate-y-1 active:scale-90"
                            title="Chat on WhatsApp"
                          >
                            <span className="text-xl">💬</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleShare(event); }}
                            className="h-10 w-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-700 shadow-xl hover:bg-purple-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-90"
                          >
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-1.5 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest opacity-80">{event.collegeName || 'Anonymous'}</span>
                          {event.isFeatured && <span className="text-[8px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Featured</span>}
                        </div>
                        {dist && (
                          <span className="flex items-center text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg italic">
                            {dist} km away
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight text-lg">{event.title}</h3>
                        <div className="flex flex-col items-end shrink-0 ml-4">
                          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-tighter">
                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                          </span>
                          <span className="text-xl font-black text-gray-900 leading-none mt-1">
                            {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Tags Section */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {event.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-[9px] font-bold text-gray-500 rounded-lg">#{tag}</span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium mb-5">{event.description}</p>

                      <div className="flex items-center pt-4 border-t border-gray-100 text-[10px] text-gray-500 font-bold justify-between">
                        <div className="flex flex-col space-y-1">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (event.registrationLink || event.link) {
                                window.open(event.registrationLink || event.link, '_blank');
                              } else {
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.location.coordinates[1]},${event.location.coordinates[0]}`, '_blank');
                              }
                            }}
                            className="flex items-center hover:text-purple-600 transition-all cursor-pointer"
                          >
                            <div className="w-6 h-6 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mr-2">
                              <MapPin size={14} />
                            </div>
                            <span className="truncate max-w-[140px] underline decoration-purple-100 decoration-2 underline-offset-4 font-black">
                              {event.registrationLink ? 'Register Now' : (event.link ? 'Visit Site' : event.location.address)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-1">
                          <div className="flex items-center text-gray-400">
                            <Users size={12} className="mr-1" />
                            <span className="text-[9px] uppercase tracking-tighter">Seats: {event.capacity || 100}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer info maybe? */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Built with Collage Event 🛸</p>
        </div>
      </div>

      {/* Main Content (Map) */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Toggle Sidebar Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-6 left-6 z-30 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 hover:scale-110 transition-transform active:scale-95"
          >
            📋
          </button>
        )}

        {/* Top Floating Stats (Eye Candy) */}
        <div className="absolute top-6 right-6 z-30 flex items-center space-x-3 pointer-events-none lg:pointer-events-auto">
          <div className="px-4 py-2.5 bg-white/80 backdrop-blur-md border border-white shadow-xl rounded-2xl text-[10px] font-bold flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
            LIVE FEED
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 w-full h-full z-10">
          <MapView
            events={filteredEvents}
            userLocation={userLocation}
            mapCenter={mapCenter}
            selectedEvent={selectedEvent}
            onMarkerClick={handleEventSelect}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Bottom Banner Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-gray-900 text-white rounded-3xl shadow-2xl font-black text-sm tracking-tight hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center"
          >
            <span className="mr-2 text-lg">+</span>
            Create Event
          </button>

          <button
            onClick={() => userLocation && fetchNearbyEvents(userLocation)}
            className="p-4 bg-white border border-gray-100 rounded-3xl shadow-2xl hover:bg-gray-50 transition-all group active:scale-95"
            title="Refresh Location"
          >
            <span className="group-hover:rotate-180 transition-transform inline-block">🔄</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation Modal/Overlay for Mobile */}
      <AnimatePresence>
        {activeTab === 'events' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white lg:hidden overflow-hidden flex flex-col pt-12"
          >
            <div className="px-6 pb-4 border-b">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">All Events</h2>
                <button onClick={() => setActiveTab('map')} className="text-gray-400">Close</button>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search local events..."
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-100 border-none rounded-2xl text-sm outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3 top-4 text-gray-400">
                  <Search size={18} />
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Categories and List Reused */}
              <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap ${selectedCategory === cat.name ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-4 pb-24">
                {filteredEvents.map(event => (
                  <div key={event._id} onClick={() => { handleEventSelect(event); setActiveTab('map'); }} className="p-4 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center space-x-4">
                    <img src={event.poster || 'https://images.unsplash.com/photo-1540575861501-7ce0e224271a?auto=format&fit=crop&q=80&w=800'} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-bold text-sm line-clamp-1">{event.title}</h3>
                        {event.isVerified && <span className="text-blue-500 text-[10px]">✓</span>}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{event.collegeName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-lg">{event.category}</span>
                        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-lg">₹{event.price || 'Free'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button onClick={(e) => { e.stopPropagation(); setAiSelectedEvent(event); }} className="p-3 bg-purple-50 text-purple-600 rounded-xl active:scale-95 transition-transform">
                        <Sparkles size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleWhatsAppChat(event); }} className="p-3 bg-green-50 text-green-600 rounded-xl active:scale-95 transition-transform">
                        💬
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Bottom Navigation Bar (The 4 Items) */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-2xl border-t border-gray-100 lg:hidden px-6 py-3 pb-8 flex justify-between items-center">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'map' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-2xl ${activeTab === 'map' ? 'bg-purple-50' : ''}`}>
            <MapPin size={20} fill={activeTab === 'map' ? 'currentColor' : 'none'} />
          </div>
          <span className="text-[10px] font-bold">Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'events' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-2xl ${activeTab === 'events' ? 'bg-purple-50' : ''}`}>
            <LayoutGrid size={20} />
          </div>
          <span className="text-[10px] font-bold">Events</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center -mt-12 group"
        >
          <div className="h-14 w-14 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[22px] shadow-2xl shadow-purple-200 flex items-center justify-center text-white rotate-45 group-active:scale-90 transition-transform">
            <div className="-rotate-45 flex items-center justify-center">
              <span className="text-3xl font-light">+</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-purple-600 mt-4 uppercase tracking-tighter">Post</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 transition-all ${activeTab === 'profile' ? 'text-purple-600' : 'text-gray-400'}`}
        >
          <div className={`p-2 rounded-2xl ${activeTab === 'profile' ? 'bg-purple-50' : ''}`}>
            <Users size={20} />
          </div>
          <span className="text-[10px] font-bold">Account</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
