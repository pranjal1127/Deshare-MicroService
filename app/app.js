const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect('mongodb+srv://admin:mGVGXKIVvbly2C9e@cluster0.vz5ifqw.mongodb.net/deshare?retryWrites=true&w=majority')
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));


app.use('/api', require('./routes/index.js'));




module.exports = app;