import { API_ENDPOINTS } from "@/lib/constants";
import { MovieData } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

type ContentType = "movie" | "tv";
type Category = "popular" | "top_rated" | "tv_shows";

interface Params {
  pageNum: number;
  isLoadMore: boolean;
  category: Category;
  searchQuery: string;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setContentType: React.Dispatch<React.SetStateAction<ContentType>>;
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  contentType: "movie" | "tv";
}

interface ProcessedMovieData {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  media_type: ContentType;
}

const useFetchMovieList = ({
  pageNum,
  category,
  searchQuery,
  setHasMore,
  setPage,
  setContentType,
}: Params) => {
  const [content, setContent] = useState<ProcessedMovieData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const buildAPIUrl = useCallback(
    (pageNum: number): string => {
      const baseParams = `api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${pageNum}`;
      const currentType = category === "tv_shows" ? "tv" : "movie";

      if (searchQuery.trim()) {
        return `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/search/${currentType}?${baseParams}&query=${encodeURIComponent(
          searchQuery.trim()
        )}&include_adult=false`;
      }

      const endpoint =
        category === "tv_shows"
          ? API_ENDPOINTS.tv.popular
          : API_ENDPOINTS[currentType][
              category as keyof typeof API_ENDPOINTS.movie
            ];

      return `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/${endpoint}?${baseParams}`;
    },
    [category, searchQuery]
  );

  const processContent = useCallback(
    (items: MovieData[]): ProcessedMovieData[] => {
      return items.map((item) => ({
        id: item.id,
        title: item.title || item.name || "",
        name: item.name,
        poster_path: item.poster_path ?? null,
        overview: item.overview || "",
        release_date: item.release_date || item.first_air_date || "",
        first_air_date: item.first_air_date || "",
        vote_average: item.vote_average ?? 0,
        media_type: category === "tv_shows" ? "tv" : "movie",
      }));
    },
    [category]
  );

  const fetchContent = useCallback(
    async (pageNum: number, isLoadMore: boolean) => {
      try {
        const url = buildAPIUrl(pageNum);
        console.log("Fetching URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        setHasMore(pageNum < data.total_pages);

        const processedContent = processContent(data.results);
        console.log("Processed content:", processedContent);

        setContent((prevContent) =>
          isLoadMore ? [...prevContent, ...processedContent] : processedContent
        );
      } catch (error) {
        console.error("Error fetching content:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching content."
        );
        setContent([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [buildAPIUrl, processContent, setHasMore]
  );

  const updateURL = useCallback(
    (newCategory: Category, newQuery: string) => {
      const params = new URLSearchParams(searchParams);

      if (newCategory === "tv_shows") {
        setContentType("tv");
        const newUrl = `/tv-shows${newQuery ? `?q=${newQuery}` : ""}`;
        router.push(newUrl);
        return;
      } else {
        setContentType("movie");
      }

      if (newCategory !== "popular") {
        params.set("category", newCategory);
      } else {
        params.delete("category");
      }

      if (newQuery) {
        params.set("q", newQuery);
      } else {
        params.delete("q");
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.push(newUrl);
    },
    [searchParams, pathname, router, setContentType]
  );

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    const nextPage = pageNum + 1;
    setPage(nextPage);
    await fetchContent(nextPage, true);
  }, [pageNum, fetchContent, setPage]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setPage(1);

    if (category === "tv_shows") {
      setContentType("tv");
    } else {
      setContentType("movie");
    }

    const timer = setTimeout(() => {
      fetchContent(1, false);
      updateURL(category, searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [category, searchQuery, fetchContent, updateURL, setPage, setContentType]);

  return {
    content,
    isLoading,
    isLoadingMore,
    error,
    handleLoadMore,
  };
};

export default useFetchMovieList;
