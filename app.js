const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.dbAddress);

mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
},
  (success) => {
    console.log('DB is connected successfully' + success);

  });

const app = express();

const users = require('./routes/users');
const groups = require('./routes/group');
const contact = require('./routes/contact');
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/groups', groups);
app.use('/contacts', contact);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log("Hello, server started on port " + port);
});
