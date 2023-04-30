import { useState } from "react";
import {  MenuItem, Select, FormLabel} from "@mui/material";
import IndividualSearch from "./IndividualSearch";
import EntitySearch from "./EntitySearch";

export default function DatabaseSelector({type}){
  let options
  if (type === "Individual") {
    options = ["Search all",
               "FBI", 
               "OFAC",
               "Interpol",
              //  "Not active: History only"
            ]
  }
  else if (type === "Entity") {
    options = ["Search all", 
               "Not active: OFAC",
              //  "Not active: History only"
              ]
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
        <IndividualSearch database = {database} type = {type}/>
        </div>
      ) : type === "Entity" ? (<div>
        <FormLabel>Select the database: </FormLabel> 
        <Select value={database} onChange={handleDatabaseChange}>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
              </MenuItem>))}
          </Select>
          <EntitySearch database = {database} type = {type}/>
      </div>) : (<div></div>)}
    </div>
  )
}