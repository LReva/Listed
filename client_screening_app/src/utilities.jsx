import axios from 'axios';

export const signUp = async (first_name, last_name, email, password) => {
  let response = await axios.post('/users', {
    "first_name": first_name,
    "last_name": last_name,
    "email": email,
    "password": password
  })
  return response.data.success
}

export const logIn = async (email, password, setUser, navigate) => {
  let response = await axios.put('/users', {
    "email": email,
    "password":password
  })
  setUser(response.data)
  if (!response.data.email) {
    alert("Wrong username or password. Please try again!")
  }
  else {
    navigate("/screening/")
  }
}

export const currentUser = async() => {
  let response = await axios.get('/users')
  return response.data
}

export const logOut = async(setUser) => {
  let response = await axios.post('/users')
  if (response.data.logout){
    setUser(null)
  }
}

export const searchDatabase = async (first_name, last_name, full_name, dob, database, setSearchResult) => {
  let response = await axios.post('/search', {
    "first_name": first_name,
    "last_name": last_name,
    "full_name": full_name,
    "dob": dob,
    "database": database
  })
  if (response.data === []) {
    response.data = ""
  }
  setSearchResult(response.data)
}