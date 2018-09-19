const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const ContactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  uID: {
    type: String
  },
  groupID: {
    //type: String
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
});

const Contact = module.exports = mongoose.model('Contact', ContactSchema);

module.exports.getContactById = function (id, callback) {
  Contact.findById(id, callback);
}

module.exports.getContact = function (uID, callback) {
  Contact.find(uID).populate('groupID', 'groupname').exec((err, result) => {
    if (err) return callback(err);
    else {
      return callback(null, result);
    }
  });
}

module.exports.getContactByContactName = function (name, callback) {
  const query = { groupname: groupname }
  User.findOne(query, callback);
}
module.exports.addContact = function (newContact, callback) {
  newContact.save(callback);
};



