import { useState, useContext } from "react";
import { useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, TextField, Checkbox, Button } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { searchDatabase } from "../utilities";
import { SearchContext } from "../App";
import CountrySelector from "./CountrySelector";
import moment from "moment";


export default function IndividualSearch({database, type}){
  const {setSearchResult} = useContext(SearchContext)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(null);
  const [country, setCountry] = useState("Not selected");
  const navigate = useNavigate();
  const handleDateChange = (date) => {
    setDob(date)
  }
  let date = dob
  let formattedDOBDate = !date ? "" : moment(date).format('MM/DD/YYYY')
  setSearchResult(null)
  return (
    <div className="individual-search">
      <form onSubmit={ (e) => [e.preventDefault(), 
                              searchDatabase(firstName,
                              lastName,
                              fullName,
                              formattedDOBDate,
                              country,
                              database,
                              type,
                              setSearchResult),
                              setFirstName(""),
                              setLastName(""),
                              setFullName(""),
                              setDob(null), 
                              setCountry("Not selected"),
                              navigate('/screening-result')]}>
        <FormControl>
        <FormLabel>First Name</FormLabel>
        <TextField
            value = {firstName}
            onChange = {(e)=> setFirstName(e.target.value)}/>
        <FormLabel>Last Name</FormLabel>
        <TextField
            value = {lastName}
            onChange = {(e)=> setLastName(e.target.value)}/>
        <FormLabel>Unsure which part of the name is the first name and which is the last name</FormLabel>
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
        <CountrySelector country={country} setCountry={setCountry}/>
        <Button type="submit">Search</Button>
        <Button type="reset" onClick={() => [setFirstName(""), setLastName(""), setFullName(""), setDob(null), setCountry("Not selected")]}>Clear</Button>   
       </FormControl>
      </form>
    </div>
  )
}