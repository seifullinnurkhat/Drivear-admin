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
import { ReactComponent as RatingStar } from "../../../assets/icons/rating_star.svg";
import { ReactComponent as RatingStarBorder } from "../../../assets/icons/star_border.svg";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function ReviewsTable({ rows }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#53B175" }}>
            <TableCell style={{ color: "white" }}>Data</TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Full Name
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Evaluation
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Reviews
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow key={row.name}>
              <TableCell
                style={{ color: "#4BA76C" }}
                component="th"
                scope="row"
              >
                {row.date.split(" ")[0]}
              </TableCell>
              <TableCell style={{ color: "#4BA76C" }} align="right">
                {row.from.displayName}
              </TableCell>
              <TableCell style={{ color: "#4BA76C" }} align="right">
                <div className="type">
                  {Array.from(Array(row.rating).keys()).map((e) => (
                    <RatingStar />
                  ))}
                  {Array.from(Array(5 - row.rating).keys()).map((e) => (
                    <RatingStarBorder />
                  ))}
                </div>
              </TableCell>
              <TableCell style={{ color: "#4BA76C" }} align="right">
                {row.message}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ReviewsTable;
