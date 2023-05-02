import { useContext, useState } from "react";
import { useNavigate} from 'react-router-dom';
import { editProfile, deleteAccount, verifyPassword} from "../utilities";
import {UserContext} from "../App";
import {Card, CardContent, Typography, TextField, Button, IconButton, CardActions, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#246666', 
    },
    secondary:{
      main: '#B04025',
    },
    success:{
      main:'#4c4e4d',
    }
  },
});

export default function UserProfile(){
  const navigate = useNavigate()
  const {user} = useContext(UserContext)
  const {setUser} = useContext(UserContext)
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newFirstName, setNewFirstName] = useState(user.first_name);
  const [newLastName, setNewLastName] = useState(user.last_name);
  const [newPassword, setNewPassword] = useState(user.password);
  const [newConfirmedPassword, setNewConfirmedPassword] = useState(user.password);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setOldPassword('');
    setNewFirstName(user.first_name);
    setNewLastName(user.last_name);
    setNewPassword('');
  };

   const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    let response = await verifyPassword(user, oldPassword)
    if (response.password === true){
      setIsEditing(false);
      setEditMode(true)
      setOldPassword("")
    }
    else {
      setOldPassword('')
      alert("Wrong password! Try again!")
    }
  };
  
  const handleSaveEdit = () => {
    if (newPassword !== newConfirmedPassword) {
      alert("Your passwords didn't match. Please try again!")
      setNewConfirmedPassword('');
      setNewFirstName(user.first_name);
      setNewLastName(user.last_name);
      setNewPassword('');
      setOldPassword("")
    } else{
      editProfile(user, newPassword, newFirstName, newLastName, setUser);
      setNewConfirmedPassword('');
      setNewFirstName(user.first_name);
      setNewLastName(user.last_name);
      setNewPassword('');
      setOldPassword("")
      setEditMode(false);
    }
  };

  const handleDeleteClick = () => {
    const verify_delete = window.confirm("Are you sure you want to delete your account?")
    if (verify_delete) {
    deleteAccount(user, setUser, navigate)
    setNewConfirmedPassword('');
    setNewFirstName("");
    setNewLastName("");
    setNewPassword('');
    setOldPassword("");
    setEditMode(false);}
  }

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 500 }}>
        <CardContent style={{ textAlign: "left" }}>
          <Typography gutterBottom variant="h5" component="div" color="#B04025">
            Account details
          </Typography>
          {editMode ? (
            <>
              <TextField
                label="First Name"
                fullWidth
                // value={newFirstName}
                onChange={(event) => setNewFirstName(event.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                fullWidth
                // value={newLastName}
                onChange={(event) => setNewLastName(event.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                fullWidth
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm Password"
                fullWidth
                type="password"
                value={newConfirmedPassword}
                onChange={(event) => setNewConfirmedPassword(event.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                First Name: {user.first_name}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Last Name: {user.last_name}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Email: {user.email}
              </Typography>
            </>
          )}
        </CardContent>
        <CardActions>
          {editMode ? (
            <div>
              <Button onClick={handleSaveEdit} className='edit-button' variant="contained" color="primary">
                Update
              </Button>
              <Button onClick={handleDeleteClick} className="delete-button" variant="contained" color="secondary">
                Delete account
              </Button>
            </div>
          ) : (
            <IconButton onClick={handleEditButtonClick}>
              <Edit />
            </IconButton>
          )}
        </CardActions>
        <Dialog open={isEditing} onClose={handleCancelEdit}>
          <DialogTitle>Edit User Details</DialogTitle>
          <form onSubmit={handlePasswordSubmit}>
            <DialogContent>
              <TextField label="Current Password" fullWidth value={oldPassword} type="password" onChange={(e) => setOldPassword(e.target.value)} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button type="submit">Next</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Card>
    </ThemeProvider>
  )
}