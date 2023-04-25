import { useState } from "react";
import { MenuItem, Select, FormLabel } from "@mui/material";
import { countries } from "countries-list";


export default function CountrySelector({country, setCountry}){
  const countryNames = Object.values(countries).map((country) => country.name)
  countryNames.unshift("Not selected")
  const handleCountryChange = (event) => {
    setCountry(event.target.value)
  }
  return(
    <div>
      <FormLabel>Country</FormLabel>
      <Select value={country} onChange={handleCountryChange}>
        {countryNames.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
            </MenuItem>))}
        </Select>
    </div>
  )
}