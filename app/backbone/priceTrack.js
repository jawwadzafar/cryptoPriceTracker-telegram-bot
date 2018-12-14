let user = require('../user/controller');
let botTelegram = require('../bot/index');
const {getPrices} = require('../binance/controller');
const priceTrackController = require('../price_track/controller')

let sendToAllUsers = (text) => {
    return new Promise((resolve, reject) => {
        user.getChatId().then(chatIds => {
            if (!chatIds.length) return resolve(true);
            (function next(i) {
                if (i >= chatIds.length) return resolve(true);
                botTelegram.send(chatIds[i], text)
                    .then(result => next(++i))
            })(0)
        })
    })
}

let getAllTarget = () => {
    return new Promise((resolve,reject)=>{
        getPrices().then(prices=>{
            priceTrackController.fetch()
            .then(alertSymbols=>{
                if (!alertSymbols.length) return resolve(true);
                (function next(i) {
                    if (i >= alertSymbols.length) return resolve(true);
                    let targetPrice = parseFloat(alertSymbols[i].targetPrice);
                    let currentPrice = prices[alertSymbols[i].symbol]?parseFloat(prices[alertSymbols[i].symbol]):0
                    if(currentPrice >= targetPrice){
                        priceTrackController
                        .setPriceReached(alertSymbols[i])
                        .then(
                            sendToAllUsers(`\n🚨 Price Alert -->\nMarket: ${alertSymbols[i].symbol}\nTarget Price: ${targetPrice}\nCurrent Price: ${currentPrice}\n`)
                            .then(() => next(++i))
                        )
                        .catch(
                            err=>
                            next(++i))

                    }else{
                        next(++i)
                    }
                })(0)
            })
        })


    });

}

module.exports = {
    getAllTarget:getAllTarget,
}