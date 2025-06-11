import React, { useState } from "react";
import '../register/register.css';
import { Link, useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailErr, setLoginEmailErr] = useState(false);
  const [loginPasswordErr, setPasswordErr] = useState(false);
  const [incorrectErr, setIncorrectErr] = useState(false);

  const history = useHistory();

  async function loginValidation() {
    setLoginEmailErr(!loginEmail.trim());
    setPasswordErr(!loginPassword.trim());

    if (!loginEmail || !loginPassword) return;

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setIncorrectErr(false);
      history.push('/home');
    } catch (error) {
      console.error(error);
      setIncorrectErr(true);
    }
  }

  return (
    <div className="login-body">
      <div className="login-main">
        <h1>Login</h1>
        {incorrectErr && (
          <small style={{ color: 'red', textAlign: 'center' }}>
            Incorrect email or password
          </small>
        )}
        <br />
        <p>Email</p>
        <input
          type="text"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        {loginEmailErr && (
          <small style={{ color: '#d3521d' }}>
            Please enter your email
          </small>
        )}
        <br />
        <p>Password</p>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        {loginPasswordErr && (
          <small style={{ color: '#d3521d' }}>
            Please enter your password
          </small>
        )}
        <br />
        <button onClick={loginValidation}>Login</button>
        <br />
        <p style={{ fontSize: '15px' }}>
          Don’t have an account yet? <Link to="/">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
