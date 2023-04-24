import { useContext, useState, useEffect } from "react";
import Button from '@mui/material/Button';

export default function ResultElement({result}){
  const [match, setMatch] = useState(false)
  const handleMatchSelection = () => {
    setMatch(!match)
  }
  return (
    <div>
      <div style = {{backgroundColor: !match ? ("white") : ("grey")}}>
        <p>Name: {result.name}</p>
        <p>Aliases: {result.aliases}</p>
        <p>Gender: {result.sex}</p>
        <p>DOB: {result.DOB}</p>
        <p>Race: {result.race}</p>
        <p>Nationality: {result.nationality}</p>
        <p>Eyes: {result.eyes}</p>
        <p>Hair: {result.hair}</p>
        <p>Scars and marks: {result.scars_and_marks}</p>
        <p>Charge: {result.caution}</p>
        <img src={result.photo === "not available" ? ("") : result.photo} alt="No image available" />
      </div>
      <Button onClick = {handleMatchSelection}>{!match ? ("Select") : ("Clear selection")}</Button>
    </div>
  )
}