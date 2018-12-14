require('dotenv').config();
global._config = require('./config');
let bot = require('./app/bot/index');
require('./db');

bot.start();
// CRON
require('./app/backbone/cron')