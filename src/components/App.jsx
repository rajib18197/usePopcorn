import { useEffect, useState } from "react";
import Box from "./Box";
import Main from "./Main";
import MovieList from "./MovieList";
import NavBar from "./NavBar";
import WatchedMovieList from "./WatchedMovieList";
import WatchedSummary from "./WatchedSummary";
import Loader from "./Loader";
import Error from "./Error";
import Logo from "./Logo";
import Search from "./Search";
import NumResults from "./NumResults";
import MovieDetails from "./MovieDetails";
import { useMovies } from "../hooks/useMovies";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import WishMovieList from "./WishMovieList";
import WishResults from "./WishResults";

const KEY = "cb3cde7d";
const API_URL = `https://www.omdbapi.com/?apikey=${KEY}`;

export default function App() {
  // const [isInSearchBox, setIsInSearchBox] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [wishList, setWishList] = useLocalStorageState([], "wishList");

  function handleAddWatched(newWatchedMovie) {
    setWatched((watched) => [...watched, newWatchedMovie]);
    handleClose();
  }

  function handleRemoveWatched(id) {
    console.log(watched);
    setWatched((watched) => watched.filter((watch) => watch.imdbID !== id));
  }

  function handleRemoveWishList(id) {
    setWishList((wishMovies) =>
      wishMovies.filter((wish) => wish.imdbID !== id)
    );
  }

  function handleSelect(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleClose() {
    setSelectedId(null);
  }

  // function handleSearch(value) {
  //   setQuery(value);
  //   setIsInSearchBox(true);
  // }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <div className="stats">
          <WishResults wishList={wishList} />
          <NumResults movies={movies} />
        </div>
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelect={handleSelect} />
          )}
          {error && <Error message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              watched={watched}
              onAddWatch={handleAddWatched}
              onCloseMovie={handleClose}
              onWishList={setWishList}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onRemove={handleRemoveWatched}
              />
            </>
          )}
        </Box>
        <Box>
          {/* <h3>WishList</h3> */}
          {wishList.length === 0 && (
            <p>Your wishlist is Empty. Keep Explore!</p>
          )}
          {wishList.length > 0 && (
            <WishMovieList
              wishlist={wishList}
              onRemove={handleRemoveWishList}
              onSelect={handleSelect}
            />
          )}
        </Box>
      </Main>
    </>
  );
}
