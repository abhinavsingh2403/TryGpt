import { useState, useEffect } from 'react';

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  let phase = 'Welcome!';
  if (progress < 25) {
    phase = 'Initializing...';
  } else if (progress < 55) {
    phase = 'Loading models...';
  } else if (progress < 85) {
    phase = 'Almost ready...';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111128] to-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl animate-pulse [animation-delay:0.8s]" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center space-y-10">
        {/* Logo with spinning rings */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-indigo-500 animate-spin [animation-duration:2s]" />

          {/* Inner spinning ring (reverse) */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-violet-400 border-l-purple-400 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />

          {/* Logo circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <span className="text-white text-3xl font-bold tracking-tight">T</span>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            TryGPT
          </span>
        </h1>

        {/* Progress bar */}
        <div className="w-64 space-y-3">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Phase text and percentage */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 transition-all duration-300">{phase}</span>
            <span className="text-sm text-gray-500 tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
