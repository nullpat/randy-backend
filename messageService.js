// messageService.js
import client from './src/musicbot.js';

// Function to send a message to a specific channel
export async function sendMessageToChannel(channelId, content) {
  const channel = await client.channels.fetch(channelId);
  if (!channel || !channel.isTextBased()) {
    throw new Error('Channel not found or is not a text-based channel');
  }

  await channel.send(content);
}

// Example function to handle some custom logic
export async function handleUserMessage(userId, content) {
  const user = await client.users.fetch(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await user.send(content);
}
