
const messages = [];

class FinalMessages {

  static addMessage(message) {
    messages.push(message);
  }

  static addKeyMessage(key, message) {
    messages[key] = message;
  }

  static getMessages() {
    //return messages;
    return Object.keys(messages).map(x => messages[x]);
  }

}

module.exports = FinalMessages;
