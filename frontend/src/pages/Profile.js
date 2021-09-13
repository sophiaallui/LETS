import React, { useState, useContext, useEffect } from "react";
import UserContext from "../UserContext";
import { useParams } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Chip from "@material-ui/core/Chip";
import Api from "../api/api";

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
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum."
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
              <Grid container spacing={4}>
                {cards.map((card) => (
                  <Grid item key={card} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.cardMedia}
                        image="https://source.unsplash.com/random"
                        title="Image title"
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          Heading
                        </Typography>
                        <Typography>
                          This is a media card. You can use this section to
                          describe the content.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">
                          View
                        </Button>
                        <Button size="small" color="primary">
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </main>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;
