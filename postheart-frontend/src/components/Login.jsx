import React, { useState, /*useRef*/ useEffect } from 'react';
//import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import { useNavigate , Link} from 'react-router-dom';
//TODO: make new advanced marker component too i guess
const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 48.75112, lng: 238.74011
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    try {
      const response = await axios.post('http://localhost:8080/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });
      //Home is temporary? eventually implement on login to load in user map
      if (response.status === 200 && !response.data.includes('Invalid')) {
        setIsLoggedIn(true);
        setMarkers(response.data);
      } else {
        console.log(response.data)
        console.error('Error logging in');
      }
    } catch (error) {
      console.error('Error logging in', error.response);
    }
  };
 

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [markers, setMarkers] = useState([]);
  const handleMarkerSubmit = async (event) => {
  event.preventDefault();

  try {
    const marker = {lat,lng};
    const response = await axios.post(`http://localhost:8080/api/v1/user/${username}/markers`, {

      lat: marker.lat,
      lng: marker.lng
    });

    if (response.status === 200) {
      // Add the new marker to the markers array
      setMarkers([...markers, { lat, lng }]);
    } else {
      console.error('Error adding marker');
    }
  } catch (error) {
    console.error('Error adding marker', error.response);
  }
};
useEffect(() => {
  if(isLoggedIn){
  const fetchMarkers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/${username}/markers`);

      if (response.status === 200) {
        setMarkers(response.data);
      } else {
        console.error('Error fetching markers');
      }
    } catch (error) {
      console.error('Error fetching markers', error.response);
    }
  };

  fetchMarkers();
}
}, [username, isLoggedIn]);
  



  

  return (
    <>
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Log in</button>
      <p>
        Don't have an account? <Link to="/Register">Register</Link>
      </p>
    </form>
    
    <LoadScript googleMapsApiKey= {process.env.REACT_APP_APIKEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
        >
          {Array.isArray(markers) && markers.map((marker, index) => (
          <Marker key={index} position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}  />
          ))}
          
        </GoogleMap>
        <form onSubmit={handleMarkerSubmit}>
          <label>
            Latitude:
            <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} />
          </label>
        <label>
          Longitude:
          <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} />
        </label>
        <button type="submit">Add Marker</button>
        </form>
        
      </LoadScript>
    </>
    
    
  );
};

export default Login;
