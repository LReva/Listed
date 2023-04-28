import { useContext } from "react";
import { MatchContext } from '../App';
import {Link} from 'react-router-dom';

export default function MatchDetailsPage(){
  const {matchView} = useContext (MatchContext)
  return (
    <div className="main-results">
      <Link to="/screening-history/">Return to the previous page</Link>
      <div className="result-div">
        <div className="result-details">
          <p>Name: {matchView.data.name}</p>
          <p>Aliases: {matchView.data.aliases}</p>
          <p>Gender: {matchView.data.sex}</p>
          <p>DOB: {matchView.data.DOB}</p>
          <p>Race: {matchView.data.race}</p>
          <p>Nationality: {matchView.data.nationality}</p>
          <p>Eyes: {matchView.data.eyes}</p>
          <p>Hair: {matchView.data.hair}</p>
          <p>Scars and marks: {matchView.data.scars_and_marks}</p>
          <p>Charge/Details: {matchView.data.caution}</p>
        </div>
        <div className="image-div">
          <img src={matchView.data.photo === "not available" ? ("") : matchView.data.photo} alt="No image available" />
        </div>
      </div>
    </div>
  )
}