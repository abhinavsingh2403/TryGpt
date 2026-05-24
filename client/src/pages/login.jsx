import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/Appcontext';
import { api } from '../utils/api';

const Login = () => {
  const { login, theme } = useAppContext();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Mouse tracking for interactive background
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  // Auto-typing tagline
  const [typedText, setTypedText] = useState('');
  const taglines = [
    "Experience the power of AI conversation.",
    "Write a Python script instantly.",
    "Generate a beautiful landscape image.",
    "Debug your code perfectly."
  ];

  useEffect(() => {
    let currentIdx = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 100;
    let timeoutId;

    const type = () => {
      const fullText = taglines[currentIdx];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
        typingSpeed = 30;
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
        typingSpeed = 80;
      }
      
      setTypedText(currentText);
      
      if (!isDeleting && currentText === fullText) {
        typingSpeed = 2500; // pause at end
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIdx = (currentIdx + 1) % taglines.length;
        typingSpeed = 500; // pause before typing new
      }
      
      timeoutId = setTimeout(type, typingSpeed);
    };
    
    timeoutId = setTimeout(type, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const data = await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('trygpt-token', data.token);
        login(data);
      } else {
        const data = await api.login({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('trygpt-token', data.token);
        login(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    login(); // Simulate social login for now
  };

  const isDark = theme === 'dark';

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`min-h-screen flex overflow-hidden relative transition-colors duration-500 ${isDark ? 'bg-[#0a0a14]' : 'bg-gray-50'}`}
    >
      {/* Interactive Global Background Elements */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
      >
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse-slow ${isDark ? 'bg-purple-600/20' : 'bg-purple-400/20'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] animate-pulse-slow [animation-delay:2s] ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-400/20'}`} />
      </div>

      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col items-center justify-center p-12">
        <div 
          className="relative z-10 flex flex-col items-center text-center space-y-8 transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px) perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${mousePos.y * -10}deg)` }}
        >
          {/* Logo with interactive glow */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl ring-1 ring-white/20">
              <span className="text-white text-5xl font-bold tracking-tight">T</span>
            </div>
          </div>

          {/* App Name */}
          <h1 className={`text-6xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Try<span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">GPT</span>
          </h1>

          {/* Auto-typing Tagline */}
          <div className="h-16 flex items-center justify-center">
            <p className={`text-xl max-w-sm leading-relaxed font-light ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {typedText}<span className="animate-ping">|</span>
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['AI Powered', 'Lightning Fast', 'Multimodal Vision', 'Secure & Private'].map((feature, i) => (
              <span
                key={feature}
                className={`px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] ${
                  isDark ? 'bg-white/5 text-gray-200 border-white/10' : 'bg-white/50 text-gray-700 border-purple-100 shadow-sm'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 z-10 relative">
        <div 
          className={`w-full max-w-md p-8 sm:p-10 rounded-3xl transition-transform duration-500 ease-out ${isDark ? 'glass-panel-dark' : 'bg-white/70 backdrop-blur-xl border border-white shadow-2xl'}`}
          style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>TryGPT</h2>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isSignup ? 'Sign up to start your immersive AI journey' : 'Sign in to continue your conversation'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="relative group glow-border rounded-xl transition-all duration-300">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className={`w-full px-5 py-4 rounded-xl border-transparent text-sm outline-none transition-all duration-200 bg-transparent ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                />
                <div className={`absolute inset-0 pointer-events-none border rounded-xl transition-colors ${isDark ? 'border-white/10' : 'border-gray-200 group-hover:border-purple-300'}`}></div>
              </div>
            )}

            <div className="relative group glow-border rounded-xl transition-all duration-300">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className={`w-full px-5 py-4 rounded-xl border-transparent text-sm outline-none transition-all duration-200 bg-transparent ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
              <div className={`absolute inset-0 pointer-events-none border rounded-xl transition-colors ${isDark ? 'border-white/10' : 'border-gray-200 group-hover:border-purple-300'}`}></div>
            </div>

            <div className="relative group glow-border rounded-xl transition-all duration-300">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className={`w-full px-5 py-4 rounded-xl border-transparent text-sm outline-none transition-all duration-200 bg-transparent ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
              />
              <div className={`absolute inset-0 pointer-events-none border rounded-xl transition-colors ${isDark ? 'border-white/10' : 'border-gray-200 group-hover:border-purple-300'}`}></div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 animate-gradient"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            <span className={`px-4 text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>or continue with</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleSocialLogin}
              className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:-translate-y-1 ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              onClick={handleSocialLogin}
              className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:-translate-y-1 ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <svg className={`w-5 h-5 ${isDark ? 'fill-white' : 'fill-gray-900'}`} viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle Link */}
          <p className={`text-center mt-10 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer ml-1 hover:underline underline-offset-4"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
