import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import firebase from '../firebase.js';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Text from './Text.js';
import ProgressBar from './ProgressBar.js';
import { makeStyles } from '@material-ui/styles';
import { useDownloadURL } from 'react-firebase-hooks/storage';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    height: 150,
  },
  cardContent: {
    flexGrow: 1,
  },
}))

export default function SmallGrantCard(props) {
  const classes = useStyles();

  // Grant details
  const [id, setId] = React.useState(props.id);
  const [title, setTitle] = React.useState(props.title);
  const [cfName, setCfName] = React.useState(props.cfName);
  const [nonprofitName, setNonprofitName] = React.useState(props.nonprofitName);
  const [goalAmt, setGoalAmt] = React.useState(props.goalAmt);
  const [moneyRaised, setMoneyRaised] = React.useState(props.moneyRaised);
  const [img, setImg] = React.useState(props.img);

  // Observe grant details
  useEffect(() => { setId(props.id); }, [props.id]);
  useEffect(() => { setTitle(props.title); }, [props.title]);
  useEffect(() => { setCfName(props.cfName); }, [props.cfName]);
  useEffect(() => { setNonprofitName(props.nonprofitName); }, [props.nonprofitName]);
  useEffect(() => { setGoalAmt(props.goalAmt); }, [props.goalAmt]);
  useEffect(() => { setMoneyRaised(props.moneyRaised); }, [props.moneyRaised]);
  useEffect(() => { setImg(props.img) }, [props.img]);

  // Create reference to firebase storage
  let storage = firebase.storage();
  let storageRef = storage.ref();

  // Get image URL
  const [downloadUrl, loading, error] = useDownloadURL(storageRef.child(img));

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardActionArea
          component={Link}
          to={'/grants/' + id}>
          {!loading && !error &&
            <CardMedia
              className={classes.cardMedia}
              image={downloadUrl}
              title="Grant Image"
            />
          }
          <CardContent className={classes.cardContent}>
            <Text type='card-aboveheading' text={nonprofitName} />
            <Text type='card-heading' text={title} />
            <Text type='card-subheading' text={cfName} />
            <ProgressBar goal={goalAmt} raised={moneyRaised} />
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid >
  );
}
