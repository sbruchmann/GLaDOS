"use strict";

const Cleverbot = require("cleverbot-node");
const franc = require("franc");
const Plugin = require("../Plugin");
const RuleSet = require("../utils/RuleSet");
const CommonRules = require("../utils/CommonRules");

const isEnglish = (string) => franc(string, {minLength: 3}) === "eng";
const rules = new RuleSet([
	CommonRules.NoSelfReply,
	CommonRules.BotIsMentioned,
	CommonRules.IgnoreCommands,
]);

class CleverbotPlugin extends Plugin {
	constructor() {
		super("cleverbot");
	}

	configure(bot, options) {
		const cleverbot = new Cleverbot();

		cleverbot.configure({botapi: options.apiKey});
		bot.on("message", (message) => {
			if (!rules.validate({message, bot})) {
				return;
			}

			Cleverbot.prepare(() => {
				cleverbot.write(message.cleanContent, (response) => {
					bot.reply(message, response.message);
				});
			});
		});
	}
}

module.exports = new CleverbotPlugin();
