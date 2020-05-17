import { useCallback, useEffect } from "react";

export const useOutsideClick = (ref: any, callback: any) => {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export function useKeyDown(map: { targetKey: string | string[]; handler: () => void }[]) {
  const finalHandler = useCallback(
    (e) => {
      for (const entry of map) {
        if (
          (Array.isArray(entry.targetKey) && entry.targetKey.includes(e.key)) ||
          e.key === entry.targetKey
        ) {
          entry.handler();
        }
      }
    },
    [map]
  );

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keyup", finalHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", finalHandler);
    };
  }, [finalHandler]);
}
