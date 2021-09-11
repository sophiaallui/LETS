/**
 * Creating a holder just so the website would have a navigation bar
 */

import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { BroserRouter as Router, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import { Divider } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({

    root:{
        flexGrow:1,
        color:'white'
    },
    link:{
        textDecoration: 'none',
        color: "white",
        "&:hover": {
          backgroundColor: "transparent",
          display: "block",
          borderBottom: "2px solid transparent",
          "&.active":{
            borderBottom: "2px solid black"
          },     
    
        },
    },
    links:{
        padding:'10px'
    }
  
}));

export default function NavBar(){

    const classes = useStyles(); 
    return(
        <div>
            <AppBar position="static" style={{background: 'red'}}>
                <Toolbar>
                    <Typography variant="title" color="inherit" style={{padding:"10px"}}>
                        <strong>GAINZ</strong>
                    </Typography>

                    <Grid container alignItem="center">
                        <Grid className={classes.links}>
                            <Link className={classes.link} to="/">
                                <strong>home</strong>
                            </Link>
                        </Grid>
                        <Divider orientation="vertical" flexItem></Divider>

                        <Grid className={classes.links}>
                            <Link className={classes.link} to="/progress">
                                <strong>progress</strong>
                            </Link>
                        </Grid>
                        <Divider orientation="vertical" flexItem></Divider>

                        <Grid className={classes.links}>
                            <Link className={classes.link} to="/messenger">
                                <strong>messageee :3</strong>
                            </Link>
                        </Grid>

                        <Grid className={classes.links}>
                            <Link className={classes.link} to="/login">
                                <strong>Login</strong>
                            </Link>
                        </Grid>

                        
                        <Grid className={classes.links}>
                            <Link className={classes.link} to="/register">
                                <strong>Register</strong>
                            </Link>
                        </Grid>

                        <Divider orientation="vertical" flexItem></Divider>

                    </Grid>


                </Toolbar>
            </AppBar>
        </div>
    )
}