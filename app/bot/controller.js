let readMessage = async (ctx, bot, scanMessage) => {
  let msg = ctx;
  var msgData = { // complete object that contains all about a msg.
      from: {
          id: msg.from.id,
          username: msg.from.username || msg.from.first_name + ' ' + msg.from.last_name
      },
      messageId: msg.message_id,
      text: msg.text,
      timestamp: msg.date,
      chatId: msg.chat.id
  }
  // add additional things to read message

}

module.exports = {
  readMessage: readMessage,
}