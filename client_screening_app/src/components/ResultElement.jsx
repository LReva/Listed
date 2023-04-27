import { useContext, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { SavedResultContext } from "../Pages/ScreeningResult";

export default function ResultElement({result, type, database, matchHistoryID}){
  const [match, setMatch] = useState(false)
  const [selectedItem, setSelectedItem] = useState({})
  const {savedResults} = useContext(SavedResultContext)
  const {counter} = useContext(SavedResultContext)
  const {setCounter} = useContext(SavedResultContext)
  const {setSavedResults} = useContext(SavedResultContext)
  const link = result.source

  const handleMatchSelection = () => {
    if (match === false) {
      setSelectedItem({
      "name": result.name,
      "database": database,
      "search_type": type,
      "link": result.source,
      "match": 1})
    } 
    else if (match === true) {
      setSelectedItem({})
    }
    let currentCount = counter + 1
    setCounter(currentCount)
    setMatch(!match)
  }

  useEffect(() => {
    if (Object.keys(selectedItem).length === 0 && counter > 0){
      let filteredSelection = savedResults.filter(item => item.link !== link)
      setSavedResults(filteredSelection)
    }
    else if (counter != 0) {
      setSavedResults([...savedResults, selectedItem])
    } 
  }, [selectedItem]);

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