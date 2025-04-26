import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import logo from './assets/pitStopLogo.png';

function App() {
    const [restroom, setRestrooms] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", width: "100vw", position: "relative" }}>

            {/* Map takes full screen */}
            <MapContainer
                center={[43.615, -116.2023]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {restroom.map((restroom) => (
                    restroom.lat && restroom.lon && (
                        <Marker
                            key={restroom.id || restroom.name}
                            position={[restroom.lat, restroom.lon]}
                        >
                            <Popup>
                                <strong>{restroom.name}</strong><br />
                                {restroom.description || 'No description'}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            {/* Floating Top Nav Buttons */}
            <div style={{
                position: "absolute",
                top: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "1rem",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                zIndex: 1000
            }}>
                <button>Account</button>
                <button>Bookmarks</button>
                <button>History</button>
                <button>Settings</button>
            </div>

            {/* Floating Sidebar (Logo + Inputs) */}
            <div style={{
                position: "absolute",
                top: "6rem",
                left: "1rem",
                backgroundColor: "rgba(245, 240, 227, 0.9)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "250px",
                zIndex: 1000
            }}>
                <img
                    src={logo}
                    alt="PitStop Logo"
                    style={{ marginBottom: "2rem", maxWidth: "100%", height: "auto" }}
                />
                <input
                    type="text"
                    placeholder="Start Location"
                    style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                />
                <input
                    type="text"
                    placeholder="End Location"
                    style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                />
                <button style={{ padding: "0.75rem 1rem", width: "100%" }}>
                    Create Route
                </button>
            </div>

        </div>
    );
}

export default App;
