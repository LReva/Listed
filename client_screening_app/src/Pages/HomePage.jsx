import {Link} from 'react-router-dom';

export default function HomePage(){
  return (
    <div className="home-page">
      <h2>Stay compliant with confidence - protect your business and verify with ease! </h2> 
      <Link className="redirect" to="/about-us">Learn more</Link>
    </div>
  )
}