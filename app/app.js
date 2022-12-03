const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const {MONGO_DB_URL} = require('./config/constant');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(MONGO_DB_URL)
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));


app.use('/api', require('./routes/index.js'));




module.exports = app;