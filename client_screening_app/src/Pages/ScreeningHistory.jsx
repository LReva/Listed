import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import ScreeningHistoryItem from "../components/ScreeningHistoryItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


export default function ScreeningHistory () {
  const matchHistory = useLoaderData();
  const [currentMatchHistory, setCurrentMacthHistory] = useState(matchHistory)
  
  return (
  <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Database</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentMatchHistory.map((row) => (<ScreeningHistoryItem row = {row} setCurrentMacthHistory = {setCurrentMacthHistory}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}