import React from "react";

import { Box, makeStyles, Button, Typography } from "@material-ui/core";
import styles from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.js";

const useStyles = makeStyles(styles);
export function Content() {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      position="relative"
      px={40}
    >
      <Box mt={25}>
        <Typography
          variant="h2"
          style={{
            color: "black",
            fontSize: "5em",
            fontFamily: "Roboto",
            marginBottom: 40,
          }}
        >
          <b>A Secure Decentralized E-Voting System</b>
        </Typography>
        <Typography
          variant="body1"
          style={{
            color: "black",
            fontSize: "2em",
            fontFamily: "Roboto",
            marginBottom: 40,
          }}
        >
          Use this system to host Local Area Elections where you can create a
          ballot, whitelist your voters and choose to see live results or to
          display results after the elections are over.
        </Typography>
        <Button variant="contained" onClick={(e) => console.log(1)}>
          Learn More
        </Button>
        <Box mt={25}>
          <Typography
            variant="h2"
            style={{
              color: "black",
              fontSize: "3em",
              fontFamily: "Roboto",
              marginBottom: 40,
            }}
          >
            <b>How does this Digital Voting works ?</b>
          </Typography>
          <Typography
            variant="body1"
            style={{
              color: "black",
              fontSize: "2em",
              fontFamily: "Roboto",
              marginBottom: 40,
            }}
          >
            <ul>Sign in using google</ul>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
