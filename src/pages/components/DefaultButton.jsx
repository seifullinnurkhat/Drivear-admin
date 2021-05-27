import { Button, createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";

function DefaultButton({ children }) {
  const theme = createMuiTheme({
    palette: {
      primary: {
        500: "#53B175",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Button variant="contained" color="primary" style={{ padding: "0" }}>
        {children}
      </Button>
    </ThemeProvider>
  );
}

export default DefaultButton;
