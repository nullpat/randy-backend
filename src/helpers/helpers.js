function sendReply(interaction, message, isMessage, content) {
  if (isMessage) {
    message.channel.send(content);
  } else {
    interaction.reply(content);
  }
}

export { sendReply };
