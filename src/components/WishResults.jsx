export default function WishResults({ wishList }) {
  return (
    <div className="wish">
      <span>💛</span>
      <p className="wish-count">{wishList.length}</p>
    </div>
  );
}
