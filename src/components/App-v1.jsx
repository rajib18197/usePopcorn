import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const KEY = "cb3cde7d";
const API_URL = `http://www.omdbapi.com/?apikey=${KEY}`;

export default function App() {
  const [query, setQuery] = useState("interstellar");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  function handleSelect(selectedId) {
    setSelectedId((id) => (id === selectedId ? null : selectedId));
  }

  function handleClose() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch(`${API_URL}&s=${query}`);
          const data = await response.json();
          console.log(data);
          setMovies(data.Search);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        return;
      }

      fetchMovies();
    },
    [query]
  );
  console.log(selectedId);

  return (
    <div>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults results={movies.length} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              key={movies.imdbId}
              onSelectMovie={handleSelect}
            />
          )}
          {error && <Error message={error} />}
        </Box>

        <Box>
          <>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleClose}
                onAddWatched={setWatched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList watched={watched} />
              </>
            )}
          </>
        </Box>
      </Main>
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Error({ message }) {
  return <p>{message}</p>;
}

function Navbar({ children }) {
  return <div className="nav-bar">{children}</div>;
}

function Logo() {
  return (
    <div className="logo">
      <span>List</span>
      <h1>Box</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      type="text"
      placeholder="Search here..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="search"
    />
  );
}

function NumResults({ results }) {
  return (
    <p className="num-results">
      Found <strong>{results}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  console.log(movies);
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={`${movie.Poster}`} alt="" />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(null);

  // prettier-ignore
  const {imdbID, Title: title, Actors: actors, Director: director, Genre: genre, Plot: plot, Poster: poster, imdbRating, Runtime: runtime, Released: released} = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID,
      title,
      runtime,
      userRating,
      imdbRating,
      poster,
    };
    console.log(newWatchedMovie);
    onAddWatched((watch) => [...watch, newWatchedMovie]);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function fetchMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(`${API_URL}&i=${selectedId}`);
          const data = await response.json();
          console.log(data);
          setMovie(data);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }

      document.addEventListener("keydown", callback);

      return () => document.addEventListener("keydown", callback);
    },
    [onCloseMovie]
  );

  if (isLoading) return <Loader />;

  if (Object.keys(movie).length === 0) return <Loader />;
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
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating onRating={setUserRating} />
          {userRating && (
            <button className="btn-add" onClick={handleAdd}>
              + Add to watchList
            </button>
          )}
        </div>
        <p>{plot}</p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function WatchedSummary({ watched }) {
  const totalMovies = watched.length;
  const avgImdbRating =
    watched.reduce((acc, cur) => acc + cur.imdbRating, 0) / totalMovies;
  const avgUserRating =
    watched.reduce((acc, cur) => acc + cur.userRating, 0) / totalMovies;
  const runtime = watched.reduce((acc, cur) => acc + cur.runtime, 0);

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{totalMovies} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtime} mins</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((watch) => (
        <Watch watch={watch} key={watch.imdbID} />
      ))}
    </ul>
  );
}

function Watch({ watch }) {
  return (
    <li>
      <img src={`${watch.poster}`} alt="" />
      <h3>{watch.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{watch.imdbRating}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{watch.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{watch.runtime}</span>
        </p>
        <button className="btn-delete">&times;</button>
      </div>
    </li>
  );
}
