import { TableCell, TableRow, Button } from '@mui/material';
import { useContext, useState, useEffect } from "react";


export default function ScreeningHistoryItem({row}) {
  return (
    <TableRow key={row.id}>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.type}</TableCell>
      <TableCell>{row.database}</TableCell>
      <TableCell>{row.details}</TableCell>
      <TableCell>
      <Button variant="contained" color="secondary">View source</Button>
      </TableCell>
      <TableCell>
        <input type="text" value={row.comments} />
      </TableCell>
      <TableCell>
        <Button variant="contained" color="primary">Edit</Button>
        <Button variant="contained" color="secondary">Delete</Button>
      </TableCell>
    </TableRow>
  )
}