var mongoose = require('mongoose');
const config = require('./config');
mongoose.Promise = Promise;

//mongo
mongoose.connect(config.mongourl, {
  useNewUrlParser: true,
  auto_reconnect: true,
  keepAlive: 500,
  connectTimeoutMS: 90000,
  socketTimeoutMS: 90000,
  connectWithNoPrimary: true
}, function (err) {
  if (err) {
      console.log('❌ Mongodb Connection Error');
      console.log(err);
  } else {
      console.log('✅ Database Connected');
  }

});