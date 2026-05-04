import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);

        const response = await axios.post(`${API_URL}/token`, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        localStorage.setItem('token', response.data.access_token);
        onAuthSuccess();
      } else {
        await axios.post(`${API_URL}/register`, {
          email,
          password,
          full_name: fullName
        });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card anim-slide-up">
        <div className="auth-header">
          <div className="shield-icon-container">
             <Shield size={32} fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" />
          </div>
          <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="auth-subtitle">{isLogin ? 'Login to access your contract analyses' : 'Join LexGuard AI for premium contract insights'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="input-label"><User size={16} /> FULL NAME</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="auth-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="input-label"><Mail size={16} /> EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="input-label"><Lock size={16} /> PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer-text">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
