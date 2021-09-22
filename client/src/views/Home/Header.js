import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
// core components
import GoogleButton from "react-google-button";
import Header from "components/Header/Header.js";
import Button from "components/CustomButtons/Button.js";
import { GoogleLogin } from "react-google-login";

import styles from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.js";
import { set } from "nprogress";
import { useSnackbar } from "notistack";
import { Redirect } from "react-router";

const useStyles = makeStyles(styles);
export function TopBar() {
  const classes = useStyles();
  const [state, setState] = useState({
    success: false,
    data: {},
  });
  const { enqueueSnackbar } = useSnackbar();
  const onSuccess = async (googleData) => {
    setState({
      success: true,
      data: googleData,
    });
  };
  const onFailure = async (googleData) => {
    enqueueSnackbar("Authentication Failed", {
      variant: "error",
    });
  };
  console.log(state);
  return (
    <div
      id="navbar"
      className={classes.navbar}
      style={{ position: "fixed", width: "100%" }}
    >
      <div className={classes.navigation}>
        <Header
          brand="Digital Voting System"
          color="dark"
          rightLinks={
            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <GoogleLogin
                  clientId="734928268076-dki2mrdmbjme8t7rqirtv80g3bbhn219.apps.googleusercontent.com"
                  buttonText="Login"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={"single_host_origin"}
                />
              </ListItem>
            </List>
          }
        />
        {state.success && (
          <Redirect
            to={{
              pathname: "/profile",
              state: state,
            }}
          />
        )}
      </div>
    </div>
  );
}
export default TopBar;
