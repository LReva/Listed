import { useState } from "react";
import DatabaseSelector from "../components/DatabaseSelector";
import { FormLabel, FormControlLabel, RadioGroup, Radio } from "@mui/material";


export default function Screening(){
  const [type, setType] = useState("");
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  return (
    <div className="screening-page">
      <FormLabel>Select the party type: </FormLabel>
        <RadioGroup value={type} onChange={handleTypeChange}>
            <FormControlLabel
              value="Individual"
              control={<Radio />}
              label="Individual"
            />
            <FormControlLabel
              value="Entity"
              control={<Radio />}
              label="Entity"
            />
          </RadioGroup>
        <DatabaseSelector type = {type}/>
    </div>
  )
}