import { useState } from "react";
import {  MenuItem, Select, FormLabel} from "@mui/material";
import IndividualSearch from "./IndividualSearch";

export default function DatabaseSelector({type}){
  let options 
  if (type === "Individual") {
    options = ["Search all",
               "FBI", 
               "Not active: OFAC",
               "Not active: Interpol",
               "Not active: History only"]
  }
  else if (type === "Entity") {
    options = ["Search all", 
               "Not active: OFAC",
               "Not active: History only"]
  }
  else {
    options = ["Please select the type first"]
  }
  const [database, setDatabase] = useState("");
  const handleDatabaseChange = (event) => {
    setDatabase(event.target.value);
  };
  return (
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
  )
}