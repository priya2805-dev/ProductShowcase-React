import React, { useMemo, useState,useEffect } from 'react'
import "../styles/SearchBar.css"

import loadlash from "lodash";
const SearchBar = ({onSearch}) => {
  const [input,setInput] = useState("")

//debounce
const debouncedSearch = useMemo(
    () =>
      loadlash.debounce((value) => {
        onSearch(value);
      }, 500),
    [onSearch]
  );  

  
  useEffect(() => {
    debouncedSearch(input);

    // Cancel debounce 
    return () => {
      debouncedSearch.cancel();
    };
  }, [input, debouncedSearch]);


  return (
    <div className='search-bar'>
        <input type='text' value={input} onChange={(e)=>setInput(e.target.value)} placeholder='search By Product Name'/>
    </div>
  )
}

export default SearchBar
