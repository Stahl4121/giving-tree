import React from "react";
//import { makeStyles } from "@material-ui/styles";

/*
const useStyles = makeStyles(theme => ({
  card: {
    height: "100%"
  }
}));
*/
//from Geo Data Source
function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

// props includes
// 1. a location (loc)
// 2. an array of the grant locations (grantLocs)
export default function getDistance(props) {
  // lat and then long
  var grantLocs = [
    [36.8909, -76.30892, "Home", "1421 Bolling Ave, Norfolk, VA 23508"],
    [38.89308, -76.97667, "Rhys", "1911 C Street NE Washington DC 20002"],
    [
      41.16895,
      -80.1132,
      "Taco Bell",
      "1560 W. Main Street, Grove City, PA 16127"
    ]
  ];
  //var myHouse = [36.8909, -76.30892];
  var dists = [];
  var loc = [41.15559, -80.08209];
  for (const grantLoc in grantLocs) {
    console.log(distance(loc[0], loc[1], grantLoc[0], grantLoc[1], "M"));
    dists.push(
      distance(loc[0], loc[1], grantLoc[0], grantLoc[1], "M"),
      grantLoc
    );
  }
  dists.sort((a, b) => (a[0] > b[0] ? 1 : -1));
  return (<div>{dists}</div>);
  /*
  var dist = distance(loc[0], loc[1], myHouse[0], myHouse[1], "M");
  return (
    <div>
      <div>{dist}</div>
    </div>
  );
  */
}

/*
get the central location
store it

get the
*/
