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
import Datetime from "react-datetime";
import List from "components/Header/HeaderLinks";
import ListItem from "components/Header/HeaderLinks";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Check as CheckIcon } from "react-feather";
import CloseIcon from "@material-ui/icons/Close";
import styles from "../../assets/jss/material-kit-react/views/profilePage.js";
import { registerToVote } from "core/utils/utils.js";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { ballotSetup } from "core/utils/utils.js";
import { set } from "nprogress";

const useStyles = makeStyles(styles);

function Register({
  email,
  onEmailChange,
  idNum,
  onIdNumChange,
  perm,
  onPermChange,
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
        <Typography variant="h5">{<b>Register to Vote</b>}</Typography>
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
          disabled
        />

        <Typography variant="body1">
          <Checkbox
            checked={Boolean(perm)}
            onChange={onPermChange}
            color="primary"
          />
          Do you want Ballot Creation Permission?
        </Typography>
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

function LoadBallot({
  ballotId,
  onBallotIdChange,
  onClose,
}) {
  const classes = useStyles();
  const onLoad = (i) => {
    console.log(i);
  };

  return (
    <Dialog maxWidth="sm" fullWidth onClose={onClose} open={true}>
      <DialogTitle
        disableTypography
        onClose={onClose}
        style={{ display: "flex" }}
      >
        <Typography variant="h5">{<b>Load a Ballot</b>}</Typography>
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
          id="Ballot ID"
          value={ballotId}
          required
          onChange={onBallotIdChange}
          variant="outlined"
          label="Ballot ID"
          fullWidth
          margin="dense"
          style={{
            marginBottom: 20,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="github" onClick={onClose}>
          Cancel
        </Button>
        <Button autoFocus color="github" onClick={onLoad}>
          Load
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function CreateBallot({ email, onClose, enqueueSnackbar }) {
  const classes = useStyles();
  const obj = useSelector((o) => o);
  const [ballot, setBallot] = useState({
    email: email,
    endDate: "",
    ballottype: 0,
    title: "",
    choices: "",
    votelimit: "",
    whitelist: false,
    whitelisted: "",
  });
  const [success, setSuccess] = useState(false);
  const [ballotid, setBallotId] = useState(null);
  const onCreation = (i, id) => {
    if (i != "success") {
      enqueueSnackbar(i, { variant: "error" });
      onClose();
    } else {
      setBallotId(id);
      setSuccess(true);
      enqueueSnackbar("Ballot Created Successfully!", { variant: "success" });
    }
  };

  const handleConfirm = () => {
    ballotSetup({
      ...ballot,
      ...obj["contracts"],
      web3: obj["web3"],
      onCreation: onCreation,
      accounts: obj["accounts"],
    });
  };
  console.log(ballotid);
  return (
    <Dialog maxWidth="md" fullWidth onClose={onClose} open={true}>
      <DialogTitle
        disableTypography
        onClose={onClose}
        style={{ display: "flex" }}
      >
        <Typography variant="h5">{<b>Create New Ballot</b>}</Typography>
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
        {!success ? (
          <>
            <TextField
              autoFocus
              id="Email ID"
              value={ballot["email"]}
              required
              onChange={(e) => setBallot({ ...ballot, email: e.target.value })}
              variant="outlined"
              label="Email ID"
              margin="dense"
              fullWidth
              disabled
            />
            <Typography variant="body1">
              Poll
              <Switch
                checked={Boolean(ballot.ballottype)}
                onChange={(e) => {
                  setBallot({ ...ballot, ballottype: e.target.checked });
                }}
              />
              Elections
            </Typography>
            <TextField
              autoFocus
              id="title"
              value={ballot["title"]}
              required
              onChange={(e) => setBallot({ ...ballot, title: e.target.value })}
              variant="outlined"
              label="Title"
              margin="dense"
              fullWidth
            />
            <TextField
              autoFocus
              id="choices"
              value={ballot["choices"]}
              required
              onChange={(e) =>
                setBallot({ ...ballot, choices: e.target.value })
              }
              variant="outlined"
              label="Candidates"
              helperText="Use (,) to seperate the candidates names."
              margin="dense"
              fullWidth
            />
            <TextField
              autoFocus
              id="votelimit"
              value={ballot["votelimit"]}
              required
              onChange={(e) =>
                setBallot({ ...ballot, votelimit: e.target.value })
              }
              variant="outlined"
              label="Vote Limit"
              helperText="No. of votes allowed per person."
              margin="dense"
              fullWidth
            />

            <Datetime
              value={
                ballot["endDate"] ? new Date(ballot["endDate"] * 1000) : ""
              }
              onChange={(e) =>
                setBallot({ ...ballot, endDate: e.toDate().getTime() / 1000 })
              }
              inputProps={{ placeholder: "Poll End Date and Time" }}
            />
          </>
        ) : (
          <Card>
            <CardContent>
              <Box maxWidth={450} mx="auto">
                <Box display="flex" justifyContent="center">
                  <Avatar style={{ backgroundColor: "green" }}>
                    <CheckIcon />
                  </Avatar>
                </Box>
                <Box mt={2}>
                  <Typography variant="h3" color="textPrimary" align="center">
                    Success!
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                  >
                    {"Your Ballot is created successfully."}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                  >
                    {`Ballot ID: `}
                    <b>{`${ballotid}`}</b>
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                  >
                    {`Copy this Ballot ID to Load the Ballot and Vote`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="github" onClick={onClose}>
          Close
        </Button>
        {!success && (
          <Button autoFocus color="github" onClick={handleConfirm}>
            Confirm
          </Button>
        )}
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
  const obj = useSelector((o) => o);
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const [ballotOpen, setBallotOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [ballotId, setBallotId] = useState("");
  const [idNum, setIdNum] = useState("");
  const [email, setEmail] = useState(profileObj ? profileObj["email"] : "");
  const [perm, SetPerm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleRegister = () => {
    const { web3, accounts, contracts } = obj;
    // console.log(contracts["Registrar"]);
    const onRegister = (i) => {
      if (i == "registered") {
        enqueueSnackbar("You have successfully registered!", {
          variant: "success",
        });
      } else if (i == "already Registered") {
        enqueueSnackbar("You are already registered.", {
          variant: "info",
        });
      } else {
        enqueueSnackbar("Invalid Email.", {
          variant: "error",
        });
      }
      onClose();
    };
    registerToVote({
      idNum: idNum,
      email: email,
      permreq: perm,
      Registrar: contracts["Registrar"],
      accounts: accounts,
      onRegister: onRegister,
      web3: web3,
    });
  };
  const onBallotIdChange = (e) => {
    setBallotId(e.target.value);
  }
  const onClose = () => {
    setOpen(false);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onIdNumChange = (e) => {
    setIdNum(e.target.value);
  };
  const onPermChange = (e) => {
    SetPerm(e.target.checked);
  };

  return (
    <div>
      <Header
        color="transparent"
        brand="Digital Voting System"
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
        rightLinks={
          <List className={classes.list}>
            <ListItem className={classes.listItem}>
            </ListItem>
          </List>
        }

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
                    <b>Register to Vote</b>
                  </Button>
                </Box>
              </GridItem>
              <GridItem xs={12}>
                <Box display="flex" width="100%" justifyContent="center">
                  <Typography variant="body1">
                    Or If Already Registered
                  </Typography>
                </Box>
              </GridItem>
              <GridItem xs={12}>
                <Box display="flex" width="100%" justifyContent="center">
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="center"
                    py={4}
                  >
                    <Button
                      color="success"
                      style={{ marginRight: 55 }}
                      onClick={() => setBallotOpen(true)}
                    >
                      <b>Create a Ballot</b>
                    </Button>
                    <Button
                      color="success"
                      onClick={() => setLoadOpen(true)}
                    >
                      <b>Load a Ballot</b>
                    </Button>
                  </Box>
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
                onPermChange={onPermChange}
                perm={perm}
              />
            )}
            {ballotOpen && (
              <CreateBallot
                onClose={() => setBallotOpen(false)}
                email={profileObj["email"]}
                enqueueSnackbar={enqueueSnackbar}
              />
            )}
            {loadOpen && (
              <LoadBallot
                ballotId={ballotId}
                onBallotIdChange={onBallotIdChange}
                onClose={() => setLoadOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
