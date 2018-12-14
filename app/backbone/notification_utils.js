const user = require('../user/doa');
let bot = require('../bot/index');

let replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace);
}
let getNotificationString = (coinList, text) => {

    let coins = coinList.map(e => {
        let per_trail = (parseFloat(e.priceChangePercent)>=0)?`⬆️`:`🔻`
        return `${e.symbol} :${per_trail} ${e.priceChangePercent}%`  
    });
    coins = coins.toString();
    let repl = replaceAll(coins, ',', '\n');
    let newstring = `\n<b>${text}</b>\n${repl}\n`
    return newstring;
}




module.exports={
    getNotificationString
}