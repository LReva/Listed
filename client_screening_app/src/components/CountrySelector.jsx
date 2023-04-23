import { useState } from "react";
import { MenuItem, Select, FormLabel } from "@mui/material";
import { countries } from "countries-list";


export default function CountrySelector(){
  const [country, setCountry] = useState(null);
  const countryNames = Object.values(countries).map((country) => country.name);
  const handleCountryChange = ({country}) => {
    setCountry(country)
  }
  // console.log(country)
  return(
    <div>
      <FormLabel>Country</FormLabel>
      <Select value={country} onChange={handleCountryChange}>
        {countryNames.map((country, index) => (
          <MenuItem key={index} value={country}>
            {country}
            </MenuItem>))}
        </Select>
    </div>
  )
}