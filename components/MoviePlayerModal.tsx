import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MoviePlayerModalProps, SeasonData, EpisodeData } from "@/types";
import { X, Loader2, Film, Tv } from "lucide-react";

interface EnhancedMoviePlayerModalProps extends MoviePlayerModalProps {
  category?: "movie" | "tv";
}

const MoviePlayerModal: React.FC<EnhancedMoviePlayerModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  contentOverview,
  contentType,
}) => {
  const modalContentRef = React.useRef<HTMLDivElement>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasons, setSeasons] = useState<SeasonData[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(false);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchEpisodes = useCallback(
    async (seasonNumber: number) => {
      if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
        setError("API key is missing");
        return;
      }

      setIsLoadingEpisodes(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${contentId}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch episodes");
        }

        const data = await response.json();
        setEpisodes(data.episodes || []);
        setSelectedEpisode(1);
      } catch (err) {
        console.error("Error fetching episodes:", err);
        setError("Unable to load episodes. Please try again.");
      } finally {
        setIsLoadingEpisodes(false);
      }
    },
    [contentId]
  );

  const fetchSeasons = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      setError("API key is missing");
      return;
    }

    setIsLoadingSeasons(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${contentId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch seasons");
      }

      const data = await response.json();
      const filteredSeasons = data.seasons.filter(
        (season: SeasonData) => season.season_number > 0
      );

      setSeasons(filteredSeasons);

      if (filteredSeasons.length > 0) {
        await fetchEpisodes(filteredSeasons[0].season_number);
      }
    } catch (err) {
      console.error("Error fetching seasons:", err);
      setError("Unable to load seasons. Please try again.");
    } finally {
      setIsLoadingSeasons(false);
    }
  }, [contentId, fetchEpisodes]);

  const embedUrl = useMemo(() => {
    return contentType === "movie"
      ? `https://vidsrc.icu/embed/movie/${contentId}`
      : `https://vidsrc.icu/embed/tv/${contentId}/${selectedSeason}/${selectedEpisode}`;
  }, [contentId, contentType, selectedSeason, selectedEpisode]);

  useEffect(() => {
    if (isOpen && contentType === "tv") {
      fetchSeasons();
    }
  }, [isOpen, contentType, fetchSeasons]);

  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    await fetchEpisodes(seasonNumber);
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscKey);

      return () => {
        document.body.style.overflow = "auto";
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto transition-all duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-6xl bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl border border-gray-700/50 animate-fade-in-up overflow-y-auto max-h-[90vh] my-auto transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2.5 text-gray-400 hover:text-red-500 bg-gray-800/70 hover:bg-gray-700/70 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring:red-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="p-8 sm:p-10 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center gap-4 mb-6">
            {contentType === "tv" ? (
              <Tv className="w-8 h-8 text-red-500" />
            ) : (
              <Film className="w-8 h-8 text-red-500" />
            )}
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
              {contentTitle}
            </h3>
          </div>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mt-4 font-light tracking-wide">
            {contentOverview}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 my-4 p-4 bg-red-900/30 border border-red-800/50 text-red-400 text-center rounded-xl backdrop-blur-sm shadow-lg">
            {error}
          </div>
        )}

        {/* TV Show Controls */}
        {contentType === "tv" && (
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  disabled={isLoadingSeasons}
                  className="w-full px-4 py-3 bg-gray-800/70 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring:red-500 focus:border-transparent transition-all duration-300 ease-in-out hover:bg-gray-700/70 cursor-pointer appearance-none"
                >
                  {isLoadingSeasons ? (
                    <option>Loading seasons...</option>
                  ) : (
                    seasons.map((season) => (
                      <option
                        key={season.season_number}
                        value={season.season_number}
                      >
                        {season.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Episode Select */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Episode</label>
                <select
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  disabled={isLoadingEpisodes}
                  className="w-full px-4 py-3 bg-gray-800/70 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring:red-500 focus:border-transparent transition-all duration-300 ease-in-out hover:bg-gray-700/70 cursor-pointer appearance-none"
                >
                  {isLoadingEpisodes ? (
                    <option>Loading episodes...</option>
                  ) : (
                    episodes.map((episode) => (
                      <option
                        key={episode.episode_number}
                        value={episode.episode_number}
                      >
                        Ep {episode.episode_number}: {episode.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        <div className="relative pt-[56.25%] bg-black rounded-b-xl overflow-hidden shadow-inner">
          {(isLoadingSeasons || isLoadingEpisodes) && !error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin filter drop-shadow-lg" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              style={{ minHeight: "400px" }}
              scrolling="no"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePlayerModal;
