import {
  AppBar,
  Button,
  createMuiTheme,
  Divider,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { ReactComponent as LogoIcon } from "../../assets/icons/logo.svg";
import React from "react";
import { Link } from "react-router-dom";
import fire from "../../fire";
import { history } from "../../history";

function Header({ activeIndex }) {
  const theme = createMuiTheme({
    palette: {
      primary: {
        500: "#53B175",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="static"
        style={{
          flexGrow: 1,
          height: "90px",
        }}
      >
        <Toolbar
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            size="small"
          >
            <div className="logo" style={{ height: "50px" }}>
              <LogoIcon style={{ height: "100%" }} />
            </div>
          </IconButton>
          <div className="menu" style={{ display: "flex" }}>
            <Link to="/orders">
              <Button
                color="inherit"
                style={{
                  height: "100%",
                  color: "white",
                  backgroundColor: activeIndex === 0 ? "white" : "inherit",
                }}
              >
                ORDERS
              </Button>
            </Link>
            <Link to="/services">
              <Button
                color="inherit"
                style={{
                  height: "100%",
                  color: "white",
                  backgroundColor: activeIndex === 0 ? "white" : "inherit",
                }}
              >
                Services
              </Button>
            </Link>
            <Link to="/cabinet/profile">
              <Button
                color="inherit"
                style={{
                  height: "100%",
                  color: "white",
                  backgroundColor: activeIndex === 0 ? "white" : "inherit",
                }}
              >
                MY CABINET
              </Button>
            </Link>
            <Divider orientation="vertical" flexItem />
            <Button
              color="inherit"
              style={{
                height: "100%",
                color: "white",
                backgroundColor: activeIndex === 0 ? "white" : "inherit",
              }}
              onClick={() => {
                fire.auth().signOut();
                history.push("/login");
                localStorage.removeItem("userId");
              }}
            >
              Exit
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
