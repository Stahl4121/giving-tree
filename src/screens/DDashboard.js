import React, { useEffect } from 'react';
import SmallGrantCard from '../components/SmallGrantCard.js';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import firebase from '../firebase.js';
import Search from '../components/Search';

export default function DDashboard() {
  // List of small grant cards
  const [grants, setGrants] = React.useState([]);

  // Initialize database and specific grant in database
  const db = firebase.firestore();

  const [snapshot, loading, error] = useCollectionOnce(db.collection('grants'));
  
  useEffect(() => {
    var newGrants = [];
    if (!loading && !error) {
      snapshot.forEach(function (doc) {
        newGrants.push(
          <SmallGrantCard
            id={doc.id}
            title={doc.data().title}
            cfName={doc.data().cf_name}
            nonprofitName={doc.data().nonprofit_name}
            goalAmt={doc.data().goal_amt}
            moneyRaised={doc.data().money_raised}
            img={doc.data().images[0] || 'GivingTree.png'} />);
      });
      setGrants(newGrants);
    }
  }, [snapshot, error, loading]);
  /*
  useEffect(() => {
    var useless = 0;
  }, [grants]);
  */
  
  function outputThis(data) {
    console.log(data);
  }
  function searchCallback(childData) {      
    var newGrants = [];
    console.log("childData in Dashboard: ", childData);
    childData.forEach(function outputThis(data) {
      console.log(data.grant);
    });
    newGrants = childData.forEach(function addStuff(data) {
      var junk;
    });
    /*
    childData.forEach(function (data) {
      newGrants.push(
        <SmallGrantCard
          id={data.grant[cf_id]}
          title={data.grant.title}
          cfName={data.grant.cf_name}
          nonprofitName={data.grant.nonprofit_name}
          goalAmt={data.grant.goal_amt}
          moneyRaised={data.grant.money_raised}
          img={'GivingTree.png'} />
          );
    });
    */
    console.log("newGrants: ", newGrants);
    /*
    childData.forEach(function (grant) {
      newGrants.push(
        <SmallGrantCard
          id={grant.cf_id}
          title={grant.title}
          cfName={grant.cf_name}
          nonprofitName={grant.nonprofit_name}
          goalAmt={grant.goal_amt}
          moneyRaised={grant.money_raised}
          img={'GivingTree.png'} />
          );
    });
    */
    setGrants(newGrants);
  }

  return (
    <Container maxWidth='md'>
      <Search parentCallback={searchCallback}/>
      <Grid container spacing={2} >
        {grants}
      </Grid>
    </Container>
  );
}
