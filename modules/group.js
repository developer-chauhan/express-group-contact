const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const GroupSchema = mongoose.Schema({
  groupname: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  uID: {
    type: String
  }
});

const Group = module.exports = mongoose.model('Group', GroupSchema);

module.exports.getGroupById = function (id, callback) {
  Group.findById(id, callback);
}

module.exports.getGroup = function (uID, callback) {
  Group.find(uID, callback);
}

module.exports.getGroupByGroupname = function (username, callback) {
  const query = { groupname: groupname }
  User.findOne(query, callback);
}
module.exports.addGroup = function (newGroup, callback) {
  newGroup.save(callback);
};

