import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const KEY = "cb3cde7d";
const API_URL = `http://www.omdbapi.com/?apikey=${KEY}`;

export default function App() {
  const [query, setQuery] = useState("M.S. Dhoni");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch(`${API_URL}&s=${query}`);
          const data = await response.json();
          console.log(data);
          if (data.Response === "False") throw new Error("Movie Not Found!");
          setMovies(data.Search);
        } catch (err) {
          //   console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) return;

      fetchMovies();
    },
    [query]
  );
  return (
    <div>
      <Navbar>
        <Logo />
        <Search />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <Error error={error} />}
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
      </Main>
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Error({ error }) {
  console.log(error);
  return <p className="error">{error}</p>;
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span>List Box</span>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      className="search"
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return <div className="num-results">Found {movies.length} Results</div>;
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

function MovieList({ movies }) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchedBox() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
//         {isOpen ? "-" : "+"}
//       </button>

//       {isOpen && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function WatchedSummary({ watched }) {
  const totalWatchedMovies = watched.length;
  const IMDBRating =
    watched.reduce((acc, cur) => {
      return acc + cur.imdbRating;
    }, 0) / watched.length;

  const userRating =
    watched.reduce((acc, cur) => acc + cur.userRating, 0) / watched.length;

  const runtime = watched.reduce((acc, cur) => acc + cur.runtime, 0);

  return (
    <div className="summary">
      <h2>Movies You have Watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{totalWatchedMovies} Movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{IMDBRating} IMDB</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{userRating} USER</span>
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
        <WatchedMovie key={watch.imdbID} watch={watch} />
      ))}
    </ul>
  );
}

function WatchedMovie({ watch }) {
  return (
    <li>
      <img src={watch.Poster} alt={watch.Title} />
      <h3>{watch.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{watch.imdbRating} imdb</span>
        </p>

        <p>
          <span>⭐️</span>
          <span>{watch.userRating} user</span>
        </p>

        <p>
          <span>⏳</span>
          <span>{watch.runtime} mins</span>
        </p>
        <button className="btn-delete">&times;</button>
      </div>
    </li>
  );
}
