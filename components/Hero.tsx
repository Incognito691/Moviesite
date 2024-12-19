"use client";

import Link from "next/link";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Play, Film, PlayCircle } from "lucide-react";

const Hero: React.FC = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <ReactPlayer
          className="absolute top-0 left-0 w-full h-full object-cover"
          url="/video.mp4"
          width="100%"
          height="100%"
          playing
          loop
          muted
          playsinline
          onReady={() => setIsVideoLoaded(true)}
          style={{
            opacity: isVideoLoaded ? 0.3 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        />
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
              <span className="text-lg sm:text-xl text-white">Loading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-[100dvh] flex items-center">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8 py-8 sm:py-12">
          {/* Logo section with better spacing */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full">
            <Film className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <span className="text-red-500 text-xs sm:text-sm font-semibold tracking-wider">
              MOVIESTREAM
            </span>
          </div>

          {/* Heading with improved responsive sizing and line height */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] sm:leading-tight animate-fadeIn px-4 sm:px-8">
            Unlimited Entertainment{" "}
            <span className="block mt-2 text-red-500">At Your Fingertips</span>
          </h1>

          {/* Description with better padding and line height */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-lg sm:max-w-xl mx-auto animate-fadeIn delay-200 leading-relaxed px-6 sm:px-8">
            Stream thousands of movies and TV shows instantly. Experience
            cinema-quality entertainment from the comfort of your home.
          </p>

          {/* Buttons with improved mobile layout */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center animate-fadeIn delay-300 px-6 sm:px-0">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 
              bg-red-600 hover:bg-red-700 rounded-full text-white text-sm sm:text-base font-semibold 
              transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-red-600/50"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Start Watching Now
            </Link>
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 
              bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white 
              text-sm sm:text-base font-semibold transition-all duration-300 hover:translate-y-[-2px]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
