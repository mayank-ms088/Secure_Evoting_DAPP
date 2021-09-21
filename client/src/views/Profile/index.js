import React from "react";
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

import { Typography } from "@material-ui/core";
import styles from "../../assets/jss/material-kit-react/views/profilePage.js";

const useStyles = makeStyles(styles);

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
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  console.log(profileObj);
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
              <GridItem xs={12} sm={12} md={6}>
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
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
