const doa = require('./doa');
const {
    getPrices
} = require('../binance/controller');


let create = (coinSymbol, price) => {
    return new Promise((resolve, reject) => {
        if (!coinSymbol) return reject('No symbol found');
        if (!price) return reject('No target price found found');
        let parsedPrice = parseFloat(price);
        if (typeof parsedPrice !== 'number' || isNaN(parsedPrice)) return reject(`Invalid price`);
        coinSymbol = coinSymbol.toUpperCase();
        getPrices().then(priceObj => {
            let priceArray = Object.keys(priceObj);
            if (priceArray.indexOf(coinSymbol) > -1) {
                console.log('Market Symbol exists');
                doa.findOne({
                        symbol: coinSymbol,
                        targetPrice: price
                    })
                    .then(doc => {
                        if (doc) return reject(`Symbol price pair already exist : ${coinSymbol} @ ${price}`);

                        return doa.create({
                                symbol: coinSymbol,
                                targetPrice: price
                            })
                            .then(resolve(`Coin Added : ${coinSymbol}`))
                            .catch(err => reject(`Invalid Coin : ${coinSymbol}`));
                    })
                    .catch(err => console.log(err))

            } else return reject(`Invalid Market Symbol : ${coinSymbol}`);
        })

    })
}

let fetch = () => {
    return new Promise((resolve, reject) => {
        doa.find({
                isActive: true,
                isPriceReached: false
            })
            .then((list) => resolve(list))
            .catch(err => reject(err));
    })
}


let setPriceReached = (doc) => {
    return new Promise((resolve, reject) => {
        let update = {
            isActive: false,
            isPriceReached: true
        }
        doa.update({
                _id: doc._id
            }, update)
            .then(doc =>
                resolve(doc)
            )
            .catch(err => reject(err))

    })
}

module.exports = {
    create,
    fetch,
    setPriceReached


}

console.log('inside price track controler')