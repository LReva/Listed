import { useState } from "react";
import { signUp } from "../utilities";


export default function SignUp(){
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmedPassword, setConfirmedPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const checkForMatch =(password, confirmedPassword, signUp)=> {
    if (password === confirmedPassword) {
      signUp(firstName,
        lastName,
        email,
        password)
    }
    else {
      alert("Your passwords didn't match. Please try again!")
    }
  }
  return (
    <div className="sign-up">
      <form onSubmit={(e) => [e.preventDefault(), 
                              checkForMatch(password, confirmedPassword, signUp),
                              setFirstName(""),
                              setLastName(""),
                              setEmail(""),
                              setPassword(""),
                              setConfirmedPassword("")]}>
        <h3>Sign Up</h3>
        <input 
          type="text" 
          placeholder="first name" 
          value = {firstName}
          onChange = {(e) => setFirstName(e.target.value)}/>
        <input 
          type="text" 
          placeholder="last name"
          value = {lastName}
          onChange = {(e) => setLastName(e.target.value)}/>
        <input 
          type="text" 
          placeholder="email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}/>
        <input 
          type={showPassword ? "text" : "password"} 
          placeholder="password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}/>
        <input 
         type={showPassword ? "text" : "password"} 
         placeholder="confirm password"
         value = {confirmedPassword}
         onChange = {(e) => setConfirmedPassword(e.target.value)}/>
        <label>
          <input type="checkbox" checked={showPassword} onChange={(e)=> [setShowPassword(e.target.checked)]} />
          Show Password
        </label>
        <input type="submit" value="Sign Up" />
        <input type="reset" value="Reset" onClick={() => [setEmail(""), setPassword(""), setFirstName(""), setLastName("")]}/>
      </form>
    </div>
  )
}