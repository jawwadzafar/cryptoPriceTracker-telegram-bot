const {binancePreviousDay,getAllSymbols} = require('../binance/controller');
const coin = require('../coin/doa');

let getCoins = function () {
    return new Promise((resolve, reject) => {
        coin.find({}).then(list => {resolve(list.map(e => e.coinName))});
    })
}

let getAllBinanceSymbols = async function () {
    return new Promise(async (resolve, reject) => {
        let symbols = await getCoins();
        return resolve(symbols);
    })
}
let getSymbolPriceChangePerc = function (symbol, previousDay) {
    if (previousDay[`${symbol}USDT`]) return previousDay[`${symbol}USDT`];
    if (previousDay[`${symbol}BTC`]) return previousDay[`${symbol}BTC`];
    if (symbol == "USDT") return 0;
}

let getPercentageChangeTicker = async function () {
    return new Promise(async (resolve, reject) => {
        let symbols = await getAllBinanceSymbols();
        let previousDay = await binancePreviousDay();
        let mapSymbolsToMarket = symbols.map(e => {
            return {
                symbol: e,
                priceChangePercent: getSymbolPriceChangePerc(e, previousDay)
            }

        })
        return resolve(mapSymbolsToMarket);


    })
}




module.exports = {
    getPercentageChangeTicker: getPercentageChangeTicker,
}



// getAllSymbols().then(console.log)