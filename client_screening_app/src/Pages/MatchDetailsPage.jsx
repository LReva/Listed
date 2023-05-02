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
            {matchView.data.sex ? (<p>Gender: {matchView.data.sex}</p>) : (<p>Address: {matchView.data.address}</p>)}
            <p>DOB: {matchView.data.DOB}</p> 
            {matchView.data.nationality ? (<p>Nationality: {matchView.data.nationality}</p>) : (<p>Citizenship: {matchView.data.citizenship}</p>)}
            {/* <p>Race: {matchView.data.race}</p> */}
            {matchView.data.scars_and_marks ? (<p>Scars and marks: {matchView.data.scars_and_marks}</p>) : (null)}
            {matchView.data.eyes ? (<p>Eyes: {matchView.data.eyes}</p>) : (null)}
            {matchView.data.programs ? (<p>Programs: {matchView.data.programs}</p>) : (null) }
            {matchView.data.hair ? (<p>Hair: {matchView.data.hair}</p>) : (null)}
            {matchView.data.additionalSanctions ? (<p>Additional Sanctions: {matchView.data.additionalSanctions}</p>) : (null)}
            {matchView.data.caution ? (<p>Details: {matchView.data.caution}</p>): (null)}
          </div>
          {matchView.data.photo ? (
          <div className="image-div">
            <img 
           className="photo" src={matchView.data.photo} alt="No image available" />
          </div>) :
          (null)
          } 
        </div>
      </div>
    </div>
  )
}