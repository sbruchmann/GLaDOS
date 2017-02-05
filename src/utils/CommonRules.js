"use strict";

const Rule = require("./Rule");

module.exports = {
	BotIsMentioned: new Rule(
		"bot-is-mentioned",
		({message, bot}) => message.isMentioned(bot.user))
	),
	IgnoreCommands: new Rule(
		"ignore-commands",
		({message}) => !message.cleanContent.startsWith("/")
	),
	NoSelfReply: new Rule(
		"no-self-reply",
		({message, bot}) => message.author !== bot.user
	),
};
