import { TableCell, TableRow, Button, TextField } from '@mui/material';
import { useContext, useState } from "react";
import { useNavigate} from 'react-router-dom';
import { MatchContext } from '../App';
import { deleteMatch, addComment, getMatchDetails, loadHistory } from '../utilities';
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

export default function ScreeningHistoryItem({row, setCurrentMacthHistory}) {
  const navigate = useNavigate();
  const {setMatchView} = useContext (MatchContext)
  const [edit, setEdit] = useState(true)
  const [comment, setComment] = useState(row.comments)
  const [save, setSave] = useState(false)

  const handleDelete = () => {
    deleteMatch(row).then(async()=>{
        setCurrentMacthHistory(await loadHistory())
      }) 
  }

  const handleViewDetails = async () => {
    let matchDetails = await getMatchDetails(row.link)
    setMatchView(matchDetails)
    navigate('/view-match/')
    }
  
  const handleCommenting = () => {
    if (edit) {
      setSave(!save)}
    else if (!edit) {
      if (save) {
        addComment(row.id, row.name, row.database, row.search_type, row.link, row.match, row.search, comment)
      }
      setSave(!save)
    }
    setEdit(!edit)
    }

  const handleCancel = () => {
    setSave(false)
    setEdit(true)
    setComment(row.comments)
  }

  return (
    <ThemeProvider theme={theme}>
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.search_type}</TableCell>
        <TableCell>{row.database}</TableCell>
        <TableCell>{row.match}</TableCell>
        <TableCell>
        <Button variant="contained" color="success" disabled = {row.link.length>0 ? (false) : (true)} onClick = {handleViewDetails}>View source</Button>
        </TableCell>
        <TableCell style = {{backgroundColor: edit ? ("white") : ("grey")}}>
          <TextField value = {comment} onChange={(e)=> {setComment(e.target.value)}} disabled={edit} contentEditable={edit}/>
        </TableCell>
        <TableCell>
          <Button className='edit-button' variant="contained" color="primary" onClick={handleCommenting}>{edit=== true ? ("Edit"):("Save")}</Button>
          <Button className="delete-button" variant="contained" color="secondary" onClick={edit === true ? (handleDelete) : (handleCancel)}>{edit=== true ? ("Delete"):("Cancel")}</Button>
        </TableCell>
      </TableRow>
    </ThemeProvider>
  )
}