import { createContext, useEffect, useState } from 'react';
import {Outlet} from 'react-router-dom';
import { currentUser } from "./utilities";
import getCsrfToken from "./components/CsrfToken";
import Header from './components/Header';
import './App.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const UserContext = createContext(null)
export const SearchContext = createContext(null)
export const MatchContext = createContext(null)

export default function App() {
  const [user, setUser] = useState(null)
  const [searchResults, setSearchResult] = useState(null)
  const [matchView, setMatchView] = useState(null)

  getCsrfToken()

  useEffect(() => {
    const getCurrentUser = async() => {
      setUser(await currentUser());
    };
    getCurrentUser();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="App">
      <UserContext.Provider value={{user, setUser}} >
      <SearchContext.Provider value={{searchResults, setSearchResult}} >
      <MatchContext.Provider value ={{matchView,setMatchView}}>
        <Header/>
        <Outlet/>
      </MatchContext.Provider>
      </SearchContext.Provider>
      </UserContext.Provider>
    </div>
    </LocalizationProvider>
  )
}
