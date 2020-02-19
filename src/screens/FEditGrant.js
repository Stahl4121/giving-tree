import React, { useEffect } from 'react';

import EditGrant from '../components/EditGrant.js';
import firebase from '../firebase'

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  card: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default function FEditGrant() {
  const classes = useStyles();

  let db = firebase.firestore();

  // Grant data to upload to firebase
  const [grantData, setGrantData] = React.useState(
    {
      cf_name: '', // TODO
      cf_id: '', // TODO
      title: '',
      nonprofit_name: '', // TODO
      nonprofit_id: '', // TODO
      address: '',
      lat: '',
      long: '',
      date_posted: '',
      date_deadline: '',
      money_raised: 0,
      goal_amt: '',
      desc: '',
      tags: [],
      status: '',
      images: [],
    });

  const [newTags, setNewTags] = React.useState([]);

  // Find out whether we are editing an existing grant or creating a new one
  const [grantStatus] = React.useState(window.location.pathname === '/foundation/create-grant' ? 'create' : 'edit');

  // If we are editing the grant rather than creating one, get its ID from URL params
  const [id, setId] = React.useState(null);
  useEffect(() => {
    if (grantStatus === 'edit') {
      setId(window.location.pathname.split('/')[3]);
    }
  }, [grantStatus]);

  const callback = (data, type) => {
    let newData = grantData;

    switch (type) {
      case 'newTags':
        setNewTags(data);
        break;
      case 'date_deadline':
        newData.date_deadline = {seconds: data, nanoseconds: 0};
        break;
      case 'images':
        newData.images.push(data);
        break;
      default:
        if (newData.hasOwnProperty(type)){
          newData[type] = data;
        }
    }
    setGrantData(newData);
    console.log(grantData);
  }

  // Save the new tags to database
  const addNewTags = () => {
    db.runTransaction(function (transaction) {
      let docRef = db.collection('tags').doc('vXVDxq4ByQoKazDanGI1');
      return transaction.get(docRef).then(function (doc) {
        if (!doc.exists) {
          docRef.set({tags: newTags})
            .then(function () {
              console.log('New tags uploaded');
            })
            .catch(function (error) {
              console.error('Error adding new tags: ', error);
            })
        }
        let totalTags = doc.data().tags.concat(newTags);
        transaction.update(docRef, { tags: totalTags });
      });
    }).then(function (newTags) {
      console.log("Tags updated to ", newTags);
    }).catch(function (err) {
      console.error(err);
    });
  }

  const saveToDrafts = () => {
    addNewTags();

    // Update the grant status
    let newGrantData = grantData;
    newGrantData.status = 'draft';
    // TODO: set CF name/id
    setGrantData(newGrantData);

    // Add the grant to the database
    db.collection('grants').doc().set(grantData)
      .then(function () {
        console.log('Draft saved');
      })
      .catch(function (error) {
        console.error('Error writing draft: ', error);
      })
  }

  const publish = () => {
    addNewTags();

    let newGrantData = grantData;
    newGrantData.status = 'current';
    newGrantData.cf_name = 'fake cf';
    newGrantData.cf_id = '1fbyawFlFR0YdMYPZbtG';
    newGrantData.nonprofit_id = 'Wafb5Zjt2z9k23FLVcOd';
    let time = Math.round(new Date().getTime() / 1000);
    newGrantData.date_posted = {seconds: time, nanoseconds: 0};
    // TODO: set CF name/id
    setGrantData(newGrantData);
    db.collection('grants').doc().set(grantData)
      .then(function () {
        console.log('Grant published');
      })
      .catch(function (error) {
        console.error('Error writing draft: ', error);
      })
  }

  return (
    <div className={classes.card}>
      <Grid container direction='row' justify='center' alignItems='flex-end'>
        <Grid item>
          <EditGrant grantData={grantData} callback={callback} />
        </Grid>
        <Grid item>
          {grantStatus === 'edit' &&
            <Grid container
              spacing={2}
              direction="column"
              justify="flex-end"
              alignItems="flex-start">
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'>
                  Save
                </Button>
              </Grid>
            </Grid>
          }
          {grantStatus === 'create' &&
            <Grid container
              spacing={2}
              direction="column"
              justify="flex-end"
              alignItems="flex-start">
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'>
                  Discard
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={saveToDrafts}
                  color='primary'
                  variant='contained'>
                  Save to Drafts
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={publish}>
                  Publish
                </Button>
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>
    </div>
  );
}