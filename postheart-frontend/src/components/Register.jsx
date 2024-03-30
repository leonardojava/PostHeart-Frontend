import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/v1/registration', {
        firstName : firstName,
        lastName : lastName,
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // Registration was successful
        console.log('Registration successful');
      } else {
        // Handle error here
        console.error('Error registering');
      }
    } catch (error) {
      // Handle error here
      console.error('Error registering', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="firstName"
          value={firstName}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </label>
      <label>
        Last Name:
        <input
          type="lastName"
          value={lastName}
          onChange={(e) => setLastname(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;