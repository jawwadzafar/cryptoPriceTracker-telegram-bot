// var TelegramBot = require('telegraf');
let TelegramBot = require('node-telegram-bot-api');
// var group = require('../app/group/controller');
var message = require('./controller');
const user = require('../user/controller');
const repeat = require('../duration/controller');
const setting = require('../setting/controller')

let {
  getPercentageChangeTicker
} = require('../backbone/controller');
const {
  getAllCoinString,
  create,
  remove,
  getAllAvaialbleCoins
} = require('../coin/controller');
const {
  getNotificationString
} = require('../backbone/notification_utils');

const priceTrackController = require('../price_track/controller')

let bot = new TelegramBot(_config.telegram.TOKEN);


var obj = {

  bot: bot,
  replyOptions: {
    disable_web_page_preview: true,
    parse_mode: 'HTML',
    reply_markup: {
      remove_keyboard: true
    }
  },

  start: () => {
    _config.telegram.bootServer(bot);
    bot.on('polling_error', (error) => {
      console.log(error); // => 'EFATAL'
    });
    bot.onText(/\/(start|help)/, (msg) => {
      let data = {
        id: msg.from.id,
        username: msg.from.username,
        chatId: msg.chat.id
      }
      user.save(data).then(doc => {
        obj.isAuthorised(msg.chat.id).then(isAuthorised => {
          if (isAuthorised) {
            let messagetxt = '';
            messagetxt+=`<b>💰Welcome to Crypto Alert Bot💰\n</b><i>You can take use of me by sending these commands:</i>\n\n`;
            messagetxt+= `/targetprice - <b>[Market] [Target Price]</b>\nTarget price alert.\n`;
            messagetxt+= `/duration - <b> [Minutes]</b> set frequency for alert.\n`;
            messagetxt+= `/tolerance - <b>[Value]</b> set 24hr change alert tolerance..\n`;
            messagetxt+= `/add - <b>[Coin]</b> add coin.\n`;
            messagetxt+= `/remove - <b>[Coin]</b> remove coin.\n`;
            messagetxt+= `/percentage -24hr percentage change.\n`;
            messagetxt+= `/list - list of coins added.\n`;
            messagetxt+= `/available - list coins available on binance.\n`;
            messagetxt+= `/help - to take help\n`;
            bot.sendMessage(msg.chat.id,messagetxt,obj.replyOptions);
          }
        })
      })
    });
    bot.onText(/\/add/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          let texter = msg.text.split(' ');
          if (texter[1]) {
            create(texter[1]).then(stri => {
              bot.sendMessage(msg.chat.id, stri);
            }).catch(stri => {
              bot.sendMessage(msg.chat.id, stri);
            })
          } else {
            getAllCoinString().then(stri => {
              bot.sendMessage(msg.chat.id, '<b>You need to use /add followed by the coin symbol to add a coin' + stri +"</b>", obj.replyOptions);
            })
          }
        }
      })
    })
    bot.onText(/\/targetprice/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          let texter = msg.text.split(' ');
          if (texter[1]) {
            priceTrackController.create(texter[1], texter[2]).then(stri => {
              bot.sendMessage(msg.chat.id, stri);
            }).catch(stri => {
              bot.sendMessage(msg.chat.id, stri);
            })
          } else {
            bot.sendMessage(msg.chat.id, 'You need to use /targetprice followed by the <b>Market Symbol</b> and <b>Target Price</b>',obj.replyOptions);
          }
        }
      })
    })
    bot.onText(/\/remove/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          let texter = msg.text.split(' ');
          if (texter[1]) {
            remove(texter[1]).then(stri => {
              bot.sendMessage(msg.chat.id, stri);
            }).catch(stri => {
              bot.sendMessage(msg.chat.id, stri);
            })
          } else {
            getAllCoinString().then(stri => {
              bot.sendMessage(msg.chat.id, 'You need to use /remove followed by the coin symbol to remove a coin' + stri);
            })
          }
        }
      })
    })
    bot.onText(/\/percentage/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          getPercentageChangeTicker().then(list => {
            bot.sendMessage(msg.chat.id, getNotificationString(list, "24Hr Percentage Change:\n"),obj.replyOptions);
          })
        }
      })
    });
    bot.onText(/\/duration/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          let texter = msg.text.split(' ');
          if (texter[1]) {
            repeat.setRepeat(parseInt(texter[1]))
              .then(text => {
                bot.sendMessage(msg.chat.id, text);
              }).catch(text => {
                bot.sendMessage(msg.chat.id, text);
              })
          } else {
            bot.sendMessage(msg.chat.id, 'You need to use /duration followed by the number (in min)');
          }
        }
      })
    });
    bot.onText(/\/tolerance/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          let texter = msg.text.split(' ');
          if (texter[1]) {
            setting.setPercentage(parseInt(texter[1]))
              .then(text => {
                bot.sendMessage(msg.chat.id, text);
              }).catch(text => {
                bot.sendMessage(msg.chat.id, text);
              })
          } else {
            bot.sendMessage(msg.chat.id, 'You need to use /tolerance followed by the number (in decimal)');
          }
        }
      })
    });
    bot.onText(/\/available/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          getAllAvaialbleCoins().then(avai => {
            bot.sendMessage(msg.chat.id, avai);
          })
        }
      })
    });
    bot.onText(/\/list/, (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          getAllCoinString().then(stri => {
            bot.sendMessage(msg.chat.id, stri);
          })
        }
      })
    });
    bot.on('text', (msg) => {
      obj.isAuthorised(msg.chat.id).then(isAuthorised => {
        if (isAuthorised) {
          if(!(msg.text.indexOf('/') > -1)){
            bot.sendMessage(msg.chat.id, "I don't understand gibberish.🤓\n/help - use, if you're lost.\n\n");
          }
        }
      })
    });
  },
  isAuthorised: (chatId) => {
    return new Promise((resolve, reject) => {
      user.isAuthorised(chatId)
        .then(doc => {
          if (!doc) {
            bot.sendMessage(chatId, 'You aren\'t authorized to use this bot, Sorry! 😓')
            return resolve(false)
          } else if (doc.isAuthorised && doc.isActive) {
            return resolve(true)
          } else {
            return resolve(false);
          }
        })
    })
  },
  send: (chatid, data) => {
    return new Promise((resolve, reject) => {
      bot.sendMessage(chatid, data, obj.replyOptions)
        .catch(error => {
          if (error.response && error.response.statusCode === 403) {
            user.setInactive(chatid).then(doc => {
              console.log('usernot found')
              return resolve(true);
            })
          }
        })
      return resolve(true);
    })
  }
}



module.exports = obj;