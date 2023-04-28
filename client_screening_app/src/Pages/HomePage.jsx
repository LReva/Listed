import {Link} from 'react-router-dom';

export default function HomePage(){
  return (
    <div className="home-page">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, debitis quaerat! Porro necessitatibus itaque totam a deleniti, iste odio repudiandae esse eos voluptatum! Excepturi illo minus error nihil, saepe sunt.</p> 
      <Link className="redirect" to="/about-us">Learn more</Link>
    </div>
  )
}