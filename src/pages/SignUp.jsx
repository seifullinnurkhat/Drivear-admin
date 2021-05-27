import {
  Button,
  CircularProgress,
  createMuiTheme,
  InputAdornment,
  Snackbar,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as PersonIcon } from "../assets/icons/person.svg";
import { ReactComponent as KeyIcon } from "../assets/icons/key.svg";
import { green, purple } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import fire from "../fire";
import { useState } from "react";
import { history } from "../history";
import { SET_USER } from "../redux/types";
import MuiAlert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import { Map, Placemark, YMaps } from "react-yandex-maps";

function SignUp(props) {
  const [loading, setLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(true);
  const { setUser } = props;
  const [errorResponse, setErrorResponse] = useState(null);
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [carwashName, setCarwashName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [coords, setCoords] = useState([43.238352, 76.8958813]);

  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleLogin = () => {
    setLoading(true);
    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((response) => {
        console.log(response);
        setErrorResponse(response.message);
        setIsSnackbarOpen(true);
        setLoading(false);
      })
      .then((response) => {
        setUser(response.user);
        const ref = fire
          .firestore()
          .collection("users")
          .doc(response.user.uid)
          .set({
            id: response.user.uid,
            firstName: fullname,
            email: email,
            phone: phone,
          });
        fire
          .firestore()
          .collection("car_wash")
          .doc(response.user.uid)
          .set({
            id: response.user.uid,
            avgPrice: 5000,
            rating: 5.0,
            name: carwashName,
            services: [],
            location: coords,
          })
          .then((value) => {
            setLoading(false);
            history.push("/orders");
          });
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "grey",
      }}
    >
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => {
          setIsSnackbarOpen(false);
        }}
      >
        <Alert
          onClose={() => {
            setIsSnackbarOpen(false);
          }}
          severity="error"
          error={true}
        >
          {errorResponse ?? "Something go wrong!"}
        </Alert>
      </Snackbar>
      <div
        style={{
          height: "600px",
          minWidth: "830px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "100px",
        }}
      >
        <h1>CAR WASH REGISTRATION</h1>
        {loading ? (
          <CircularProgress style={{ alignSelf: "center" }} />
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "100%",
            }}
          >
            <TextField
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              error={emailError}
              label="Fullname"
              placeholder="Fullname"
              type="text"
              variant="outlined"
              style={{
                width: "100%",
              }}
            />
            <TextField
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={emailError}
              label="Phone"
              placeholder="Phone"
              type="text"
              variant="outlined"
              style={{
                width: "100%",
              }}
            />
            <TextField
              id="carwashname"
              value={carwashName}
              onChange={(e) => setCarwashName(e.target.value)}
              error={emailError}
              label="Car wash Name"
              placeholder="Car wash name"
              type="text"
              variant="outlined"
              style={{
                width: "100%",
              }}
            />
            <TextField
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              label="Email"
              placeholder="Email"
              type="email"
              variant="outlined"
              style={{
                width: "100%",
              }}
            />
            <TextField
              id="password"
              label="Password"
              value={password}
              error={passwordError}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              variant="outlined"
              style={{
                width: "100%",
              }}
            />
            <div className="map" style={{ width: "100%", height: "500px" }}>
              <YMaps>
                <Map
                  instanceRef={(ref) => {
                    if (ref) {
                      ref.events.add("click", function (e) {
                        console.log(e.get("coords"));
                        setCoords(e.get("coords"));
                      });
                    }
                  }}
                  defaultState={{
                    center: [43.238352, 76.8958813, 17],
                    zoom: 10,
                  }}
                >
                  <Placemark geometry={coords} />
                </Map>
              </YMaps>
            </div>

            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleLogin}
              >
                Sign up
              </Button>
            </ThemeProvider>
          </div>
        )}
      </div>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
