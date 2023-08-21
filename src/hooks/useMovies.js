import { useEffect, useState } from "react";
import { API_URL } from "../utils/config";

export function useMovies(query, onClose) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      onClose?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(`${API_URL}&s=${query}&type=movie`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("Something went wrong!");
          const data = await response.json();
          if (data.Response === "False")
            throw new Error("We Could not find your query. Please try again!");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return () => {
        controller.abort();
      };
    },
    [query, onClose]
  );

  return { isLoading, movies, error };
}
