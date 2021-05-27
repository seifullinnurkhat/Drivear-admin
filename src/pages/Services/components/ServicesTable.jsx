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
import React from "react";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function ServicesTable({ rows, handleDeleteService, handleSubmitEditService }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#53B175" }}>
            <TableCell style={{ color: "white" }}>№</TableCell>
            <TableCell style={{ color: "white" }}>Name</TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Description
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Price
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell style={{ color: "#4BA76C" }} scope="row">
                {row.id}
              </TableCell>
              <TableCell style={{ color: "#4BA76C" }}>{row.name}</TableCell>
              <TableCell style={{ color: "#4BA76C" }} align="right">
                {row.description}
              </TableCell>
              <TableCell style={{ color: "#4BA76C" }} align="right">
                {row.price}
              </TableCell>
              <TableCell style={{ color: "#4BA76C" }} align="right">
                <div
                  className="service_actions"
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <button
                    onClick={() => {
                      handleSubmitEditService(index);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteService(index);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ServicesTable;
