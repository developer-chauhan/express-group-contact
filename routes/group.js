const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Group = require('../modules/group');
const User = require('../modules/user');

router.post('/group', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let newGroup = new Group({
    groupname: req.body.groupname,
    status: req.body.status,
    uID: req.user._id
  });
  if (req.body._id) {
    query = { "groupname": req.body.groupname, "uID": req.user._id };
    Group.findOne(query, (err, result) => {
      if (err) {
        res.json({ success: false, msg: "Something went wrong !" });
      }
      else {
        if ((result == null) || (result._id.equals(req.body._id))) {
          Group.update({ "_id": req.body._id }, { "groupname": req.body.groupname, "status": req.body.status }, { upsert: true }, function (err, result) {
            if (err) return res.json({ success: false, msg: 'Group not found' });
            else {
              res.json({ success: true, msg: 'Group Saved' });
            }
          })
        } else {
          res.json({ success: true, msg: 'Group exist Already' });
        }
      }
    })
  } else {
    query = { "groupname": req.body.groupname, "uID": req.user._id };
    Group.findOne(query, (err, result) => {
      if (err) {
        res.json({ success: false, msg: "Something went wrong !" });
      }
      else {
        if (result == null) {
          Group.addGroup(newGroup, (err, group) => {
            if (err) {
              res.json({ success: false, msg: err });
            } else {
              res.json({ success: true, msg: 'Group Saved' });
            }
          });

        } else {
          res.json({ success: true, msg: 'Group exist Already' });
        }
      }
    });
  }

});

router.get('/grouplist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Group.getGroup({ 'uID': req.user._id }, (err, group) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to save new Group' });
    } else {
      res.json({ success: true, data: group });
    }
  });
});

router.get('/group/:id', (req, res, next) => {
  Group.getGroupById({ '_id': req.params.id }, (err, group) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to save new Group' });
    } else {
      res.json({ group });
    }
  });
});
router.delete('/group/:id', function (req, res) {
  Group.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.json({ success: false, msg: 'Failed to delte Group' });
    } else {
      res.json({ success: true, msg: 'Successfully delte Group' });
    }
  });
});
module.exports = router;
