import React, { useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Button from "components/CustomButtons/Button";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import styles from "../../assets/jss/material-kit-react/views/profilePage.js";

const useStyles = makeStyles(styles);

function Register({
  email,
  onEmailChange,
  idNum,
  onIdNumChange,
  onClose,
  onRegister,
}) {
  const classes = useStyles();

  return (
    <Dialog maxWidth="sm" fullWidth onClose={onClose} open={true}>
      <DialogTitle
        disableTypography
        onClose={onClose}
        style={{ display: "flex" }}
      >
        <Typography variant="h5">{`Register to Vote`}</Typography>
        <Box flexGrow={1} />
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          id="Enrolment ID"
          value={idNum}
          required
          onChange={onIdNumChange}
          variant="outlined"
          label="Enrolment ID"
          fullWidth
          margin="dense"
          style={{
            marginBottom: 20,
          }}
        />
        <TextField
          autoFocus
          id="Email ID"
          value={email}
          required
          onChange={onEmailChange}
          variant="outlined"
          label="Email ID"
          margin="dense"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color="github" onClick={onClose}>
          Cancel
        </Button>
        <Button autoFocus color="github" onClick={onRegister}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default function Profile(props) {
  const classes = useStyles();
  const {
    location: {
      state: {
        data: { profileObj },
      },
    },
  } = props;
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const [open, setOpen] = useState(false);
  const [idNum, setIdNum] = useState("");
  const [email, setEmail] = useState(profileObj ? profileObj["email"] : "");
  const [isRegd, setIdRegd] = useState(false);
  const handleRegister = () => {};
  const onClose = () => {
    setOpen(false);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onIdNumChange = (e) => {
    setIdNum(e.target.value);
  };

  return (
    <div>
      <Header
        color="transparent"
        brand="Evoting System"
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
      />
      <Parallax
        small
        filter
        image={require("../../assets/img/profile-bg.jpg").default}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12}>
                <div className={classes.profile}>
                  <div>
                    <img
                      src={profileObj["imageUrl"]}
                      alt="..."
                      className={imageClasses}
                    />
                  </div>
                  <div className={classes.name}>
                    <Typography
                      className={classes.title}
                      style={{
                        textAlign: "center",
                        width: "100%",
                        marginBottom: -10,
                      }}
                      variant="h4"
                    >
                      {profileObj["name"]}
                    </Typography>
                    <h5
                      className={classes.title}
                      style={{ textAlign: "center" }}
                    >
                      {profileObj["email"]}
                    </h5>
                  </div>
                </div>
              </GridItem>
              <GridItem xs={12}>
                <Box display="flex" width="100%" justifyContent="center" py={4}>
                  <Button onClick={() => setOpen(true)} color="success">
                    Register to Vote
                  </Button>
                </Box>
              </GridItem>
            </GridContainer>
            {open && (
              <Register
                email={email}
                idNum={idNum}
                onClose={onClose}
                onEmailChange={onEmailChange}
                onIdNumChange={onIdNumChange}
                onRegister={handleRegister}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
