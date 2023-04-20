import {Link, useNavigate} from 'react-router-dom';
import { logIn } from '../utilities';
import { useContext, useState } from 'react';
import {UserContext} from '../App';


export default function LogIn(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate();
  return (
    <div className="log-in">
      <h3>Log In</h3>
      <form id="log-in-form" onSubmit={async (e) => [e.preventDefault(), 
                                                    await logIn(email,
                                                                password,
                                                                setUser, 
                                                                navigate),
                                                          setEmail(""),
                                                          setPassword("")]}>
        <input 
              type = "text" 
              placeholder = "email"
              value = {email}
              onChange = {(e)=> setEmail(e.target.value)}/>
        <input 
              type={showPassword ? "text" : "password"} 
              placeholder = "password"
              value = {password}
              onChange = {(e)=> setPassword(e.target.value)}/>
        <label>
          <input type="checkbox" checked={showPassword} onChange={(e)=> setShowPassword(e.target.checked)} />
          Show Password
        </label>
        <input type="submit" value="Log in" />
        <input type="reset" value="Reset" onClick={() => [setEmail(""), setPassword("")]}/>
      </form>
      <h4>Don't have an account?</h4>
      <Link to="/sign-up/">Sign up</Link>
    </div>
  )
}