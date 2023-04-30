import { useContext, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SavedResultContext } from "../Pages/ScreeningResult";

const theme = createTheme({
  components: {
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: 'grey',
        },
      },
    },
  },
  palette: {
    secondary:{
      main: '#B04025',
    },
  },
});

export default function ResultElement({result, type, database, matchHistoryID}){
  const [match, setMatch] = useState(false)
  const [selectedItem, setSelectedItem] = useState({})
  const {savedResults} = useContext(SavedResultContext)
  const {counter} = useContext(SavedResultContext)
  const {setCounter} = useContext(SavedResultContext)
  const {setSavedResults} = useContext(SavedResultContext)
  const link = result.source

  const handleMatchSelection = () => {
    if (match === false) {
      setSelectedItem({
      "name": result.name,
      "database": database,
      "search_type": type,
      "link": result.source,
      "match": 1})
    } 
    else if (match === true) {
      setSelectedItem({})
    }
    let currentCount = counter + 1
    setCounter(currentCount)
    setMatch(!match)
  }

  useEffect(() => {
    if (Object.keys(selectedItem).length === 0 && counter > 0){
      let filteredSelection = savedResults.filter(item => item.link !== link)
      setSavedResults(filteredSelection)
    }
    else if (counter != 0) {
      setSavedResults([...savedResults, selectedItem])
    } 
  }, [selectedItem]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="main-results">
      <div className="result-div" style = {{backgroundColor: !match ? ("grey") : ("#B04025")}}>
        <div className="result-details">
          <p>Name: {result.name}</p>
          <p>Aliases: {result.aliases}</p>
          {result.sex ? (<p>Gender: {result.sex}</p>) : (<p>Address: {result.address}</p>)}
          <p>DOB: {result.DOB}</p>
          {result.race ? (<p>Race: {result.race}</p>) : (<p>Passport: {result.passports}</p>)}
          {result.nationality ? (<p>Nationality: {result.nationality}</p>) : (<p>Citizenship: {result.citizenship}</p>)}
          {result.scars_and_marks ? (<p>Scars and marks: {result.scars_and_marks}</p>) : (<p>Details: {result.caution}</p>)}
          {result.eyes ? (<p>Eyes: {result.eyes}</p>) : (<p>Programs: {result.programs}</p>)}
          {result.hair ? (<p>Hair: {result.hair}</p>) : (<p>Additional Sanctions: {result.additionalSanctions}</p>)}
          {result.caution ? (<p>Details: {result.caution}</p>): (<p></p>)}
          {result.caution === "SDN" ? (
            <div className="popover-div">
            <ThemeProvider theme={theme}>
              <Button aria-describedby={id} color="secondary" variant="contained" onClick={handleClick}>
              Lear more
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Typography sx={{ p: 2 }}>Specially Designated Nationals and Blocked Persons. Individuals and entities identified by the United States government as being associated with terrorism, drug trafficking, money laundering, or other criminal activities.</Typography>
              </Popover>
            </ThemeProvider>
          </div>
          ) : (<p></p>)}
        </div>
          {result.photo ? (<div className="image-div">
            <img className="photo" src={result.photo === "not available" ? ("") : result.photo} alt="No image available" />
            </div>) : 
          (<p></p>)}
      </div>
      <Button onClick = {handleMatchSelection}>{!match ? ("Select") : ("Clear selection")}</Button>
    </div>
  )
}