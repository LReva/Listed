import {Link, useNavigate} from 'react-router-dom';
import { useContext, useState } from "react";
import { logOut} from "../utilities";
import {UserContext} from "../App";
import IconButton from '@mui/material/IconButton';
import {AccountBox as AccountBoxIcon} from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';


export default function LoggedInHeaderAddOn(){
  const {setUser} = useContext(UserContext)
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div className='nav-bar-add-on'>
      <div className='add-on-links'>
      <Link to="/screening-history/">Search History</Link>  
      <Link to = "/screening/">Screening</Link>
      </div>  
      <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountBoxIcon className="svg_icons"/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate("/user-profile/")}>Profile</MenuItem>
                <MenuItem onClick={() => logOut(setUser, navigate)}>Log Out</MenuItem>
              </Menu>
            </div>
    </div>
  )
}