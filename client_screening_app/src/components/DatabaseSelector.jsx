import { useState } from "react";
import {  MenuItem, Select, FormLabel} from "@mui/material";
import IndividualSearch from "./IndividualSearch";

export default function DatabaseSelector({type}){
  let options
  if (type === "Individual") {
    options = ["Search all",
               "FBI", 
               "Not active: OFAC",
               "Interpol",
               "Not active: History only"]
  }
  else if (type === "Entity") {
    options = ["Not active: Search all", 
               "Not active: OFAC",
               "Not active: History only"]
  }
  const [database, setDatabase] = useState("Search all");
  const handleDatabaseChange = (event) => {
    setDatabase(event.target.value);
  };
  return (
    <div>
      { type === "Individual" ? (
        <div>
        <FormLabel>Select the database: </FormLabel> 
        <Select value={database} onChange={handleDatabaseChange}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
            </MenuItem>))}
        </Select>
        <IndividualSearch database = {database}/>
        </div>
      ) : (<div></div>)}
    </div>
  )
}