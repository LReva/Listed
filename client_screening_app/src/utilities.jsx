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

export const logOut = async(setUser, navigate) => {
  let response = await axios.post('/users')
  if (response.data.logout){
    setUser(null)
  }
  navigate("")
}

export const searchDatabase = async (first_name, last_name, full_name, dob, country, database, type, setSearchResult) => {
  let response = await axios.post('/search', {
    "first_name": first_name,
    "last_name": last_name,
    "full_name": full_name,
    "dob": dob,
    "database": database,
    "country": country,
    "type": type
  })
  setSearchResult(response.data)
}

//below new function, not yet debugged - saving the match to DB, adding comment, deleting match
export const saveMatch = async (name, database, search_type, link, match, search) => {
  let response = await axios.put('/match', {
    "name": name, 
    "database": database,
    "search_type": search_type,
    "link": link,
    "match": match,
    "search": search
  })
  return response.data
}


export const addComment = async (name, database, search_type, link, match, search, comment) => {
  let response = await axios.put('/match', {
    "name": name, 
    "database": database,
    "search_type": search_type,
    "link": link,
    "match": match,
    "search": search,
    "comment": comment
  })
  return response.data
}

export const deleteMatch = async(name, database, search_type, link, match, search) => {
  let response = await axios.delete('/match', {
    "name": name, 
    "database": database,
    "search_type": search_type,
    "link": link,
    "match": match,
    "search": search
  })
  return response.data
}