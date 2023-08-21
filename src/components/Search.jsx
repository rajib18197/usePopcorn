import { useEffect, useRef, useState } from "react";
import { useKey } from "../hooks/UseKey";

export default function Search({ query, setQuery }) {
  const inputElement = useRef();

  useKey("Enter", () => {
    if (document.activeElement === inputElement.current) {
      return;
    }
    inputElement.current.focus();
    setQuery("");
  });

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       console.log(isInSearchBox);
  //       if (isInSearchBox) {
  //         console.log("okay");
  //         return;
  //       }
  //       if (e.code === "Enter") {
  //         inputElement.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);

  //     return () => {
  //       // console.log(1111);
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [setQuery, isInSearchBox]
  // );

  return (
    <input
      className="search"
      ref={inputElement}
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      // onChange={(e) => onSearch(e.target.value)}
      // onBlur={() => setIsInSearchBox(false)}
    />
  );
}
