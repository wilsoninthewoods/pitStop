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
 * Renders the app title and either a loading message or an interactive map with restroom markers.
 */
function App() {
    /**
     * State hook for storing restroom data fetched from the backend.
     *
     * @type {[Array<Object>, Function]}
     */
    const [restroom, setRestrooms] = useState([]);

    /**
     * State hook for tracking whether restroom data is still loading.
     *
     * @type {[boolean, Function]}
     */

    /**
     * Fetches restroom data from the backend API.
     *
     * @async
     * @function fetchRestrooms
     * @returns {Promise<Array<Object>>} Resolves to an array of restroom objects.
     */
    const fetchRestrooms = async () => {
        const response = await axios.get('http://localhost:3001/api/restrooms');
        return response.data;
    };

    const [loading, setLoading] = useState(true);

    /**
     * State hook for tracking the user's current location.
     * Defaults to Boise, Idaho if geolocation fails or is unavailable.
     *
     * @type {[Array<number>, Function]}
     * An array containing [latitude, longitude].
     */
    const [userLocation, setUserLocation] = useState([43.615, -116.2023]);

    /**
     * Effect hook that:
     *
     * - Attempts to fetch the user's current geolocation.
     * - Fetches restroom data from the backend API.
     *
     * Updates relevant state variables based on the results.
     *
     * @function
     * @returns {void}
     */
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

        // Fetch restrooms
        fetchRestrooms()
            .then(data => {
                setRestrooms(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restrooms: ', error);
                setLoading(false);
            });
    }, []);


    /**
     * Renders the main UI.
     * Displays either a loading indicator or a map populated with restroom markers.
     */
    return (
        <div style={{ padding: "1rem" }}>
            <h1>PitStop 🚻</h1>
            {loading ? (
                <p>Loading restrooms...</p>
            ) : (
                <MapContainer center={userLocation} zoom={13} style={{ height: "90vh", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {restroom.map((place) => (
                        place.lat && place.lon && (
                            <Marker
                                key={place.id}
                                position={[place.lat, place.lon]}
                            >
                                <Popup>
                                    <strong>{place.name}</strong><br />
                                    {place.description || 'No description available'}
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
