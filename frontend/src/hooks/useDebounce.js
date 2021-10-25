import  { useEffect, useState } from "react";
 
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, [delay]);
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue;
}

export default useDebounce;