import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "../hooks/UseKey";
const KEY = "cb3cde7d";
const API_URL = `http://www.omdbapi.com/?apikey=${KEY}`;

export default function MovieDetails({
  watched,
  selectedId,
  onAddWatch,
  onCloseMovie,
  onWishList,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(null);

  const watchedMovie = watched.find((watch) => watch.imdbID === selectedId);

  const { isWatched, userRating: rating } = watchedMovie
    ? { isWatched: true, userRating: watchedMovie.userRating }
    : { isWatched: false, userRating: null };

  // prettier-ignore
  const {imdbID, Title: title, Actors: actors, Director: director, Genre: genre, Plot: plot, Poster: poster, imdbRating, Runtime: runtime, Released: released, Year: year} = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID,
      title,
      poster,
      imdbRating,
      userRating,
      runtime,
    };

    onAddWatch(newWatchedMovie);
  }

  function handleWishList() {
    const wishMovie = {
      imdbID,
      title,
      poster,
      imdbRating,
      year,
    };
    onWishList((wishMovies) => [...wishMovies, wishMovie]);
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(`${API_URL}&i=${selectedId}`);
          if (!response.ok) throw new Error("Something went wrong!");
          const data = await response.json();
          if (data.Response === "False")
            throw new Error("We Could Not find that movie. Please try again!");
          console.log(data);
          setMovie(data);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      if (title) document.title = `${title}`;

      return () => (document.title = "useLearning");
    },
    [title]
  );

  if (isLoading) return <Loader />;

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt={title} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} . {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            <span>{imdbRating} imdb rating</span>
          </p>

          <div className="wishlist" onClick={() => handleWishList()}>
            <button className="wish-btn">💛</button>
          </div>
        </div>
      </header>
      <section>
        <div className="rating">
          {isWatched ? (
            <p>You rated this movie {rating}</p>
          ) : (
            <>
              <StarRating onRating={setUserRating} />
              {userRating && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to watchList
                </button>
              )}
            </>
          )}
        </div>
        <p>{plot}</p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
