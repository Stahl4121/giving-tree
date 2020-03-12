import React, { useEffect } from 'react';
import AuthUserContext from '../auth/context.js';

import firebase from '../firebase.js';
import * as helper from '../helpers/ValidationHelper.js';

import EditableData from '../components/FSettingsListEditable.js'
import NonEditableData from '../components/FSettingList.js'
import { Typography } from '@material-ui/core';


export default function FSettings() {
 
  // Set tab title
  useEffect(() => { document.title = 'Settings- Giving Tree'; }, []);
  var db = firebase.firestore();

  const [isEdit, setEdit] = React.useState(false);
  const user = React.useContext(AuthUserContext);

  // Foundation info
  const [cfInfo, setCfInfo] = React.useState({
    name: '',
    public_email: '',
    public_phone: '',
    foundation_url: '',
    fname_contact: '',
    lname_contact: '',
    personal_email: '',
    personal_phone: '',
    status: '',
    date_requested: '',
    date_approved: '',
    date_denied: '',
    date_deactivated: '',
  });

  const [getData, setGetData] = React.useState(true);
  const [hasUser, setHasUser] = React.useState(true);

  const functionLoadData = () =>{
    // Foundation query
    db.collection('communityFoundations').where('personal_email','==', user.email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          
          setCfInfo(doc.data());
          setGetData(false);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  function toggleAccountActive(){
    db.collection('communityFoundations').where('personal_email','==',user.email)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {

        const time = (cfInfo.date_deactivated === '') ? firebase.firestore.Timestamp.now() : '';
        db.collection("communityFoundations").doc(doc.id).update({date_deactivated: time});

        console.log("Deactivation successfully toggled!");
        setGetData(true);
      });
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }

  function onSubmit(changedText){
    var temp = {...cfInfo};
    for(const key in changedText){
      temp = { ...temp, [key]: changedText[key] };
    }

    if(hasUser){
      db.collection('communityFoundations').where('personal_email','==',user.email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
          // Build doc ref from doc.id
          db.collection("communityFoundations").doc(doc.id).update({
            name: temp.name,
            public_email: temp.public_email,
            public_phone: temp.public_phone,
            foundation_url: temp.foundation_url,
            fname_contact: temp.fname_contact,
            lname_contact: temp.lname_contact,
            personal_email: temp.personal_email,
            personal_phone: temp.personal_phone
          });
          console.log("Document successfully written!");
          setGetData(true);
          setEdit(false);
        });
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
    }else { 
      setGetData(true);
      setEdit(false); 
    }
    
  }

  function toggleEdit()
  {
    if(isEdit){
      setEdit(false);
    }else{
      setEdit(true);
    }
  }

  React.useEffect(() => {
    if(getData){
      if((user !== null)){
        functionLoadData();
      }else{
        setHasUser(false);
      } 
    }
  }, [getData, user]);

  return (
    <Data 
      isEdit={isEdit}
      cfInfo={cfInfo}
      toggleEdit={toggleEdit}
      onSubmit={onSubmit}
      functionLoadData={functionLoadData}
      toggleAccountActive={toggleAccountActive}
    />
  );
} 

const Data = (props) => {
  if(props.isEdit){
    return(
      <EditableData
        {...props}
        key={"key"}
      />
    );
  }else{
    return(
      <NonEditableData
        cfInfo={props.cfInfo}
        toggleEdit={props.toggleEdit}
        onSubmit={props.onSubmit}
        toggleAccountActive={props.toggleAccountActive}
      />
    );
  }
}