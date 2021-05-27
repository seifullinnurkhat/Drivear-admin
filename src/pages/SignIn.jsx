import {
  Button,
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

function SignIn(props) {
  const { setUser } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(true);

  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleLogin = () => {
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response);
        history.push("/orders");
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            setErrorResponse(err.message);
            setIsSnackbarOpen(true);
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
          height: "400px",
          minWidth: "830px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "100px",
        }}
      >
        <h1>LOGIN TO THE CABINET</h1>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon
                    style={{
                      width: "24px",
                    }}
                  />
                </InputAdornment>
              ),
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon
                    style={{
                      width: "24px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Link to="/register"> Don't have account ? </Link>

          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </ThemeProvider>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
