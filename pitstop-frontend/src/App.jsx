/**
 * @file App.jsx
 * @description
 * Main frontend application component for PitStop.
 *
 * Displays a Leaflet map populated with restroom locations fetched from the backend API.
 * Handles API communication, loading state, and dynamic rendering of restroom markers.
 */

import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


/**
 * PitStop main application component.
 *
 * @function
 * @returns {JSX.Element}
 * Renders a title and either a loading message or a map populated with restroom markers.
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
  const [loading, setLoading] = useState(true);
  // Later in production we would replace line 18 with something like this
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  //axios.get(`${API_URL}/api/restrooms`);


  /**
   * Fetches restroom data from the backend API on initial component mount.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    axios.get('http://localhost:3001/api/restrooms')
        .then(response => {
          setRestrooms(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching restrooms: ', error);
          setLoading(false);
        });
  }, []);

  if (loading){
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2x1 font-bold">Loading...</h1>
        </div>
    );
  }

  /**
   * Renders the UI based on the loading state and available restroom data.
   */
  return(
    <div style={{height: "100vh", width: "100vw", display: "flex", flexDirection: "column"}}>
        {/* Top Navigation Buttons */}
        <div style={{ display: "flex", gap: "1rem", padding: "1rem"}}>
            <button>Account</button>
            <button>Bookmarks</button>
            <button>History</button>
            <button>Settings</button>
        </div>

        {/* Main Body: Map & Side Panel */}
        <div style={{flex: 1 }}>
            <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{height: "100%", width: "100%" }}>
                <TitleLayer
                    attribution='&copy; OpenStreerMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {restroom.map((restroom) => (
                    restroom.location?.lat && restroom.location?.lng && (
                        <Marker
                            key={restroom.id}
                            position={[restroom.location.lat, restroom.location.lng]}
                        >
                            <Popup>
                                <strong>{restroom.name}</strong><br />
                                {restroom.location.address || 'No address'}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>

        {/* Right side: Logo & Inputs */}
        <div style={{width: "300px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#f5f0e3" }}>

            {/* Logo */}
            <img
                src=""
                alt="Logo"
                style={{ marginBottom: "2rem"}}
        </div>
    </div>
  );

  //return (
  //    <div style={{ padding: "1rem" }}>
  //      <h1>PitStop 🚻</h1>
  //      {loading ? (
  //          <p>Loading restrooms...</p>
  //      ) : (
  //          <MapContainer center={[43.615, -116.2023]} zoom={13} style={{ height: "80vh", width: "100%" }}>
  //              <TileLayer
  //                  attribution='&copy; OpenStreetMap contributors'
  //                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //              />
  //              {restroom.map((place) => (
  //                  place.lat && place.lon && (
  //                      <Marker
  //                          key={place.id}
  //                          position={[place.lat, place.lon]}
  //                      >
  //                          <Popup>
  //                              <strong>{place.name}</strong><br />
  //                              {place.description || 'No description available'}
  //                          </Popup>
  //                      </Marker>
  //                  )
  //              ))}
  //          </MapContainer>
  //      )}
  //    </div>
  //);
}

export default App;