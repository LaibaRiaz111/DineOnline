import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../register/register.css";
import { auth } from "../../firebase";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [nameErr, setnameErr] = useState(false);
  const history = useHistory();

  async function registertration() {
    if (!username.trim() || !password.trim() || !email.trim()) {
      setnameErr(true);
      return;
    }

    if (!email.includes('@') || !email.includes('.') || !email.includes('com')) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 5) {
      alert('Please enter a password with more than five characters');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User registered:", user);
      // Optionally save extra user info (like username) in Firestore later
      history.push('/login');
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  }

  return (
    <div className="register-body">
      <div className="register-main">
        <h1>Register Form</h1>
        {nameErr && <p className="errP">*Please fill every input field*</p>}
        <br />
        <p>Name</p>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <p>Email</p>
        <input
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <p>Password</p>
        <input
          type='password'
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        /><br /><br />
        <button onClick={registertration}>Register</button>
      </div>
    </div>
  );
}

export default Register;
