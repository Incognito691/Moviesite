"use client";

import React, { useState, useMemo } from "react";
import MoviePlayerModal from "@/components/MoviePlayerModal";
import { MovieData } from "@/types";
import Image from "next/image";
import { Star, Calendar, Film, Tv } from "lucide-react";

const MovieCard = ({
  title,
  poster_path,
  overview,
  release_date,
  vote_average,
  first_air_date,
  name,
  id,
  media_type,
}: MovieData & { media_type?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const cardDetails = useMemo(() => {
    const contentType = media_type || (title ? "movie" : "tv");
    const displayTitle = title || name || "Untitled";
    const displayDate = release_date || first_air_date;
    const imageUrl = poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Ejk6aKUozkJpLOEUY5BVG-NWuBpnUfVwt9_aVOY_ATGtSv4IoUQsExieE6YTIxYJ93g&usqp=CAU";

    return {
      contentType,
      displayTitle,
      displayDate,
      imageUrl,
    };
  }, [title, name, poster_path, media_type, release_date, first_air_date]);

  const handleCardClick = () => setIsModalOpen(true);
  const handleImageLoad = () => setIsImageLoaded(true);

  const renderRatingBadge = () => {
    const ratingColor =
      vote_average >= 7
        ? "bg-green-500"
        : vote_average >= 5
        ? "bg-yellow-500"
        : "bg-red-500";

    return (
      <div
        className={`absolute top-3 right-3 ${ratingColor} text-white px-2.5 py-1 
        rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm`}
      >
        <Star className="w-3 h-3" />
        {vote_average.toFixed(1)}
      </div>
    );
  };

  return (
    <>
      <div
        className="group relative w-full max-w-[300px] mx-auto bg-black/40 backdrop-blur-md 
          rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 
          transform hover:-translate-y-2 cursor-pointer border border-gray-800/50"
        onClick={handleCardClick}
      >
        {/* Poster Image Container */}
        <div
          className={`relative w-full aspect-[2/3] overflow-hidden ${
            !isImageLoaded ? "animate-pulse bg-gray-800/50" : ""
          }`}
        >
          <Image
            src={cardDetails.imageUrl}
            alt={`${cardDetails.displayTitle} ${cardDetails.displayDate || ""}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 group-hover:scale-110 
              ${!isImageLoaded ? "opacity-0" : "opacity-100"}`}
            onLoad={handleImageLoad}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/movie-placeholder.jpg";
            }}
          />

          {/* Rating Badge */}
          {renderRatingBadge()}

          {/* Hover Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent 
            opacity-0 group-hover:opacity-100 transition-all duration-500"
          >
            {/* Overview Text */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full 
              group-hover:translate-y-0 transition-transform duration-500"
            >
              <p className="text-sm text-gray-200 line-clamp-3">{overview}</p>
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-4 space-y-2 bg-gradient-to-t from-black/80 to-black/40">
          <h2
            className="text-base font-bold text-white group-hover:text-red-500 
            transition-colors duration-300 truncate"
          >
            {cardDetails.displayTitle}
          </h2>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {cardDetails.displayDate
                  ? new Date(cardDetails.displayDate).getFullYear()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              {cardDetails.contentType === "movie" ? (
                <Film className="w-4 h-4" />
              ) : (
                <Tv className="w-4 h-4" />
              )}
              <span className="uppercase text-xs tracking-wider">
                {cardDetails.contentType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <MoviePlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentTitle={cardDetails.displayTitle}
        contentOverview={overview}
        contentId={id}
        contentType={cardDetails.contentType}
      />
    </>
  );
};

export default MovieCard;
