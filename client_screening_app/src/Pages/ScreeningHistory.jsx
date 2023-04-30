import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import ScreeningHistoryItem from "../components/ScreeningHistoryItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';


export default function ScreeningHistory () {
  const matchHistory = useLoaderData();
  const [currentMatchHistory, setCurrentMacthHistory] = useState(matchHistory)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };
  
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
          {currentMatchHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <ScreeningHistoryItem row = {row} setCurrentMacthHistory = {setCurrentMacthHistory}/>
          ))}
          </TableBody>
        </Table>
        <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={currentMatchHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </TableContainer>
  )
}