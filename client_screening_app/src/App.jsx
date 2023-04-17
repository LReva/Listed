import { createContext, useEffect, useState } from 'react';
import {Outlet} from 'react-router-dom';
import { currentUser, logOut} from "./utilities";
import getCsrfToken from "./components/CsrfToken";
import Header from './components/Header';
import './App.css';

export const UserContext = createContext(null)

export default function App() {
  const [user, setUser] = useState(null)

  getCsrfToken()

  useEffect(() => {
    const getCurrentUser = async() => {
      setUser(await currentUser());
    };
    getCurrentUser();
  }, []);

  return (
    <div className="App">
      <h1>Hello {user && user.first_name}</h1>
      <button onClick={() => logOut(setUser)}>Log Out</button>
      <Header/>
      <UserContext.Provider value={{user, setUser}} >
        <Outlet/>
      </UserContext.Provider>  
    </div>
  )
}
