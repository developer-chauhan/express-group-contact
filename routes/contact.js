const express = require('express');
const router = express.Router();
const passport = require('passport');
const Contact = require('../modules/contact');
const Group = require('../modules/group');

router.post('/contact', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let newContact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    groupID: req.body.groupID,
    status: req.body.status,
    uID: req.user._id
  });
  if (req.body._id != null) {
    query = { "name": req.body.name, "uID": req.user._id };
    Contact.findOne(query, (err, result) => {
      if (err) {
        res.json({ success: false, msg: "Something went wrong !" });
      }
      else {
        console.log("result._id", result._id, '_id', req.body._id);

        if ((result == null) || (result._id.equals(req.body._id))) {
          Contact.findOne({ "email": req.body.email, "uID": req.user._id }, (err, result) => {
            if (err) {
              res.json({ success: false, msg: "Something went wrong !" });
            } else {
              if ((result == null) || (result._id.equals(req.body._id))) {
                Contact.update(
                  { "_id": req.body._id },
                  {
                    "name": req.body.name,
                    "email": req.body.email,
                    "phone": req.body.phone,
                    "groupID": req.body.groupID,
                    "status": req.body.status,
                    "uID": req.user._id
                  }, { upsert: true }, function (err, result) {
                    if (err) {
                      return res.json({ success: false, msg: 'Contact not saved' });
                    }
                    else {
                      res.json({ success: true, msg: 'Contact Saved Successfully' });
                    }
                  })
              } else {
                res.json({ success: true, msg: 'Contact email exist Already' });
              }
            }
          })
        } else {
          res.json({ success: true, msg: 'Contact name exist Already' });
        }
      }
    })
  } else {
    query = { "name": req.body.name, "uID": req.user._id };
    Contact.findOne(query, (err, result) => {
      if (err) {
        res.json({ success: false, msg: "Something went wrong !" });
      }
      else {
        if (result == null) {
          Contact.findOne({ "email": req.body.email, "uID": req.user._id }, (err, result) => {
            if (err) {
              res.json({ success: false, msg: "Something went wrong !" });
            } else {
              if (result == null) {
                Contact.addContact(newContact, (err, group) => {
                  if (err) {
                    res.json({ success: false, msg: 'Failed to save new Contact' });
                  } else {
                    res.json({ success: true, msg: 'Contact Saved' });
                  }
                });
              } else {
                res.json({ success: true, msg: 'Contact email exist Already' });
              }
            }
          })
        } else {
          res.json({ success: true, msg: 'Contact name exist Already' });
        }
      }
    });
  }
});
router.get('/contactlist', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Contact.getContact({ 'uID': req.user._id }, (err, contact) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to save new Group' });
    } else {
      res.json({ success: true, data: contact });
    }
  });
});

router.get('/groups', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Group.find({ 'uID': req.user._id }, (err, group) => {
    if (err) {
      res.json({ success: false, msg: 'Something went wrong' });
    } else {
      res.json({ group });
    }
  });
});

router.get('/contact/:id', (req, res, next) => {
  Group.getContactById({ '_id': req.params.id }, (err, contact) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to save new contact' });
    } else {
      res.json({ contact });
    }
  });
});
router.delete('/contact/:id', function (req, res) {
  Contact.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      res.json({ success: false, msg: 'Failed to delte Contact' });
    } else {
      res.json({ success: true, msg: 'Successfully delte Contact' });
    }
  });
});
module.exports = router;
