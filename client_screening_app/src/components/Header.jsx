import {Link, useNavigate} from 'react-router-dom';
import { useContext } from "react";
import {UserContext} from "../App";
import { AppBar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoggedInHeaderAddOn from './LoggedInHeaderAddOn';

const theme = createTheme({
  palette: {
    primary: {
      main: '#222222'
    },
  },
});

export default function Header(){
  const navigate = useNavigate()
  const {user} = useContext(UserContext)
  return (
    <header className='header'>
      <ThemeProvider theme={theme}>
      <AppBar color="primary">
        <div className='nav-bar'>
          <div className='left-nav'>
            <h1>BlackList</h1>
            <Link to="">Home</Link>
            <Link to="/about-us/">About us</Link>
          </div>
          {user && user.first_name && user.last_name ? (
            <LoggedInHeaderAddOn/>) : (
          <button onClick={()=> navigate("/log-in/")}>Log in</button>)}
        </div>
      </AppBar>
      </ThemeProvider>
    </header>
  )
}