import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, identifier) {
  const [value, setValue] = useState(() => {
    const storage = localStorage.getItem(identifier);
    return storage ? JSON.parse(storage) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(identifier, JSON.stringify(value));
    },
    [value, identifier]
  );

  return [value, setValue];
}
