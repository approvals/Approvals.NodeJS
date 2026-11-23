const messages: string[] = [];

export class FinalMessages {
  static addMessage(message) {
    messages.push(message);
  }

  static addKeyMessage(key, message) {
    messages[key] = message;
  }

  /** Removes all messages; intended for tests only. */
  static clear() {
    messages.length = 0;
    Object.keys(messages).forEach((key) => delete messages[key]);
  }

  static getMessages() {
    return Object.keys(messages).map((x) => messages[x]);
  }
}
