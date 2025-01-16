function sendReply(interaction, message, content, row) {
  const options = { content: content };
  
  if (row) {
    options.components = [row];
  }
  
  if (message) {
    message.channel.send(options);
  } else {
    interaction.reply(options);
  }
}

export { sendReply };
