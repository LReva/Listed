import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Header(){
  const navigate = useNavigate()
  return (
    <div className="nav-bar">
      <h1>BlackList</h1>
      <Link to="">Home</Link>
      <Link to="/about-us/">About us</Link>
      <Link to="/log-in/">Log in</Link>
    </div>
  )
}