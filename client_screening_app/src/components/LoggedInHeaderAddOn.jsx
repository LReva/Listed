import {Link} from 'react-router-dom';
import { useContext } from "react";
import { logOut} from "../utilities";
import {UserContext} from "../App";


export default function LoggedInHeaderAddOn(){
  const {setUser} = useContext(UserContext)
  return (
    <div>  
      <Link to="/search-history/">Search History</Link>  
      <Link to = "/screening/">Screening</Link>
      <button onClick={() => logOut(setUser)}>Log Out</button>
    </div>
  )
}