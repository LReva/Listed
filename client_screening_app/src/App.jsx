import { createContext, useEffect, useState } from 'react';
import {Outlet} from 'react-router-dom';
import { currentUser } from "./utilities";
import getCsrfToken from "./components/CsrfToken";
import Header from './components/Header';
import './App.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BottomNavigation } from '@mui/material';

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

  const styles = {
    bottomNav: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#222222',
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="App">
      <UserContext.Provider value={{user, setUser}} >
      <SearchContext.Provider value={{searchResults, setSearchResult}} >
      <MatchContext.Provider value ={{matchView,setMatchView}}>
        <Header/>
        <div className='main'>
          <Outlet/>
        </div>
      </MatchContext.Provider>
      </SearchContext.Provider>
      </UserContext.Provider>
    <BottomNavigation style={styles.bottomNav}>
      <h4 className='bottom-footer'>BlackList2023</h4>
    </BottomNavigation>
    </div>
    </LocalizationProvider>
  )
}
