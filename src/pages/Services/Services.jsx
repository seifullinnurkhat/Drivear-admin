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
import ServicesTable from "./components/ServicesTable";
import { useState } from "react";
import { InputTwoTone } from "@material-ui/icons";
import { useEffect } from "react";
import fire from "../../fire";
import { history } from "../../history";
import { SET_USER } from "../../redux/types";
import { connect } from "react-redux";

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

function Services(props) {
  const { user, setUser } = props;
  const [open, setOpen] = useState(false);
  const [newService, setNewService] = useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  const [ref, setRef] = useState();
  const [carwash, setCarwash] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const currentUser = fire.auth().currentUser;
    currentUser == null && history.push("/login");
    if (currentUser || userId) {
      setLoading(true);
      const _ref = fire
        .firestore()
        .collection("car_wash")
        .doc(currentUser.uid || userId);
      setRef(_ref);
      _ref.get().then((value) => {
        setCarwash(value.data());
        setLoading(false);
      });
    } else {
      //   user == null && history.push("/sign_in");
    }
  }, [user]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitNewService = () => {
    ref.get().then((value) => {
      setCarwash(value.data());
    });
    const listServices = carwash?.services ?? [];
    listServices.push({
      id: listServices.length + 1,
      ...newService,
    });

    console.log(listServices);
    ref.set({
      ...carwash,
      services: listServices,
    });
    setCarwash({
      ...carwash,
      services: listServices,
    });
    setNewService(null);
  };

  const handleSubmitEditService = (index) => {
    ref.get().then((value) => {
      setCarwash(value.data());
    });
    const listServices = carwash.services ?? [];
    setSelectedIndex(index);
    setNewService(listServices[index]);

    setOpen(true);
  };

  const handleSaveEditService = () => {
    const listServices = carwash.services ?? [];
    listServices[selectedIndex] = newService;
    ref.set({
      ...carwash,
      services: listServices,
    });

    setOpen(false);
  };

  const handleDeleteService = (index) => {
    const listServices = carwash.services ?? [];
    listServices.splice(index);

    console.log(listServices);
    ref.set({
      ...carwash,
      services: listServices,
    });
    setCarwash({
      ...carwash,
      services: listServices,
    });
  };

  return (
    <DefaultPage>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Add a Service</h2>
          <TextField
            id="description"
            label="Description"
            value={newService?.description}
            onChange={(e) =>
              setNewService({
                ...newService,
                description: e.target.value,
              })
            }
            placeholder="Description"
            variant="outlined"
            style={{
              width: "100%",
            }}
          />
          <TextField
            id="name"
            label="Name"
            value={newService?.name}
            onChange={(e) =>
              setNewService({
                ...newService,
                name: e.target.value,
              })
            }
            placeholder="Name"
            variant="outlined"
            style={{
              width: "100%",
            }}
          />
          <TextField
            id="price"
            label="Price"
            type="number"
            value={newService?.price}
            onChange={(e) =>
              setNewService({
                ...newService,
                price: parseInt(e.target.value),
              })
            }
            placeholder="Price"
            variant="outlined"
            style={{
              width: "100%",
            }}
          />
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-simple-select-filled-label">
              Service Image
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={newService?.imageUrl}
              onChange={(e) => {
                setNewService({
                  ...newService,
                  imageUrl: e.target.value,
                });
              }}
            >
              <MenuItem value={"images/services/regularWash.png"}>
                <img src="https://firebasestorage.googleapis.com/v0/b/socialmediaapp-dc59a.appspot.com/o/images%2Fservices%2FregularWash.png?alt=media&token=ff6d7de3-9f3f-4367-adc7-15b520fc3fdf" />
              </MenuItem>
              <MenuItem value={"images/services/glassCleaning.png"}>
                <img src="https://firebasestorage.googleapis.com/v0/b/socialmediaapp-dc59a.appspot.com/o/images%2Fservices%2FglassCleaning.png?alt=media&token=90bd9579-ba11-4c0a-af0c-e2d3faef7a5e" />
              </MenuItem>
              <MenuItem value={"images/services/trunkCleaning.png"}>
                <img src="https://firebasestorage.googleapis.com/v0/b/socialmediaapp-dc59a.appspot.com/o/images%2Fservices%2FtrunkCleaning.png?alt=media&token=f9af8118-06e4-4c89-9e03-26ce72200c36" />
              </MenuItem>
              <MenuItem value={"images/services/salonVacuum.png"}>
                <img src="https://firebasestorage.googleapis.com/v0/b/socialmediaapp-dc59a.appspot.com/o/images%2Fservices%2FsalonVacuum.png?alt=media&token=d4d92d46-b9dd-48ee-8099-f18ba7cd5068" />
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              newService != null && newService.id
                ? handleSaveEditService()
                : handleSubmitNewService();
              setOpen(false);
            }}
          >
            Save
          </Button>
        </div>
      </Modal>

      <div className="orders_page">
        <div className="title">Services</div>
        <div className="subtitle">
          <DefaultButton>
            <div style={{ display: "flex" }}>
              <div
                className="content"
                style={{ margin: "6px" }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                New Service
              </div>
              <div
                className="leading"
                style={{
                  backgroundColor: "red",
                  padding: "6px",
                  borderRadius: "4px",
                }}
              >
                2
              </div>
            </div>
          </DefaultButton>
        </div>
        <div className="filters">
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <ServicesTable
            rows={carwash?.services}
            handleDeleteService={handleDeleteService}
            handleSubmitEditService={handleSubmitEditService}
          />
        )}
      </div>
    </DefaultPage>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setUser: (payload) => dispatch({ type: SET_USER, payload: payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Services);
