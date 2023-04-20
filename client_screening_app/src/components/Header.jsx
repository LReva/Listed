import {Link} from 'react-router-dom';
import { useContext } from "react";
import {UserContext} from "../App";
import LoggedInHeaderAddOn from './LoggedInHeaderAddOn';

export default function Header(){
  const {user} = useContext(UserContext)
  return (
    <div className="nav-bar">
      <h1>BlackList</h1>
      <Link to="">Home</Link>
      <Link to="/about-us/">About us</Link>
      {user && user.first_name && user.last_name ? (
        <LoggedInHeaderAddOn/>) : (
      <Link to="/log-in/">Log in</Link>)}
    </div>
  )
}