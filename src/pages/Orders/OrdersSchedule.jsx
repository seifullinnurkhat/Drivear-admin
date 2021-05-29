import {
  fade,
  makeStyles,
  InputBase,
  Modal,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@material-ui/core";
import React from "react";
import DefaultButton from "../components/DefaultButton";
import DefaultPage from "../components/DefaultPage";
import SearchIcon from "@material-ui/icons/Search";
import { useState } from "react";
import { InputTwoTone } from "@material-ui/icons";
import { useEffect } from "react";
import fire from "../../fire";
import { history } from "../../history";
import { SET_USER } from "../../redux/types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import OrdersScheduleTable from "./components/OrdersScheduleTable";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#53B175",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    border: "1.5px #53B175 solid",
    borderRadius: "10px",
    color: "#53B175",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function OrdersSchedule(props) {
  const { user, setUser } = props;
  const [open, setOpen] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [ref, setRef] = useState();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [currentDate, setCurrentDate] = useState(Date.now());
  const classes = useStyles();

  useEffect(() => {
    const currentUser = fire.auth().currentUser;
    const userId = localStorage.getItem("userId");
    console.log(currentUser || userId);
    if (currentUser || userId) {
      setLoading(true);
      const ref = fire
        .firestore()
        .collection("carwash_orders")
        .doc(currentUser?.uid || userId);
      const docSnapshot = ref.get().then((value) => {
        setOrders(value.data()?.orders ?? []);
        console.table(value.data()?.orders ?? []);
        setLoading(false);
      });

      setRef(ref);
      filterData(currentDate);
    } else {
      history.push("/login");
    }
  }, [user]);

  const filterData = (currentDate) => {
    const _data = orders
      .filter((el) => el.status == "ACCEPTED")
      .filter((el) => {
        console.log(
          el.date.split(" ")[0],
          currentDate,
          el.date.split(" ")[0] == currentDate
        );
        return el.date.split(" ")[0] == currentDate;
      });
    console.log(_data);
    const _result = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((el) => {
      return {
        time: `${el}:00`,
        order:
          _data.filter((order) => {
            console.log(
              order.time.split(":")[0],
              el,
              order.time.split(":")[0] == el
            );
            return order.time.split(":")[0] == el;
          }).length > 0
            ? _data.filter((order) => {
                console.log(
                  order.time.split(":")[0],
                  el,
                  order.time.split(":")[0] == el
                );
                return order.time.split(":")[0] == el;
              })[0]
            : null,
      };
    });
    console.table(_result.map((el) => el.order));
    setFilteredRows(_result);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DefaultPage>
      <div className="orders_page">
        <div className="title">Orders</div>
        <div className="subtitle">
          <Link to="/orders/inbox">
            <DefaultButton>
              <div style={{ display: "flex" }}>
                <div
                  className="content"
                  style={{ margin: "6px" }}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  New Orders
                </div>
                <div
                  className="leading"
                  style={{
                    backgroundColor: "red",
                    padding: "6px",
                    borderRadius: "4px",
                  }}
                >
                  {orders.filter((el) => el.status == null).length}
                </div>
              </div>
            </DefaultButton>
          </Link>
        </div>
        <div className="filters">
          <TextField
            id="date"
            label="Birthday"
            type="date"
            defaultValue="2017-05-24"
            value={currentDate}
            className={classes.textField}
            onChange={(value) => {
              setCurrentDate(value.target.value);
              filterData(value.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <OrdersScheduleTable rows={filteredRows}></OrdersScheduleTable>
        )}
      </div>
    </DefaultPage>
  );
}

export default OrdersSchedule;
