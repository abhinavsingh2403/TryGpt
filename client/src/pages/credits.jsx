
import { useAppContext } from '../context/Appcontext'
import { dummyPlans } from '../assets/assets'

const Credits = () => {
  const { user, navigate, theme } = useAppContext()

  const isDark = theme === 'dark'

  const planAccents = [
    {
      icon: '⚡',
      gradient: 'from-gray-500 to-slate-600',
      iconBg: isDark ? 'bg-white/10' : 'bg-gray-100',
      ring: isDark ? 'ring-white/10' : 'ring-gray-200',
      featured: false,
      badge: null,
    },
    {
      icon: '🚀',
      gradient: 'from-purple-600 to-blue-600',
      iconBg: isDark ? 'bg-purple-500/20' : 'bg-purple-100',
      ring: isDark ? 'ring-purple-500/30' : 'ring-purple-200',
      featured: true,
      badge: 'Most Popular',
    },
    {
      icon: '👑',
      gradient: 'from-amber-500 to-orange-500',
      iconBg: isDark ? 'bg-amber-500/20' : 'bg-amber-100',
      ring: isDark ? 'ring-amber-500/30' : 'ring-amber-200',
      featured: false,
      badge: 'Best Value',
    },
  ]

  return (
    <div className={`flex flex-col h-full overflow-y-auto ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="relative text-center pt-12 pb-8 px-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className={`absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
            isDark
              ? 'text-white/50 hover:text-white'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to chat
        </button>

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${
            isDark
              ? 'bg-purple-500/15 text-purple-400'
              : 'bg-purple-100 text-purple-600'
          }`}
        >
          <span>💎</span> PRICING
        </div>

        {/* Gradient heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>Choose Your </span>
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Plan
          </span>
        </h1>
        <p className={`max-w-lg mx-auto text-base ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          Unlock the full power of TryGPT with credits. Generate text, images, and more.
        </p>

        {/* Current credits */}
        {user && (
          <div
            className={`inline-flex items-center gap-3 mt-6 px-6 py-3 rounded-2xl border backdrop-blur-md ${
              isDark
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <span className="text-xl">✨</span>
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Your balance:</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              {user.credits}
            </span>
            <span className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>credits</span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="flex-1 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-start">
          {dummyPlans.map((plan, i) => {
            const accent = planAccents[i]
            return (
              <div
                key={plan._id}
                className={`relative rounded-2xl p-6 md:p-8 flex flex-col border backdrop-blur-md transition-all duration-300 hover:shadow-2xl opacity-0 animate-[fadeInUp_0.5s_ease_forwards] ${
                  accent.featured ? 'md:-mt-4 md:mb-4 md:scale-105 z-10' : ''
                } ring-1 ${accent.ring} ${
                  isDark
                    ? accent.featured
                      ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                    : accent.featured
                      ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg shadow-purple-100'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Badge */}
                {accent.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-5 py-1.5 rounded-full bg-gradient-to-r ${accent.gradient} text-white text-xs font-semibold shadow-lg`}>
                      {accent.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${accent.iconBg} flex items-center justify-center mb-5`}>
                  <span className="text-2xl">{accent.icon}</span>
                </div>

                {/* Plan name */}
                <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  {plan.credits} credits included
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className={`text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>/one-time</span>
                </div>

                {/* Features */}
                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    accent.featured
                      ? `bg-gradient-to-r ${accent.gradient} text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30`
                      : i === 2
                        ? `bg-gradient-to-r ${accent.gradient} text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30`
                        : isDark
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get {plan.name}
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom guarantee text */}
        <div className="text-center mt-10">
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            🔒 Secure payment &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Instant delivery
          </p>
        </div>
      </div>

      {/* Keyframe animation style */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Credits
