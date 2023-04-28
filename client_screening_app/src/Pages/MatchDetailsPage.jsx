import { useContext } from "react";
import { MatchContext } from '../App';
import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

export default function MatchDetailsPage(){
  const {matchView} = useContext (MatchContext)
  const navigate = useNavigate()
  if (!matchView) {
    return <p>Loading...</p>;
  }
  return (
    <div className="match-details">
      <IconButton onClick={()=> navigate("/screening-history/")}>
        <ArrowBackIcon/>
      </IconButton>   
      <div className="main-results">
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
            <img 
           className="photo" src={matchView.data.photo === "not available" ? ("") : matchView.data.photo} alt="No image available" />
          </div>
        </div>
      </div>
    </div>
  )
}