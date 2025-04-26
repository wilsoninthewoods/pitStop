/**
 * @file App.jsx
 * @description
 * Main frontend application component for PitStop.
 *
 * Displays a Leaflet map centered on the user's location, populated with restroom locations
 * fetched from the backend API. Handles geolocation, API communication, loading state, and
 * dynamic rendering of restroom markers.
 */

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * PitStop main application component.
 *
 * @function
 * @returns {JSX.Element}
 * Renders the app title and either a loading message, an error, or an interactive map with restroom markers.
 */
function App() {
    const [restrooms, setRestrooms] = useState([]);       // Correct plural naming
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);              // Add error state
    const [userLocation, setUserLocation] = useState([43.615, -116.2023]); // Default: Boise

    /**
     * Fetches restroom data from the backend API.
     */
    const fetchRestrooms = async () => {
        const response = await axios.get('http://localhost:3001/api/restrooms');
        return response.data;
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([
                        position.coords.latitude,
                        position.coords.longitude
                    ]);
                },
                (error) => {
                    console.error('Error getting location, using default:', error);
                }
            );
        }

        fetchRestrooms()
            .then(data => {
                setRestrooms(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restrooms: ', error);
                setError(error.message);     // Capture the error message
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: "1rem", height: "100vh", width: "100vw", boxSizing: "border-box" }}>
            <h1>PitStop 🚻</h1>

            {loading && <p>Loading restrooms...</p>}

            {!loading && error && (
                <p style={{ color: 'red' }}>
                    Error loading restrooms: {error}
                </p>
            )}

            {!loading && !error && (
                <MapContainer
                    center={userLocation}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {restrooms.map((place) => (
                        place.lat && place.lon && (
                            <Marker
                                key={place.id}
                                position={[place.lat, place.lon]}
                            >
                                <Popup>
                                    <div>
                                        <strong>{place.name}</strong><br />
                                        {place.description || 'No description available'}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>
            )}
        </div>
    );
}

export default App;
