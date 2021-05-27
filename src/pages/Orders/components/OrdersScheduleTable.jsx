import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import fire from "../../../fire";
import { history } from "../../../history";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function OrdersScheduleTable({ rows }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell align="right">Services</TableCell>
            <TableCell align="right">Car type</TableCell>
            <TableCell align="right">Service type</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow
              key={row.name}
              style={{ backgroundColor: row.order ? "green" : "white" }}
            >
              <TableCell component="th" scope="row">
                {row.time}
              </TableCell>
              <TableCell align="right">
                {row.order?.services.map((el) => el.name)}
              </TableCell>
              <TableCell align="right">
                {row.order?.carType && row.order?.id ? row.order?.carType : ""}
              </TableCell>
              <TableCell align="right">
                {row.order?.serviceType ?? row.order?.id ? "Эконом" : ""}
              </TableCell>
              <TableCell align="right">{row.order?.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrdersScheduleTable;
