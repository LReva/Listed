import {Link, useNavigate} from 'react-router-dom';
import { logIn } from '../utilities';
import { useContext, useState } from 'react';
import {UserContext} from '../App';

export default function LogIn(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate();
  return (
    <div className="log-in">
      <h3>Log In</h3>
      <form onSubmit={(e) => [e.preventDefault(), 
                              logIn(email,
                                    password,
                                    setUser),
                              setEmail(""),
                              setPassword(""),
                              navigate("/screening/")]}>
        <input 
              type = "text" 
              placeholder = "email"
              value = {email}
              onChange = {(e)=> setEmail(e.target.value)}/>
        <input 
              type = "text" 
              placeholder = "password"
              value = {password}
              onChange = {(e)=> setPassword(e.target.value)}/>
        <input type="submit" value="Log in" />
        <input type="reset" value="Reset"/>
      </form>
      <h4>Don't have an account?</h4>
      <Link to="/sign-up/">Sign up</Link>
    </div>
  )
}