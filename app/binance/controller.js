const config = require('../../config');
const Binance = require('node-binance-api');
const BigNumber = require('bignumber.js');

let binance = new Binance();

/**
 * get the latest prices from Binnace exchange
 */
let getPrices = function () {
    return new Promise((resolve, reject) => {
        binance.prices((error, ticker) => {
            if (error) return reject(error);
            resolve(ticker);
        });
    })
}
/**
 * get all the coins with
 * return an array of objects
 */
let getCoins = function () {
    return new Promise((resolve, reject) => {
        binance.balance((error, balances) => {
            if (error) return reject(error);
            let result = Object.keys(balances).map(key => ({
                coin: key,
                balance: balances[key].available,
                onOrder: balances[key].onOrder,
                total: (BigNumber(balances[key].available).plus(balances[key].onOrder).toPrecision(9)).toString(),
            }));
            resolve(result);
        });
    })
}
/**
 * @param  {Object} coin
 * @param  {Object} prices
 * takes in coin object and price list array
 */
let getCoinPriceUSDT = function (coin, prices) {
    if (prices[`${coin.coin}USDT`]) return (BigNumber(coin.total).multipliedBy(prices[`${coin.coin}USDT`]).toPrecision(9)).toString();
    if (prices[`${coin.coin}BTC`] && prices[`${'BTC'}USDT`]) return (BigNumber(coin.total).multipliedBy(prices[`${coin.coin}BTC`]).multipliedBy(prices[`${'BTC'}USDT`]).toPrecision(9)).toString();
    if (coin.coin == "USDT") return (BigNumber(coin.total).toPrecision(9)).toString();
    return BigNumber(0).toPrecision(9);

}
let getAllBalance = function () {
    return new Promise(async (resolve, reject) => {
        try {
            // gives raw prices from binance
            let prices = await getPrices();
            // gives our custom object after hitting binance api
            let balance = await getCoins();
            // iterating over balances and putting actual price in them
            let availableBalance = balance
                .map((coin) => {
                    coin.price = getCoinPriceUSDT(coin, prices)
                    return coin;
                })
            // giving out final price
            resolve(availableBalance);

        } catch (e) {
            console.log(e);
        }

    })
}

let getAvailableBalance = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let prices = await getPrices();
            let balance = await getCoins();
            let availableBalance = balance
                .map((coin) => {
                    coin.price = getCoinPriceUSDT(coin, prices)
                    return coin;
                })
                .filter((coin) => coin.total !== '0.00000000');
            resolve(availableBalance);

        } catch (e) {
            console.log(e);
        }

    })
}




let getInvestedSymbols = () =>{
    return new Promise((resolve, reject) => {
        binance.balance((error, balances) => {
            if (error) return reject(error);
            let result = Object.keys(balances).filter(key =>BigNumber(balances[key].available).plus(balances[key].onOrder).toPrecision(9) !== "0.00000000")
            resolve(result);
        });
    })
}
let getAllSymbols = () =>{
    return new Promise((resolve, reject) => {
        binance.balance((error, balances) => {
            if (error) return reject(error);
            let result = Object.keys(balances);
            resolve(result);
        });
    })
}
let binancePreviousDay = ()=>{
    return new Promise((resolve, reject) => {
        binance.prevDay(false, (error, prevDay) => {
            keyPairObj = {};
            (function keyPair(i){
                if(i < prevDay.length){
                
                    keyPairObj[prevDay[i].symbol] = prevDay[i].priceChangePercent
                    keyPair(++i);
                }else{
                    resolve(keyPairObj);
                }

            })(0)
            
          });
    })
}





module.exports = {
    getAvailableBalance: getAvailableBalance,
    getAllBalance: getAllBalance,
    getPrices: getPrices,
    getCoins: getCoins,
    getCoinPriceUSDT: getCoinPriceUSDT,
    getInvestedSymbols:getInvestedSymbols,
    binancePreviousDay:binancePreviousDay,
    getAllSymbols:getAllSymbols,
}
