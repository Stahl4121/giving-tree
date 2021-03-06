import React, { useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthUserContext from '../auth/context.js';
import LargeGrantCard from '../components/LargeGrantCard.js';
import InfoIcon from '../components/InfoIcon.js'
import Text from '../components/Text.js';
import firebase from '../firebase.js';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Card from '@material-ui/core/Card';


const styles = theme => ({
  card: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  button: {
    paddingLeft: "4em",
    paddingRight: "4em",
    marginRight: "1em",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
  },
  link: {
    textDecoration: 'none',
  }
});

function Grant(props) {
  //////////////////////
  // Database Queries //
  //////////////////////

  // Initialize database
  const db = firebase.firestore();

  // Initialize storage
  const storage = firebase.storage();
  const storageRef = storage.ref();

  // Get grant ID from URL params
  const id = useParams().grantId;

  // Data to load
  const [grantData, setGrantData] = React.useState();
  const [cfData, setCfData] = React.useState();
  const [nonprofitData, setNonprofitData] = React.useState();
  const [img, setImg] = React.useState();

  // Query from grant collection
  useEffect(() => {
    if (id) {
      db.collection('grants').doc(id).get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document for grant ' + id);
          } else {
            setGrantData(doc.data());
          }
        })
        .catch(err => {
          console.log('Error getting grant', err);
        });
    }
  }, []);

  // Query from CF collection
  useEffect(() => {
    if (grantData?.cf_id) {
      db.collection('communityFoundations').doc(grantData.cf_id).get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document for CF ' + grantData.cf_id);
          } else {
            setCfData(doc.data());
          }
        })
        .catch(err => {
          console.log('Error getting CF', err);
        });
    }
  }, [grantData]);

  // Query from nonprofit collection
  useEffect(() => {
    if (grantData?.nonprofit_id && grantData.nonprofit_id !== '') {
      db.collection('nonprofits').doc(grantData.nonprofit_id).get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document for nonprofit ' + grantData.nonprofit_id);
          } else {
            setNonprofitData(doc.data());
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }
  }, [grantData]);

  // Query image urls
  useEffect(() => {
    if (grantData) {
      getUrls(grantData.images);
    }
  }, [grantData]);

  ////////////////////
  // Click Handlers //
  ////////////////////

  // Tell whether modal is open
  const [deleteModal, setDeleteModal] = React.useState(false);

  // Tell if we are ready to load a LargeGrantCard
  const [dataLoaded, setDataLoaded] = React.useState(false);
  useEffect(() => {
    setDataLoaded(grantData && cfData && nonprofitData && img);
  }, [grantData, cfData, nonprofitData, img])

  // Format dates from Firebase Timestamps
  const formatDate = (time) => {
    let dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(time * 1000).toLocaleDateString("en-US", dateOptions);
  }

  // Open the delete grant modal
  const toggleModal = () => {
    deleteModal ? setDeleteModal(false) : setDeleteModal(true);
  }

  // Delete a grant if the foundation clicks the button
  const deleteGrant = () => {
    db.collection('grants').doc(id).update({
      status: 'deleted'
    }).then(function () {
      toggleModal();
      props.history.push('/foundation')
    });
  }

  // Make a grant a draft if the foundation clicks the button
  const draftifyGrant = () => {
    db.collection('grants').doc(id).update({
      status: 'draft'
    }).then(function () {
      props.history.push('/foundation')
    });
  }

  // Publish a grant
  const publishGrant = () => {
    db.collection('grants').doc(id).update({
      status: 'current'
    }).then(function () {
      props.history.push('/foundation')
    });
  }

  // Copy a grant to drafts
  const createDraft = () => {
    let newData = grantData;
    newData.status = 'draft';
    newData.money_raised = 0;
    db.collection('grants').add(newData).then(ref => {
      console.log('Added document with ID: ' + ref.id + ' to drafts');
    });
  }

  // Load image URLs from image names
  const getUrls = async (imgNames) => {
    await Promise.all(imgNames.map(imgName =>
      new Promise((resolve, reject) => {
        storageRef.child(imgName).getDownloadURL().then((url) => {
          resolve(url);
        }).catch(() => {
          reject(null);
        })
      }).then((url) => {
        return url;
      })
    )).then((arr) => {
      setImg(arr);
    });
  }

  //////////////////////
  // The Visible Part //
  //////////////////////

  // Styles variable
  const { classes } = props;

  // Find out if we are a foundation or a donor
  const [user] = React.useState(window.location.pathname.split('/')[1] === 'grants' ? 'donor' : 'foundation');
  const authUser = useContext(AuthUserContext);

  return (
    <div className={classes.card}>
      {dataLoaded &&
        <div>
          {grantData.status !== 'deleted' &&
            <div>
              <Grid container direction='row' justify='center' alignItems='flex-end'>
                <Grid item>
                  <LargeGrantCard
                    user={user}
                    id={id}
                    title={grantData.title}
                    desc={grantData.desc}
                    status={grantData.status}
                    goalAmt={grantData.goal_amt}
                    moneyRaised={grantData.money_raised}
                    tags={grantData.tags}
                    datePosted={formatDate(grantData.date_posted.seconds)}
                    dateDeadline={formatDate(grantData.date_deadline.seconds)}
                    address={grantData.address}
                    img={img}
                    cfData={cfData}
                    nonprofitData={nonprofitData}
                  />
                </Grid>

                {user === 'foundation' && authUser?.status === 'current' &&
                  <Grid item>
                    {grantData.status === 'current' &&
                      <Grid container
                        spacing={2}
                        direction="column"
                        justify="flex-end"
                        alignItems="flex-start">
                        <Grid container direction='row' justify='flex-start' alignContent='flex-center'>
                        <Grid item>
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={toggleModal}>
                            Delete
                          </Button>
                        </Grid>
                          <Grid item>
                            <InfoIcon infoMessage="Delete grant (this action cannot be undone)." />
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link
                            className={classes.link}
                            to={'/foundation/edit/' + id}>
                            <Button
                              color='primary'
                              variant='contained'>
                              Edit
                            </Button>
                          </Link>
                        </Grid>
                        <Grid container direction='row' justify='flex-start' alignContent='flex-center'>
                        <Grid item>
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={draftifyGrant}>
                            Unpublish and save to drafts
                          </Button>
                        </Grid>
                          <Grid item>
                            <InfoIcon infoMessage="Donors will not see your grant and or be able to donate to it. The grant will be saved as a draft." />
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                    {grantData.status === 'draft' &&
                      <Grid container
                        spacing={2}
                        direction="column"
                        justify="flex-end"
                        alignItems="flex-start">
                        <Grid container direction='row' justify='flex-start' alignContent='flex-center'>
                          <Grid item>
                            <Button
                              color='primary'
                              variant='contained'
                              onClick={toggleModal}>
                              Delete
                          </Button>
                          </Grid>
                          <Grid item>
                            <InfoIcon infoMessage="Delete grant (this action cannot be undone)." />
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Link
                            className={classes.link}
                            to={'/foundation/edit/' + id}>
                            <Button
                              color='primary'
                              variant='contained'>
                              Edit
                            </Button>
                          </Link>
                        </Grid>
                        <Grid container direction='row' justify='flex-start' alignContent='flex-center'>
                        <Grid item>
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={publishGrant}>
                            Publish
                          </Button>
                        </Grid>
                          <Grid item>
                            <InfoIcon infoMessage="Donors will be able to see your grant and donate to it." />
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                    {grantData.status === 'expired' &&
                      <Grid container
                        spacing={2}
                        direction="column"
                        justify="flex-end"
                        alignItems="flex-start">
                        <Grid container direction='row' justify='flex-start' alignContent='flex-center'>
                        <Grid item>
                          <Button
                            onClick={createDraft}
                            color='primary'
                            variant='contained'>
                            Copy to Drafts
                          </Button>
                        </Grid>
                          <Grid item>
                            <InfoIcon infoMessage="Save a duplicate of this grant to your drafted grants." />
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                }
              </Grid>

              {deleteModal &&
                <Modal
                  open={true}
                  className={classes.modal}
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500
                  }}>
                  <Fade in={true}>
                    <Card>
                      <CardContent>
                        <Text type='card-heading' text='WARNING' />
                        <Text type='tag' text={'Are you sure you want to delete ' + grantData.title + '? This cannot be undone!'} />
                        <Button
                          variant='contained'
                          color='error'
                          type='submit'
                          onClick={deleteGrant}
                          className={classes.button}
                        >YES</Button>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={toggleModal}
                          className={classes.button}
                        >NO</Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Modal>
              }
            </div>
          }
          {
            grantData.status === 'deleted' && <Text type='tag' text={'We\'re sorry, that grant doesn\'t exist anymore.'} />
          }
        </div>
      }
    </div>
  );
}

export default withStyles(styles)(Grant);