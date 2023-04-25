import { useContext, useState, createContext } from "react";
import {Link} from 'react-router-dom';
import { SearchContext } from "../App";
import DatabaseResultElement from "../components/DatabaseResultElement";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export const SavedResultContext = createContext(null)

export default function ScreeningResult(){
  const {searchResults} = useContext(SearchContext)
  const [save, setSave] = useState(false)
  const [savedResults, setSavedResults] = useState([])
  // if database has no potentially positive matches remains false, otherwise turns true:
  const [positives, setPositives] = useState(false)
  console.log(savedResults)

  const handleHistorySave = () => {
    setSave(true)
  }

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
      <SavedResultContext.Provider value={{savedResults, setSavedResults}} >
        {searchResults.data.map((databaseResult) => (<DatabaseResultElement databaseResult={databaseResult} setPositives = {setPositives}/>))}
      </SavedResultContext.Provider>
      { positives && <Button onClick={handleHistorySave}>Save</Button>}
      { save && <Alert>You selection was saved</Alert>} 
 
    </div>
  )
}