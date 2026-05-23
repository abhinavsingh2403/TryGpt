import React, { useState } from 'react';
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
    login();
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#0e0e1a]' : 'bg-gray-50'}`}>
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1a1a3e] via-[#2d1b69] to-[#1a1040] flex-col items-center justify-center p-12">
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-16 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <span className="text-white text-4xl font-bold tracking-tight">T</span>
          </div>

          {/* App Name */}
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            Try<span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">GPT</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg text-gray-300 max-w-sm leading-relaxed">
            Experience the power of AI conversation. Smart, fast, and always ready to help.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['AI Powered', 'Lightning Fast', 'Always Learning', 'Secure & Private'].map(
              (feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-200 backdrop-blur-sm border border-white/10"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div
        className={`w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 ${
          theme === 'dark' ? 'bg-[#0e0e1a]' : 'bg-gray-50'
        }`}
      >
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            TryGPT
          </h2>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2
              className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {isSignup ? 'Create account' : 'Welcome back'}
            </h2>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {isSignup
                ? 'Sign up to start your AI journey'
                : 'Sign in to continue your conversation'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                  }`}
                />
              </div>
            )}

            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1.5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-purple-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Please wait...</span>
                </>
              ) : isSignup ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
            <span className={`px-4 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              or continue with
            </span>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSocialLogin}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>

            <button
              onClick={handleSocialLogin}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg
                className={`w-5 h-5 ${theme === 'dark' ? 'fill-white' : 'fill-gray-900'}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle Link */}
          <p
            className={`text-center mt-8 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
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
