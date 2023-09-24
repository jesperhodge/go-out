'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.addParticipantToGather = function addParticipantToGather (req, res, next, body, gatherId) {
  Default.addParticipantToGather(body, gatherId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createGather = function createGather (req, res, next, googleId, lat, lng) {
  Default.createGather(googleId, lat, lng)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getGatherByGooglePlace = function getGatherByGooglePlace (req, res, next, googleId, lat, lng) {
  Default.getGatherByGooglePlace(googleId, lat, lng)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
