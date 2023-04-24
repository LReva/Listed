import { useContext, useState, useEffect } from "react";
import ScreeningHistoryItem from "../components/ScreeningHistoryItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';



export default function ScreeningHistory () {

  const rows = [
    {
      id: 1,
      name: "John",
      type: "Doe",
      database: 35,
      details: "johndoe@example.com",
      source: "source",
      comments: "123 Main St, Anytown USA",
    },
    {
      id: 2,
      name: "Jane",
      type: "Doe",
      database: 30,
      details: "janedoe@example.com",
      source: "source",
      comments: "456 Oak St, Anytown USA",
    },
  ];
  
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
            {rows.map((row) => (<ScreeningHistoryItem row = {row}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}