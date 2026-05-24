import React, { useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { dummyPublishedImages } from '../assets/assets'

const Community = () => {
  const { navigate, theme } = useAppContext()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [likedCards, setLikedCards] = useState({})

  const isDark = theme === 'dark'

  // Duplicate images with different fake usernames to show 22+ cards
  const fakeUsernames = [
    'PixelDreamer', 'ArtfulMind', 'NeonVisions', 'CosmicBrush',
    'DreamForge', 'VisualPoet', 'ChromaWave', 'LuminStudio',
    'DigitalMuse', 'AetherArt', 'VividSpark',
  ]

  const galleryImages = [
    ...dummyPublishedImages,
    ...dummyPublishedImages.map((img, i) => ({
      ...img,
      userName: fakeUsernames[i % fakeUsernames.length],
    })),
  ]

  const tabs = ['All', 'Landscapes', 'Tech', 'People']

  // Create a masonry-like layout by assigning varied heights
  const getCardHeight = (index) => {
    const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-80', 'h-72', 'h-64', 'h-96', 'h-72', 'h-80', 'h-68']
    return heights[index % heights.length]
  }

  const toggleLike = (index) => {
    setLikedCards((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const uniqueCreators = [...new Set(galleryImages.map((img) => img.userName))].length

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
              ? 'bg-blue-500/15 text-blue-400'
              : 'bg-blue-100 text-blue-600'
          }`}
        >
          <span>🎨</span> COMMUNITY GALLERY
        </div>

        {/* Gradient heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>Explore </span>
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Creative Works
          </span>
        </h1>
        <p className={`max-w-lg mx-auto text-base ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          Discover stunning AI-generated images created by the TryGPT community. Get inspired and create your own.
        </p>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🖼️</span>
            <span className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-gray-900'}>{galleryImages.length}</strong> images
            </span>
          </div>
          <div className={`w-px h-4 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`}></div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👥</span>
            <span className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-gray-900'}>{uniqueCreators}</strong> creators
            </span>
          </div>
          <div className={`w-px h-4 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`}></div>
          <div className="flex items-center gap-2">
            <span className="text-lg">❤️</span>
            <span className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-gray-900'}>{Object.values(likedCards).filter(Boolean).length}</strong> likes
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  : isDark
                    ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid - Masonry */}
      <div className="flex-1 px-4 md:px-8 pb-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 max-w-7xl mx-auto">
          {galleryImages.map((item, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-4 opacity-0 animate-[fadeInUp_0.5s_ease_forwards]"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div
                className="group cursor-pointer relative rounded-2xl overflow-hidden"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={item.imageUrl}
                  alt={`AI generated by ${item.userName}`}
                  className={`w-full object-cover ${getCardHeight(i)} transition-transform duration-500 group-hover:scale-105`}
                  loading="lazy"
                />

                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredIndex === i ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Bottom info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div
                    className={`flex items-center justify-between transform transition-all duration-300 ${
                      hoveredIndex === i
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-white/20">
                        {item.userName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.userName}</p>
                        <p className="text-white/50 text-xs">AI Generated</p>
                      </div>
                    </div>

                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(i)
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        likedCards[i]
                          ? 'bg-red-500 scale-110'
                          : 'bg-white/15 backdrop-blur-sm hover:bg-white/25'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${likedCards[i] ? 'text-white' : 'text-white/80'}`}
                        fill={likedCards[i] ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Top action buttons on hover */}
                <div
                  className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
                    hoveredIndex === i
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-90'
                  }`}
                >
                  <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
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

export default Community
