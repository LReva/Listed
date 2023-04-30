import { useState, useContext } from "react";
import { useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, TextField, Button } from "@mui/material";
import { searchDatabase } from "../utilities";
import { SearchContext } from "../App";
import CountrySelector from "./CountrySelector";


export default function EntitySearch({database, type}){
  const {setSearchResult} = useContext(SearchContext)
  const [entityName, setEntityName] = useState("");
  const [id, setID] = useState("");
  const [country, setCountry] = useState("Not selected");
  const navigate = useNavigate();
  setSearchResult(null)

  return (
    <div className="entity-search">
      <form >
        <FormControl>
        <FormLabel>Entity Name</FormLabel>
        <TextField
            value = {entityName}
            onChange = {(e)=> setEntityName(e.target.value)}/>
        <FormLabel>ID</FormLabel>
        <TextField
            value = {id}
            onChange = {(e)=> setID(e.target.value)}/>
        <div className="country-selector-div">
          <CountrySelector country={country} setCountry={setCountry}/>
        </div>
        <Button type="submit">Search</Button>
        <Button type="reset" onClick={() => [setEntityName(""), setID(""), setCountry("Not selected")]}>Clear</Button>   
       </FormControl>
      </form>
    </div>
  )
}