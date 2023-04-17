import { useState } from "react";
import { signUp } from "../utilities";


export default function SignUp(){
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="sign-up">
      <form onSubmit={(e) => [e.preventDefault(), 
                              signUp(firstName,
                                     lastName,
                                     email,
                                     password),
                              setFirstName(""),
                              setLastName(""),
                              setEmail(""),
                              setPassword("")]}>
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
          type="text" 
          placeholder="password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}/>
        <input type="text" placeholder="confirm password"/>
        <input type="submit" value="Sign Up" />
        <input type="reset" value="Reset"/>
      </form>
    </div>
  )
}


// add password and confirm password to check if equal else throw error
// add confirmation all fields are filled else throw error page