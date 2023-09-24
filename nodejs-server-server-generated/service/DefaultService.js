'use strict';


/**
 * Add a new participant to the Gather
 *
 * body Participant 
 * gatherId String ID of the Gather to which the participant will be added
 * returns Participant
 **/
exports.addParticipantToGather = function(body,gatherId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "name",
  "id" : "id"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create a new Gather
 *
 * googleId String Google place ID
 * lat Float Latitude of the location
 * lng Float Longitude of the location
 * returns Gather
 **/
exports.createGather = function(googleId,lat,lng) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "name",
  "location" : {
    "googleId" : "googleId",
    "lng" : 6.0274563,
    "lat" : 0.8008282
  },
  "id" : "id",
  "participants" : [ {
    "name" : "name",
    "id" : "id"
  }, {
    "name" : "name",
    "id" : "id"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get Gather by Google Place
 *
 * googleId String Google place ID
 * lat Float Latitude of the location
 * lng Float Longitude of the location
 * returns Gather
 **/
exports.getGatherByGooglePlace = function(googleId,lat,lng) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "name",
  "location" : {
    "googleId" : "googleId",
    "lng" : 6.0274563,
    "lat" : 0.8008282
  },
  "id" : "id",
  "participants" : [ {
    "name" : "name",
    "id" : "id"
  }, {
    "name" : "name",
    "id" : "id"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

