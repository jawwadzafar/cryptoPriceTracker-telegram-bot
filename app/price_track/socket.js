const binance = require('node-binance-api')().options({
    APIKEY: '3t3Ig8QrWUupg8EkDpwLvRhuR4uktN1zjUpJbQFEmjOX5FImK7UEjtRJTkwZToCc',
    APISECRET: 'nexD19aZLOw5DfdAwt5pWvBVnGNYGbnEz5F85QXM7aQRd8ZdHXe5nY7OHoff8RNU',
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: false // If you want to use sandbox mode where orders are simulated
  });

  
  binance.websockets.subscribe('ethbtc@trade', tradeData=>{
    // console.log(tradeData);
  }, true)

  binance.websockets.subscribe('ethbtc@trade', tradeData=>{
    console.log(tradeData);
  }, true)

