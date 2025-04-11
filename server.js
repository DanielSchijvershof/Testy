require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = process.env.BOT_TOKEN;

app.use(express.static('.'));

app.get('/webhooks/:guildId', async (req, res) => {
  const guildId = req.params.guildId;

  // Get webhooks
  const webhookRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/webhooks`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` }
  });
  const webhooks = await webhookRes.json();

  // Get channels
  const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` }
  });
  const channels = await channelsRes.json();

  const channelMap = {};
  channels.forEach(c => channelMap[c.id] = c.name);

  const formatted = webhooks.map(w => ({
    name: w.name,
    channelName: channelMap[w.channel_id] || 'Unknown'
  }));

  res.json({ webhooks: formatted, guildName: webhooks[0]?.guild_id || guildId });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});