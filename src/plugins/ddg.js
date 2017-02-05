"use strict";

const {DDG} = require("node-ddg-api");
const Discord = require("discord.js");
const Plugin = require("../Plugin");

const ddg = new DDG("GlaDOS (Discord Bot)");

const CMD_PREFIX = "/ask";
const DEFAULT_OPTIONS = {
	skip_disambig: "0",
}

function buildRichEmbed(response) {
	if (!response.AbstractText) {
		return null;
	}

	const embed = new Discord.RichEmbed();
	embed.setDescription(response.AbstractText);
	embed.setFooter(`(Source: ${response.AbstractSource})`);
	embed.setThumbnail(response.Image);
	embed.setTitle(response.Heading);
	embed.setURL(response.AbstractURL);
	return embed;
}

function fetchAnswer(query, options = {}) {
	options = Object.assign({}, DEFAULT_OPTIONS, options);
	return new Promise((resolve, reject) => {
		ddg.instantAnswer(query, options, (err, response) => {
			if (err) {
				return reject(err);
			}
			resolve(buildRichEmbed(response));
		});
	});
}

class DDGPlugin extends Plugin {
	constructor() {
		super("ddg");
	}

	configure(bot, options) {
		bot.on("message", (message) => {
			const input = message.cleanContent.trim();

			if (!input.startsWith(CMD_PREFIX)) {
				return;
			}

			const channel = message.channel;
			const query = input.substr(CMD_PREFIX.length).trim();
			const reply = (answer) => {
				if (answer) {
					bot.sendEmbed(answer, channel).catch(console.error);
				} else {
					bot.reply(message, "Sorry, I don’t know how to answer this question.");
				}
			};

			fetchAnswer(query).
					then(reply).
					catch((err) => {
						let message = "Error: `" + err.message + "`\n\n";
						message += "```" + err.stack + "```";

						bot.sendMessage(message, channel);
						console.error(err.stack);
					});
		});
	}
}

module.exports = new DDGPlugin();
