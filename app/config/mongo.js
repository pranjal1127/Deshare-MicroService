const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/deshare';
const db =  mongoose.createConnection(MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DoLogConnectionStatus = (color, message) => {
    console.log(color, message);
};

module.export = {db};

// handlers
db.on('connecting', () => {
  DoLogConnectionStatus('\x1b[32m', 'MongoDB :: connecting');
});

db.on('error', (error) => {
  DoLogConnectionStatus('\x1b[31m', `MongoDB:: connection ${error}`);
  mongoose.disconnect();
});

db.on('connected', async () => {
  DoLogConnectionStatus('\x1b[32m', 'MongoDB :: connected');

  const { InsetDefaultDataInDB } = await require('./inesertDefaultData');
  InsetDefaultDataInDB();
});

db.once('open', () => {
  DoLogConnectionStatus('\x1b[32m', 'MongoDB :: connection opened');
});

db.on('reconnected', () => {
  DoLogConnectionStatus('\x1b[33m', 'MongoDB :: reconnected');
});

db.on('reconnectFailed', () => {
  DoLogConnectionStatus('\x1b[31m', 'MongoDB :: reconnectFailed');
});

db.on('disconnected', () => {
  DoLogConnectionStatus('\x1b[31m', 'MongoDB :: disconnected');
});

db.on('fullsetup', () => {
  DoLogConnectionStatus('\x1b[33m"', 'MongoDB :: reconnecting... %d');
});