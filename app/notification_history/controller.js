const notificationHistory = require('./doa');
// const notifier = require('../notification/notifier');
const config = require('./config');
const moment = require('moment');
const dateHelper = require('../utils/dateHelper');
const _ = require('lodash');
const userController = require('../user/controller');
const botTelegram = require('../bot/index');
let {
    getNotificationString
} = require('../backbone/notification_utils')
const {
    getPercentage
} = require('../setting/controller');



let sendBotNotification = coinList => {

    return new Promise((resolve, reject) => {
        getPercentage().then(currentPercentage => {
            userController.getChatId().then(chatIds => {
                if (!chatIds.length) return resolve(coinList);
                (function next(i) {
                    if (i >= chatIds.length && coinList.length >= 1) return resolve(coinList);
                    botTelegram.send(chatIds[i], getNotificationString(coinList, `---🚨 -ALERT- 🚨---\nCurrent Alert @ ${currentPercentage}%\n24hr Change %:\n\n`))
                        .then(() => next(++i))
                })(0)
            })
        })


    })
}
/**
 * Save in database
 * @param coinList
 */
let saveInDb = coinList => {
    return new Promise(resolve => {
        if (!coinList.length) return resolve(true);
        (function next(i) {
            if (i >= coinList.length) return resolve(true);
            notificationHistory.findOne({
                    symbol: coinList[i].symbol,
                    date: coinList[i].date
                })
                .then(historyObj => {
                    if (historyObj) {
                        notificationHistory.update({
                                _id: historyObj._id
                            }, {
                                lastPercentageChange: coinList[i].lastPercentageChange,
                                updatedAt: dateHelper.unixTimestamp(),
                            })
                            .then(() => next(++i));
                    } else {
                        notificationHistory.create(coinList[i])
                            .then(() => next(++i));
                    }
                })
        })(0);
    })
}


/**
 * Get percentage change category
 * @param coin
 * @returns {*}
 */
let getPercentageChangeCategory = coin => {
    let percentage = parseFloat(coin.priceChangePercent);
    coin.percentageChangeCategory = percentage;
    return coin;

}

/**
 *
 * @param coinList
 * @returns {Promise}
 */
let getAlertCoins = coinList => {
    let alertCoins = [];
    return new Promise(resolve => {
        (function next(i) {
            if (i >= coinList.length) return resolve(alertCoins);
            coinList[i] = getPercentageChangeCategory(coinList[i]);

            if (!coinList[i].hasOwnProperty('lastPercentageChange')) coinList[i].lastPercentageChange = 0;

            if (coinList[i].percentageChangeCategory != coinList[i].lastPercentageChange) {
                getPercentage().then(compareNumber => {
                    if (Math.abs(parseFloat(coinList[i].priceChangePercent) - coinList[i].lastPercentageChange) >= compareNumber) {
                        coinList[i].lastPercentageChange = coinList[i].percentageChangeCategory;
                        // delete coinList[i].priceChangePercent;
                        coinList[i].date = Number(moment().format('YYYYMMDD'));
                        coinList[i].updatedAt = dateHelper.unixTimestamp();
                        alertCoins.push(coinList[i]);
                    }
                    next(++i);
                })

            } else {

                notificationHistory.count({
                    symbol: coinList[i].symbol
                }).then(count => {
                    if (!count) {
                        let updatedCoin = coinList[i];
                        updatedCoin.lastPercentageChange = coinList[i].percentageChangeCategory;
                        updatedCoin.date = Number(moment().format('YYYYMMDD'));
                        updatedCoin.updatedAt = dateHelper.unixTimestamp();
                        notificationHistory.create(updatedCoin)
                            .then(() => next(++i));
                    }
                    next(++i);
                    // else {
                    //     notificationHistory.update({
                    //             symbol: coinList[i].symbol
                    //         }, updatedCoin)
                    //         .then(() => next(++i));
                    // }
                })

            }
        })(0);
    })
}




/**
 * Merge last notification details
 * @param coinList
 * @returns {Promise}
 */
let mergeLastNotificationDetails = coinList => {

    let coinSymbolList = coinList.map(coin => coin.symbol);
    return new Promise(resolve => {
        notificationHistory.find({
                symbol: {
                    $in: coinSymbolList
                },
                date: Number(moment().format('YYYYMMDD'))
            })
            .then(historyList => {
                (function next(i) {
                    if (i >= historyList.length) return resolve(coinList);
                    let index = _.findIndex(coinList, o => o.symbol == historyList[i].symbol);
                    coinList[index].lastPercentageChange = historyList[i].lastPercentageChange;
                    next(++i);

                })(0);
            })
    })
}

/**
 * Notify Coin Stats
 * @param coinStats
 */
let notifyCoinStats = coinStats => {
    return new Promise((resolve, reject) => {
        mergeLastNotificationDetails(coinStats)
            .then(getAlertCoins)
            .then(sendBotNotification)
            .then(saveInDb)
            .then(resolve())
    })

}

module.exports = {
    notifyCoinStats: notifyCoinStats,
    getNotificationString: getNotificationString,
}