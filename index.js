const Eris = require("eris");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const bot = new Eris(process.env.DISCORD_BOT_TOKEN, {
  intents: ["guildMessages"],
});

async function runCompletion(message) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 200,
  });
  return completion.data.choices[0].text;
}

// bot.on("ready", () => {
//   bot.editStatus("dnd", {
//     name: "*help",
//     type: 1,
//     url: "https://discordapp.com",
//   });
// });

bot.on("ready", () => {
    bot.editStatus("online", {
      name: `on ${bot.guilds.size} servers`,
      type: 0
    });
  });

bot.on("ready", () => {
  console.log("Bot is ready!");
});

bot.on("error", (err) => {
  console.error(err);
});

bot.on("messageCreate", (msg) => {
  if (msg.content.startsWith("?")) {
    runCompletion(msg.content.substring(1)).then((result) =>
      bot.createMessage(msg.channel.id, result)
    );
  }
});

bot.on("messageCreate", async (msg) => {
  if (msg.content === "*help") {
    await bot.createMessage(msg.channel.id, {
      embed: {
        color: 0xeeeeee,
        title: "Help Command",
        description: "Here's a list of commands:",
        fields: [
          {
            name: "? [question]",
            value: "Ask a question to the bot.",
          },
          {
            name: "*help",
            value: "Shows this help message.",
          },
          {
            name: "*media",
            value: "",
          },
        ],
        footer: {
          text: "Created by rendick",
        },
      },
    });
  }
});



bot.on("messageCreate", async (msg) => {
  if (msg.content === "*media") {
    await bot.createMessage(msg.channel.id, {
      embed: {
        color: 0xeeeeee,
        title: "Social Media",
        description: "Here's a list of our social media:",
        fields: [
          {
            name: "Source code",
            value:
              "Our open source code is in [GitHub](https://github.com/naddurkostia/chatgpt-discord)",
          },
          {
            name: "Support / Questions",
            value:
              "Bot owner responds in his [Telegram](https://t.me/kostiandd) or in issues [GitHub](https://github.com/naddurkostia/chatgpt-discord/issues)",
          },
        ],
        footer: {
          text: "Created by rendick",
        },
      },
    });
  }
});

bot.on("ready", () => {
  console.log("Bot is ready!");

  bot.createMessage("1055232739017769051", `Bot started`);
});

bot.connect();
