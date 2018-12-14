let {
    getPercentageChangeTicker
} = require('./controller');
const notificationHistory = require('../notification_history/controller');
let duration = require('../duration/doa');
const {getAllTarget} = require('./priceTrack')




let getTime = function () {
    return new Promise((resolve, reject) => {
        duration.findOne({}).then(doc => {
            if (!doc) return resolve(2);
            return resolve(doc.repeat);
        })
    })

}



function start(mili) {
    console.log('set timeout triggered: ', mili / 60000);
    setTimeout(function () {
        
        getPercentageChangeTicker()
        .then(notificationHistory.notifyCoinStats).then(result => {
                getTime().then(time => {
                    console.log('REPEAT CRON : ', time);
                    start(time * 60000);
                })
            }
        )

    }, mili);
}


getTime().then(time => {
    console.log('..starting firstime...')
    start(time * 60000);
})

// getPercentageChangeTicker().then(notificationHistory.notifyCoinStats);


getAllTarget().then(console.log('done oncce'))

setTimeout(function () {
        
    getAllTarget().then(console.log('done oncce'))

}, 2*60000);




module.exports = {
    
}

