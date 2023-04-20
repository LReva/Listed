import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../App";
import ResultElement from "../components/ResultElement";

export default function ScreeningResult(){
  const {searchResults} = useContext(SearchContext)
  if (!searchResults) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h3>Search Results:</h3>
      {searchResults.data.length === 0 ? (
        <div>
          <p>No positive or potentially positive matches found.</p>
        </div>
      ): searchResults.data.length > 1 ? (searchResults.data.map((result) => (<ResultElement result={result}/>))):
      (<ResultElement result = {searchResults.data[0]}/>)} 
    </div>
  )
}