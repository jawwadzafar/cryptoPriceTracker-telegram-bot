const coin = require('./doa');
const {getAllSymbols} = require('../binance/controller');


let create = (coinName)=> {
    return new Promise((resolve,reject)=>{
        if(!coinName) return reject('No coin found');
        coinName = coinName.toUpperCase();
        coin.count({coinName})
        .then(count=> {
            if (count) return reject(`Coin Already exist : ${coinName}`);
            else {
                return getAllSymbols().then(coinlist=>{
                    if(coinlist.indexOf(coinName) > -1){
                        console.log('coin exists')
                        return coin.create({coinName})
                        .then(resolve(`Coin Added : ${coinName}`))
                        .catch(err=>reject(err));
                    }
                    else return reject(`Invalid Coin : ${coinName}`);

                })


            }
        })

    })

}

let fetch = ()=> {
    return new Promise((resolve,reject)=>{
        coin.find({}).then((list)=>resolve(list)).catch(err=>reject(err));
    })
}
let remove = (coinName)=> {
    return new Promise((resolve,reject)=>{
        if(!coinName) return reject('coinName not found');
        coinName = coinName.toUpperCase();
        coin.find({}).then(doc=>{
            let coinlist = doc.map(e=>e.coinName);
            if(coinlist.indexOf(coinName) > -1){
                return coin.remove({coinName})
                .then(resolve(`Coin Removed : ${coinName}`))
                .catch(err=>reject(err));
            }
            else return reject(`Invalid Coin : ${coinName}`);

        })

    })

}
let  replaceAll =(str, find, replace)=> {
    return str.replace(new RegExp(find, 'g'), replace);
}

let getAllCoinString = ()=>{
    return new Promise ((resolve,reject)=>{
        fetch().then(list=>{
            let coins = list.map(e=>`${e.coinName}`);
            coins = coins.toString();
            let repl = replaceAll(coins, ',', '\n');
            let newstring = "\n--------------\nCoin Roaster:\n"+repl
            resolve(newstring);
        })
    })
}

let getAllAvaialbleCoins = ()=>{
    return new Promise ((resolve,reject)=>{
        getAllSymbols().then(coins=>{
            console.log();
            coins = coins.toString();
            let repl = replaceAll(coins, ',', '\n');
            let newstring = "\n--------------\nAvailable Coins to add:\n"+repl
            resolve(newstring);

    })
})
}

module.exports = {
    create: create,
    fetch:fetch,
    remove:remove,
    getAllCoinString:getAllCoinString,
    getAllAvaialbleCoins:getAllAvaialbleCoins,
}

// create('btc').then(console.log).catch(console.log)
// fetch('btc').then(console.log).catch(console.log)