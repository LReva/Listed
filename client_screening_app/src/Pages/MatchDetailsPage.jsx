import { useContext } from "react";
import { MatchContext } from '../App';
import {Link} from 'react-router-dom';

export default function MatchDetailsPage(){
  const {matchView} = useContext (MatchContext)
  console.log(matchView)
  return (
    <div>
      <Link to="/screening-history/">Return to the previous page</Link>
        <p>Name: {matchView.data.name}</p>
        <p>Aliases: {matchView.data.aliases}</p>
        <p>Gender: {matchView.data.sex}</p>
        <p>DOB: {matchView.data.DOB}</p>
        <p>Race: {matchView.data.race}</p>
        <p>Nationality: {matchView.data.nationality}</p>
        <p>Eyes: {matchView.data.eyes}</p>
        <p>Hair: {matchView.data.hair}</p>
        <p>Scars and marks: {matchView.data.scars_and_marks}</p>
        <p>Charge: {matchView.data.caution}</p>
        <img src={matchView.data.photo === "not available" ? ("") : matchView.data.photo} alt="No image available" />
    </div>
  )
}