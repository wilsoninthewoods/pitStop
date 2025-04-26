import React, {useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import { Marker } from 'leaflet';

function App() {
  const [restroom, setRestrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  // Later in production we would replace line 18 with something like this
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  //axios.get(`${API_URL}/api/restrooms`);


  useEffect(() => {
    //Fetch restrooms from our backend API
    axios.get('http://localhost:3000/api/restrooms')
    .then(response => {
      setRestrooms(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching restrooms: ', error);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "1rem"}}>
      <h1>PitStop 🚻</h1>
      {loading ? (
        <p>Loading restrooms...</p>
      ) : (
        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: "80vh", width: "100%"}}>
          <TitleLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {setRestrooms.map((restroom) => (
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
      )}
      </div>
  );
}
  export default App;
