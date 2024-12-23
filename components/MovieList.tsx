"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import useFetchMovieList from "@/hooks/useFetchMovieList";
import { CATEGORY_MAP } from "@/lib/constants";
import { Film, Tv, TrendingUp, Search, Loader2 } from "lucide-react";

const MovieList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  type Category = "popular" | "top_rated" | "tv_shows";

  const ROUTE_TO_CATEGORY: { [key: string]: Category } = {
    "/movies": "popular",
    "/tv-shows": "tv_shows",
    "/top-rated": "top_rated",
  };

  const CATEGORY_TO_ROUTE = Object.fromEntries(
    Object.entries(ROUTE_TO_CATEGORY).map(([k, v]) => [v, k])
  );

  const initialCategory = ROUTE_TO_CATEGORY[pathname] || "popular";
  const initialSearchQuery = searchParams.get("q") || "";

  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [contentType, setContentType] = useState<"movie" | "tv">("movie");

  useEffect(() => {
    const newPathname = CATEGORY_TO_ROUTE[category] || "/movies";
    const query = searchQuery ? `?q=${searchQuery}` : "";

    router.push(`${newPathname}${query}`, { scroll: false });
  }, [category, searchQuery]);

  const { content, isLoading, error, handleLoadMore } = useFetchMovieList({
    pageNum: page,
    isLoadMore: false,
    category,
    searchQuery,
    setHasMore,
    setPage,
    setContentType,
    setIsLoadingMore,
    contentType,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (
    newCategory: "popular" | "top_rated" | "tv_shows"
  ) => {
    setCategory(newCategory);
    setSearchQuery("");
    setPage(1);
    if (newCategory === "tv_shows") {
      setContentType("tv");
    } else {
      setContentType("movie");
    }
  };

  const getCategoryIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case "tv_shows":
        return <Tv className="w-4 h-4" />;
      case "top_rated":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Discover {category === "tv_shows" ? "TV Shows" : "Movies"}
          </h1>
          <p className="text-gray-400 text-lg">
            Find your next favorite entertainment
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search for ${
              category === "tv_shows" ? "TV shows" : "movies"
            }...`}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-4 bg-black/30 border border-gray-800 rounded-xl
              text-white placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 
              focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(ROUTE_TO_CATEGORY).map(([route, categoryKey]) => (
            <button
              key={categoryKey}
              onClick={() => handleCategoryChange(categoryKey)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2
                ${
                  category === categoryKey && !searchQuery
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                }`}
            >
              {getCategoryIcon(categoryKey)}
              <span>
                {route
                  .replace("/", "")
                  .replace("-", " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-xl h-[450px] animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border border-red-800 text-red-200 px-6 py-4 rounded-xl">
              <strong className="font-bold">Error! </strong>
              <span>{error}</span>
            </div>
          ) : content.length === 0 ? (
            <div className="bg-yellow-900/50 border border-yellow-800 text-yellow-200 px-6 py-4 rounded-xl">
              <strong className="font-bold">No Content Found! </strong>
              <span>
                {searchQuery
                  ? `No ${
                      contentType === "tv" ? "TV shows" : "movies"
                    } match your search query.`
                  : `No ${
                      contentType === "tv" ? "TV shows" : "movies"
                    } available.`}
              </span>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {content.map((item, i) => (
                  <MovieCard
                    key={item.id + i}
                    {...item}
                    poster_path={item.poster_path ?? ""}
                    category={CATEGORY_MAP[category] as "movie" | "tv"}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={()=>{
                      handleLoadMore(); 
                    }}
                    disabled={isLoadingMore}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full 
                      transition-all duration-300 hover:translate-y-[-2px] disabled:opacity-50 
                      disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
