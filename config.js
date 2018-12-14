const path = require('path');
const rootPath = path.normalize(__dirname);

let config = {
        root: rootPath,
        port: process.env.PORT || 5800,
        mongourl: 'mongodb://localhost:27017/cryptopricetracker',
        telegram: {
            TOKEN: process.env.TOKEN || 'ENTER BOT KEY FROM BOTFATHER TELEGRAM',
            master: 'ENTER BOT NAME HERE',
            spamCount: 50,
            bootServer: (bot) => {
                bot.startPolling();
                console.log(` 🔌  ${_config.telegram.master.toUpperCase()} BOT Connected to Polling...`)
            }
        },
}

module.exports = config;