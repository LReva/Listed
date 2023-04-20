import { useState } from "react";
import { useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, TextField, Checkbox, Button } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import CountrySelector from "./CountrySelector";
import { searchDatabase } from "../utilities";
import moment from "moment";


export default function IndividualSearch({database}){
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(null);
  const [result, setResult] = useState("")
  const navigate = useNavigate();
  const handleDateChange = (date) => {
    setDob(date)
  }
  let date = dob
  let formattedDOBDate = !date ? "" : moment(date).format('MM/DD/YYYY')

  return (
    <div className="individual-search">
      {database === "FBI" ? (
      <form onSubmit={ (e) => [e.preventDefault(), 
                                        searchDatabase(firstName,
                                        lastName,
                                        fullName,
                                        formattedDOBDate,
                                        database,
                                        result,
                                        setResult,
                                        navigate),
                                        setFirstName(""),
                                        setLastName(""),
                                        setFullName(""),
                                        setDob("")]}>
        <FormControl>
        <FormLabel>First Name</FormLabel>
        <TextField
            value = {firstName}
            onChange = {(e)=> setFirstName(e.target.value)}/>
        <FormLabel>Last Name</FormLabel>
        <TextField
            value = {lastName}
            onChange = {(e)=> setLastName(e.target.value)}/>
        <FormLabel>Unsure which part of the name is the first name and which is last Name</FormLabel>
        <Checkbox></Checkbox>
        <FormLabel>Full Name</FormLabel>
        <TextField
            value = {fullName}
            onChange = {(e)=> setFullName(e.target.value)}/>
        <FormLabel>DOB</FormLabel>
          <DatePicker
            value={dob}
            onChange={handleDateChange}/>
            <div>Selected Date: {dob ? dob.format("MM/DD/YYYY") : ""}</div>
        <CountrySelector/>
        <Button type="submit">Search</Button>
        <Button type="reset" onClick={() => [setFirstName(""), setLastName(""), setFullName(""), setDob(null)]}>Clear</Button>   
       </FormControl>
      </form>
      ) : (<div> </div>)}
    </div>
  )
}