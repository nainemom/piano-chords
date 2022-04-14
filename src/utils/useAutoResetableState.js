import { useState, useEffect } from 'react';


export default (initialValue = false, timeout = 500) => {
  const [value, setValue] = useState(initialValue);

  let timer;
  useEffect( () => {
    clearTimeout(timer);
    if (value !== initialValue) {
      timer = setTimeout(() => {
         setValue(initialValue);
      }, timeout)
    }
 }, [value]);

 useEffect(() => () => {
   clearTimeout(timer);
 }, []);

  return [value, setValue];
}