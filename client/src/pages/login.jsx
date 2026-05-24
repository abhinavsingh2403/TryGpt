import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/Appcontext';
import { api } from '../utils/api';

const Login = () => {
  const { login, theme } = useAppContext();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
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
  useEffect(() => {
    const taglines = [
      "Experience the power of AI conversation.",
      "Write a Python script instantly.",
      "Generate a beautiful landscape image.",
      "Debug your code perfectly."
    ];
    
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

    if (isForgotPassword) {
      // Simulate sending a reset link
      setTimeout(() => {
        setLoading(false);
        setResetSent(true);
      }, 1500);
      return;
    }

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
              {isForgotPassword ? 'Reset Password' : isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isForgotPassword 
                ? 'Enter your email to receive a secure reset link' 
                : isSignup 
                  ? 'Sign up to start your immersive AI journey' 
                  : 'Sign in to continue your conversation'}
            </p>
          </div>

          {/* Form */}
          {resetSent ? (
            <div className={`p-6 rounded-2xl text-center border ${isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'}`}>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Check your email</h3>
              <p className="text-sm opacity-90 mb-6">
                We've sent a password reset link to <strong>{formData.email}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setIsForgotPassword(false);
                }}
                className="text-purple-500 hover:text-purple-400 font-semibold text-sm transition-colors"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isForgotPassword && isSignup && (
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

              {!isForgotPassword && (
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
              )}

              {!isForgotPassword && !isSignup && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

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
                      <span>{isForgotPassword ? 'Sending...' : 'Authenticating...'}</span>
                    </>
                  ) : (
                    <span>{isForgotPassword ? 'Send Reset Link' : isSignup ? 'Create Account' : 'Sign In'}</span>
                  )}
                </div>
              </button>
            </form>
          )}

          {/* Toggle Link */}
          {!isForgotPassword ? (
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
          ) : (
            <p className={`text-center mt-10 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer ml-1 hover:underline underline-offset-4"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
