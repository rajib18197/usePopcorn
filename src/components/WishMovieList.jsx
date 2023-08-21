export default function WishMovieList({ wishlist, onRemove, onSelect }) {
  return (
    <ul className="list list-movies">
      {wishlist.map((movie) => (
        <WishMovie
          movie={movie}
          key={movie.imdbID}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function WishMovie({ movie, onRemove, onSelect }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>{movie.imdbRating} Stars</span>
          <span>{movie.year}</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={(e) => {
          onRemove(movie.imdbID);
          e.stopPropagation();
        }}
      >
        &times;
      </button>
    </li>
  );
}
