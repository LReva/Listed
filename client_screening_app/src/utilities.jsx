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
  navigate("/")
}

export const verifyPassword = async(user, password) => {
  let response = await axios.post('/users', {
    "user": user,
    "password": password
  })
  return response.data
}

export const deleteAccount = async (user, setUser, navigate) => {
  let response = await axios.delete('/users', {
    "user":user
  })
  setUser(null)
  navigate("/")
}

export const editProfile = async (user, password, first_name, last_name, setUser) => {
  let response = await axios.put('/users', {
    "user": user,
    "first_name": first_name,
    "last_name": last_name,
    "password": password,
    "edit": true
  })
  setUser(response.data)
  return response.data
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

export const saveMatch = async (id, name, database, search_type, link, match) => {
  let response = await axios.put('/match', {
    "id": id,
    "name": name, 
    "database": database,
    "search_type": search_type,
    "link": link,
    "match": match
  })
  return response.data
}

export const loadHistory = async() => {
  let response = await axios.get('/match')
  return response.data.match_history
}

export const deleteMatch = async(item) => {
  let response = await axios.delete('/match', {
    "data":item
  })
  return response.data
}

export const getMatchDetails = async(link)=> {
  let response = await axios.post('/match', {"match_link":link})
  if (response.data){
    return response.data
  }
}

export const addComment = async (id, name, database, search_type, link, match, search, comment) => {
  console.log(name, database, search_type, link, match, search, comment)
  let response = await axios.put('/match', {
    "id": id,
    "name": name, 
    "database": database,
    "search_type": search_type,
    "link": link,
    "match": match,
    "search": search,
    "comments": comment
  })
  return response.data
}