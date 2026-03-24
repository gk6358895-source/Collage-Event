import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Blue Icon for User Location
const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Component to handle map centering and zoom
function MapHandler({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || 14, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
}

// Component to handle map clicks
function MapEvents({ onMapClick }) {
    useMapEvents({
        click(e) {
            if (onMapClick) {
                onMapClick({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                });
            }
        },
    });
    return null;
}

const MapView = ({ events, userLocation, mapCenter, selectedEvent, onMarkerClick, onMapClick }) => {
    const [currentCenter, setCurrentCenter] = useState([13.0827, 80.2707]);

    useEffect(() => {
        if (mapCenter) {
            setCurrentCenter([mapCenter.lat, mapCenter.lng]);
        } else if (userLocation) {
            setCurrentCenter([userLocation.lat, userLocation.lng]);
        }
    }, [mapCenter, userLocation]);

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer 
                center={currentCenter} 
                zoom={13} 
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MapHandler center={currentCenter} />
                <MapEvents onMapClick={onMapClick} />

                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}

                {events.map((event) => (
                    <Marker
                        key={event._id}
                        position={[
                            event.location.coordinates[1],
                            event.location.coordinates[0],
                        ]}
                        eventHandlers={{
                            click: () => onMarkerClick(event),
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="w-48 overflow-hidden rounded-lg">
                                {event.poster && (
                                    <div className="h-32 -mx-1 -mt-1 mb-3 overflow-hidden">
                                        <img 
                                            src={event.poster} 
                                            alt={event.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="mb-px">
                                    <span className="text-[8px] font-black text-purple-600 uppercase tracking-widest leading-none">{event.collegeName || 'Anonymous'}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{event.title}</h3>
                                <p className="text-[10px] text-gray-500 line-clamp-2 mb-3">{event.description}</p>
                                
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${event.location.coordinates[1]},${event.location.coordinates[0]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-center py-2 bg-purple-100 text-purple-700 text-[9px] font-black rounded-lg hover:bg-purple-200 transition-colors no-underline"
                                    >
                                        DIRECTIONS 📍
                                    </a>
                                    {event.link && (
                                        <a 
                                            href={event.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-center py-2 bg-purple-600 text-white text-[9px] font-black rounded-lg hover:bg-purple-700 transition-colors no-underline"
                                        >
                                            WEBSITE 🌐
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Re-add custom zoom controls in a nice position if needed */}
            <div className="absolute bottom-10 right-6 z-[1000] flex flex-col space-y-2">
                 <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('zoom-in'))}
                    className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center font-bold text-xl hover:bg-gray-50 active:scale-95"
                 >
                    +
                 </button>
            </div>
        </div>
    );
};

export default MapView;
