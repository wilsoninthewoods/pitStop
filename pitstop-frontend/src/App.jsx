import React, {useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [restroom, setRestrooms] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <ul>
          {setRestrooms.map((restroom) => (
            <li key={restroom.id}>
              <strong>{restroom.name}</strong><br />
              {restroom.location?.address || 'No address available'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
  export default App;
