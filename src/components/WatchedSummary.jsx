export default function WatchedSummary({ watched }) {
  // console.log(watched);
  const avgImdbRating =
    watched.reduce((acc, cur) => acc + Number(cur.imdbRating), 0) /
      watched.length || 0;
  //   console.log(avgImdbRating);

  const avgUserRating =
    watched.reduce((acc, cur) => acc + cur.userRating, 0) / watched.length || 0;

  const avgRuntime =
    watched.reduce((acc, cur) => acc + Number(cur.runtime.split(" ")[0]), 0) /
      watched.length || 0;

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}
