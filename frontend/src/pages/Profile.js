import React, { useState, useContext, useEffect } from "react";
import UserContext from "../UserContext";
import { useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import Api from "../api/api";
import Posts from "../components/Posts";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  profileImage: {
    width: "50%",
    borderRadius: "100%",
  },
  content: {
    justifyContent: "left",
    textAlign: "left",
  },
  details: {
    marginTop: "10px",
  },
  chip: {
    padding: "0 5px",
    margin: ".2rem 5px",
  },
  about: {
    margin: "10px 0",
    alignItems: "left",
    textAlign: "left",
  },
}));

const Profile = (props) => {
  const { username } = useParams();
  const { currentUser } = useContext(UserContext);
  const [loadedUser, setLoadedUser] = useState({});
  const [profileLoaded, setProfileLoaded] = useState(false);
  console.debug(
    "Profile",
    "currentUser=",
    currentUser,
    "useParams username=",
    username,
    "loadedUser=",loadedUser
  );
  useEffect(() => {
    const getUserInParameter = async (username) => {
      try {
        setProfileLoaded(false)
        const user = await Api.getCurrentUser(username);
        setLoadedUser(user);
        setProfileLoaded(true)
      } catch(e) {
        setProfileLoaded(true)
        console.error("Profile loadedUser error", e);
        setLoadedUser(null);
      }
    }
    getUserInParameter(username)
  }, [username]);
  const classes = useStyles();
  const profileMarkup = () => {
    return (
      <React.Fragment>
        <div container>
          <img
            className={classes.profileImage}
            alt="Robert"
            src="https://source.unsplash.com/random"
          />
          <div className={classes.content}>
            <Typography component="h1" variant="h4">
              {loadedUser.firstName} {loadedUser.lastName}
            </Typography>
            {
              loadedUser.username === currentUser.username &&
              <Button variant="outlined" color="primary" circular>Edit Profile</Button>
            }
            {
              loadedUser.username !== currentUser.username ? (
              <Button variant="outlined" color="primary" fullWidth>
                Message
              </Button>
            ) : null}


            <Grid container justify="space-between" className={classes.details}>
              <Grid item>
            
              </Grid>
              <Grid item>
          
              </Grid>
            </Grid>
            <div>
              <Chip
                className={classes.chip}
                color="primary"
                label="Tags"
                size="small"
              />
              <Chip
                className={classes.chip}
                color="primary"
                label="Tags"
                size="small"
              />
            </div>
            <div className={classes.about}>
              <Typography component="h3" variant="h6">
                About Me:
              </Typography>
              <p>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square>
          <div className={classes.paper}>{profileMarkup()}</div>
        </Grid>
        <Grid item xs={false} sm={4} md={9}>
          <main>
            {/* Hero unit */}
            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}
              <h2>Posts</h2>
              <Grid container spacing={4}>
                <Posts />
              </Grid>
              <h2>Measurements</h2>
            </Container>
          </main>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;
