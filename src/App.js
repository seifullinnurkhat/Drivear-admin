import logo from "./logo.svg";
import "./App.css";
import { Route, Router, Switch } from "react-router";
import { history } from "./history";
import { useState } from "react";
import fire from "./fire";
import { useEffect } from "react";
import { connect } from "react-redux";
import { SET_USER } from "./redux/types";
import RouterConfig from "./navigation/RouterConfig";

function App(props) {
  const { user, setUser } = props;

  const authListener = () => {
    fire.auth().onAuthStateChanged((_user) => {
      if (_user) {
        console.log(_user.uid);
        setUser(_user);
      } else {
        setUser(null);
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  return <RouterConfig />;
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setUser: (payload) => dispatch({ type: SET_USER, payload: payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
