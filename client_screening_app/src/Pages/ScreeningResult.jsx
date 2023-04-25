import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../App";
import DatabaseResultElement from "../components/DatabaseResultElement";

export default function ScreeningResult(){
  const {searchResults} = useContext(SearchContext)
  if (!searchResults) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Search paramaters entered: First name - {!searchResults.search_params.first_name  ? ("None") : searchResults.search_params.first_name}, 
        Last name - {!searchResults.search_params.last_name  ? ("None") : searchResults.search_params.last_name}, 
        Full name - {!searchResults.search_params.full_name  ? ("None") : searchResults.search_params.full_name}, 
        DOB - {!searchResults.search_params.dob  ? ("None") : searchResults.search_params.dob}, 
        Country - {!searchResults.search_params.country  ? ("None") : searchResults.search_params.country}</p>
      <h3>Search Results:</h3>
      {searchResults.data.map((databaseResult) => (<DatabaseResultElement databaseResult={databaseResult}/>))}
    </div>
  )
}