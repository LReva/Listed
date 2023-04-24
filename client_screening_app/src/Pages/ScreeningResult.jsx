import { useContext, useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import { SearchContext } from "../App";
import DatabaseResultElement from "../components/DatabaseResultElement";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function ScreeningResult(){
  const {searchResults} = useContext(SearchContext)
  const [save, setSave] = useState(false)

  const handleHistorySave = () => {
    setSave(true)
  }

  // useEffect(() => {
  //   const getCurrentUser = async() => {
  //     setUser(await currentUser());
  //   };
  //   getCurrentUser();
  // }, [save]);



  if (!searchResults) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <Link to="/screening/">Return to Screening</Link>
      <p>Search paramaters entered: First name - {!searchResults.search_params.first_name  ? ("None") : searchResults.search_params.first_name}, 
        Last name - {!searchResults.search_params.last_name  ? ("None") : searchResults.search_params.last_name}, 
        Full name - {!searchResults.search_params.full_name  ? ("None") : searchResults.search_params.full_name}, 
        DOB - {!searchResults.search_params.dob  ? ("None") : searchResults.search_params.dob}, 
        Country - {!searchResults.search_params.country  ? ("None") : searchResults.search_params.country}</p>
      <h3>Search Results:</h3>
      {searchResults.data.map((databaseResult) => (<DatabaseResultElement databaseResult={databaseResult}/>))}
      <Button onClick={handleHistorySave}>Save</Button>
      { save && <Alert>You selection was saved</Alert>}     
    </div>
  )
}