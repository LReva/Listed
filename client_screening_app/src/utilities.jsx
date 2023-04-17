import axios from 'axios';

export const signUp = async (first_name, last_name, email, password) => {
  let response = await axios.post('/sign-up/', {
    "first_name": first_name,
    "last_name": last_name,
    "email": email,
    "password": password
  })
  return response.data.success
}

export const logIn = async (email, password, setUser) => {
  console.log("I got clicked")
  let response = await axios.post('/log-in/', {
    "email": email,
    "password":password
  })
  console.log(response.data)
  setUser(response.data)
}

export const currentUser = async() => {
  let response = await axios.get('/current-user/')
  return response.data
}

export const logOut = async(setUser) => {
  let response = await axios.post('/log-out/')
  if (response.data.logout){
    setUser(null)
  }
}