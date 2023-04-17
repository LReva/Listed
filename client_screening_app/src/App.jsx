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
      <UserContext.Provider value={{user, setUser}} >
        <Header/>
        <Outlet/>
      </UserContext.Provider>  
    </div>
  )
}
