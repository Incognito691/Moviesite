export interface MovieData {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
  genre_ids?: number[];
  category: "movie" | "tv" | "anime";
  magnetUri?: string;
}

export interface MoviePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: number;
  contentTitle: string;
  contentOverview: string;
  contentType: string;
  category?: string;
}

export interface EpisodeData {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
}

export interface SeasonData {
  season_number: number;
  name: string;
  episode_count: number;
  episodes?: EpisodeData[];
}
