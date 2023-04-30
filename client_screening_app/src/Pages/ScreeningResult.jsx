import { useContext, useState, createContext } from "react";
import { saveMatch } from "../utilities";
import {useNavigate} from 'react-router-dom';
import { SearchContext } from "../App";
import DatabaseResultElement from "../components/DatabaseResultElement";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

export const SavedResultContext = createContext(null)

export default function ScreeningResult(){
  const navigate = useNavigate()
  const {searchResults} = useContext(SearchContext)
  const [save, setSave] = useState(false)
  const [savedResults, setSavedResults] = useState([])
  const [counter, setCounter] = useState(0)
  
  // if database has no potentially positive matches remains false, otherwise turns true:
  const [positives, setPositives] = useState(false)

  const handleHistorySave = () => {
    let matchHistoryID = searchResults.match_history_id
    setSave(true)
    for (let item of savedResults) {
      if (item.database === "Interpol") {
        saveMatch(matchHistoryID.interpol,
                item['name'], 
                item['database'], 
                item['search_type'], 
                item['link'], 
                item['match'])
      } else if (item.database === "FBI") {
          saveMatch(matchHistoryID.fbi,
          item['name'], 
          item['database'], 
          item['search_type'], 
          item['link'], 
          item['match'])
      }
      else if (item.database === "OFAC") {
        saveMatch(matchHistoryID.ofac,
        item['name'], 
        item['database'], 
        item['search_type'], 
        item['link'], 
        item['match'])
    }
    }
  }
  if (!searchResults) {
    return <p>Loading...</p>;
  }
  return (
    <div className="all-results">
      <IconButton onClick={()=> navigate("/screening/")}>
        <ArrowBackIcon/>
      </IconButton>   
      <p>Search paramaters entered: First name - {!searchResults.search_params.first_name  ? ("None") : searchResults.search_params.first_name}, 
        Last name - {!searchResults.search_params.last_name  ? ("None") : searchResults.search_params.last_name}, 
        Full name - {!searchResults.search_params.full_name  ? ("None") : searchResults.search_params.full_name}, 
        DOB - {!searchResults.search_params.dob  ? ("None") : searchResults.search_params.dob}, 
        Country - {!searchResults.search_params.country  ? ("None") : searchResults.search_params.country}</p>
      <h3>Search Results:</h3>
      <SavedResultContext.Provider value={{savedResults, setSavedResults, counter, setCounter}} >
        {searchResults.data.map((databaseResult) => (<DatabaseResultElement databaseResult={databaseResult} setPositives = {setPositives} matchHistoryID = {searchResults.match_history_id}/>))}
      </SavedResultContext.Provider>
      { positives && <Button onClick={handleHistorySave}>Save</Button>}
      { save && <Alert>Your selection was saved</Alert>} 
    </div>
  )
}