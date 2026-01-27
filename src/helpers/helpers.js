export const sendMessage = async (interaction, message, msgContent, msgEmbeds, row, withResponse) => {
  const options = {};

  if (msgContent) {
    options.content = msgContent;
  }

  if (msgEmbeds) {
    options.embeds = [msgEmbeds];
  }
  
  if (row?.data) {
    options.components = [row];
  } else {
    options.components = [];
  }

  if (withResponse) {
    options.withResponse = true;
  }

  if (message) {
    return await message.channel.send(options);
  } else {
    return await interaction.reply(options);
  }
};

export const editMessage = async (interaction, message, msgContent, msgEmbeds, row, withResponse) => {
  const options = {};

  if (msgContent) {
    options.content = msgContent;
  }

  if (msgEmbeds) {
    options.embeds = [msgEmbeds];
  }

  if (row?.data) {
    options.components = [row];
  } else {
    options.components = [];
  }

  if (withResponse) {
    options.withResponse = true;
  }

  if (interaction) {
    return await interaction.editReply(options);
  } else {
    return await message.edit(options);
  }
};

export const getComponent = async (response, msgFilter, msgTime) => {
  const options = { filter: msgFilter };

  if (msgTime) {
    options.time = msgTime;
  }

  if (response.resource) {
    return await response.resource.message.awaitMessageComponent(options);
  } else {
    return await response.awaitMessageComponent(options);
  }
};
