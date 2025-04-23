import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // 👈 Import the CSS file

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const sendOTP = async () => {
    try {
      const res = await axios.post('http://localhost:5000/send-otp', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid OTP.');
    }
  };

  return (
    <div className="container">
      {step === 1 && (
        <div className="card">
          <h2>Enter Email</h2>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
          <button onClick={sendOTP}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2>Enter OTP sent to <span className="highlight">{email}</span></h2>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2>✅ OTP Verified 🎉</h2>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
