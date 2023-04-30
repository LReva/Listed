import {Link} from 'react-router-dom';
import image from "../components/photo.png"

export default function HomePage(){
  return (
    <div className="home-page">      
      <h3>We assist companies in complying with regulations related to Anti-Money Laundering (AML), Counter-Terrorist Financing (CTF), and sanctions, thereby mitigating the risk of damage to their reputation.</h3>
      <Link className="redirect" to="/about-us/">Learn more</Link>
      <img className="home-image" src={image} />
    </div>
  )
}