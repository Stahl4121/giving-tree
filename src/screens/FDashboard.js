import React, { useEffect, useContext } from 'react';
import SmallGrantCard from '../components/SmallGrantCard.js';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from '../firebase.js';
import Search from '../components/Search';
import { makeStyles } from '@material-ui/core/styles';
import UserAuthContext from '../auth/context.js';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles(theme => ({
  container: {
    paddingBottom: theme.spacing(2),
  },
  toggleBar: {
    marginBottom: 4,
  }
}));

export default function FDashboard(props) {

  const classes = useStyles();

  // List of small grant cards
  const [grants, setGrants] = React.useState([]);
  const [expiredGrants, setExpiredGrants] = React.useState([]);
  const [currentGrants, setCurrentGrants] = React.useState([]);
  const [draftedGrants, setDraftedGrants] = React.useState([]);
  const [toggleBarStatus, setToggleBarStatus] = React.useState('current');
  const [displayedGrants, setDisplayedGrants] = React.useState([]);
  // Foundation ID
  const user = useContext(UserAuthContext);

  // Initialize database and specific grant in database
  const db = firebase.firestore();
  const [docs, setDocs] = React.useState([]);
  const [snapshot, loading, error] = useCollection(db.collection('grants'));

  useEffect(() => {
    let newGrants = [];
    let newDocs = [];

    if (!loading && !error) {
      snapshot.forEach(function (doc) {
        if (doc.data().cf_id === user?.cfId) {
          newDocs.push({
            dist: -1,
            id: doc.id,
            title: doc.data().title,
            cfName: doc.data().cf_name,
            nonprofitName: doc.data().nonprofit_name,
            goalAmt: doc.data().goal_amt,
            moneyRaised: doc.data().money_raised,
            img: doc.data().images[0] || 'GivingTree.png',
            nonprofitId: doc.data().nonprofit_id,
            address: doc.data().address,
            lat: doc.data().lat,
            long: doc.data().long,
            datePosted: doc.data().date_posted,
            dateDeadline: doc.data().date_deadline,
            desc: doc.data().desc,
            tags: doc.data().tags,
            status: doc.data().status,
          });
          let grant = <SmallGrantCard
            id={doc.id}
            title={doc.data().title}
            cfName={doc.data().cf_name}
            nonprofitName={doc.data().nonprofit_name}
            goalAmt={doc.data().goal_amt}
            moneyRaised={doc.data().money_raised}
            img={doc.data().images[0] || 'GivingTree.png'}
            status={doc.data().status} />;
          newGrants.push(grant);
        }
      });
      console.log("newDocs: ", newDocs);
      setDocs(newDocs);
      setGrants(newGrants);
      setDisplayedGrants(newGrants);
      console.log("these are the newgrants: ", newGrants);
    }
  }, [snapshot, error, loading]);
/*
  useEffect(() => {
    var curGrants = [];
    var exGrants = [];
    var drGrants = [];
    docs.forEach((doc) => {
      let grant = <SmallGrantCard
        id={doc.id}
        title={doc.title}
        cfName={doc.cfName}
        nonprofitName={doc.nonprofitName}
        goalAmt={doc.goalAmt}
        moneyRaised={doc.moneyRaised}
        img={doc.img} />;
      if (doc.status === 'current') {
        curGrants.push(grant);
      } else if (doc.status === 'draft') {
        drGrants.push(grant);
      } else if (doc.status === 'expired') {
        exGrants.push(grant);
      }
    });
    setCurrentGrants(curGrants);
    setDraftedGrants(drGrants);
    setExpiredGrants(exGrants);
  }, [grants, docs]);
  */
  function searchCallback(childData) {
    //console.log("childData in dashboard: ", childData);
    var newGrants = [];
    var curGrants = [];
    var exGrants = [];
    var drGrants = [];
    childData.forEach((meta) => {
      let grant = <SmallGrantCard
          id={meta.grant.id}
          title={meta.grant.title}
          cfName={meta.grant.cfName}
          nonprofitName={meta.grant.nonprofitName}
          goalAmt={meta.grant.goalAmt}
          moneyRaised={meta.grant.moneyRaised}
          img={meta.grant.img} />
      newGrants.push(grant);
      if (meta.grant.status === 'current') {
        curGrants.push(grant);
      } else if (meta.grant.status === 'draft') {
        drGrants.push(grant);
      } else if (meta.grant.status === 'expired') {
        exGrants.push(grant);
      }
    });
    setGrants(newGrants);
    setCurrentGrants(curGrants);
    setDraftedGrants(drGrants);
    setExpiredGrants(exGrants);
    console.log("newGrants: ", newGrants);
  }

  const handleToggle = (event, status) => {
    setToggleBarStatus(status);
    if(status === 'current') {
      setDisplayedGrants(currentGrants);
    }
    else if(status === 'drafted') {
      setDisplayedGrants(draftedGrants);
    }
    else {
      setDisplayedGrants(expiredGrants);
    } 
  };

  const buttonOptions = [
    <ToggleButton key={1} value="current">
      Current
    </ToggleButton>,
    <ToggleButton key={2} value="drafted">
      Drafted
    </ToggleButton>,
    <ToggleButton key={3} value="expired">
      Expired
    </ToggleButton>
  ];

  return (
    <Container maxWidth='md' className={classes.container}>
      {docs &&
        <div>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item className={classes.toggleBar}>
              <ToggleButtonGroup size="small" value={toggleBarStatus} exclusive onChange={handleToggle}>
                {buttonOptions}
              </ToggleButtonGroup>
            </Grid>
          </Grid>
          <Search docs={docs} parentCallback={searchCallback} />
          <Grid container spacing={2} >
            {displayedGrants}
          </Grid>
        </div>
      }
    </Container>
  );
}