"use strict";

const GLaDOS = require("./src/GLaDOS");
const plugins = require("./src/plugins/");
const secrets = require("./secrets.json");

const bot = new GLaDOS();

bot.
	on("error", (err) => console.error(err.stack)).
	once("ready", () => {
		bot.
				install(plugins.ddg).
				// install(plugins.cleverbot, {
				// 	apiKey: secrets.cleverbot.apiKey,
				// }).
				install(plugins.trivia, {
					channel: "trivia",
				}).
				broadcast("Hello world!");

		bot.plugins.forEach((plugin) => plugin.emit("ready"));
	}).
	login(secrets.discord.token);

process.on("uncaughtException", (err) => {
	console.log(err.message);
	console.error(err.stack);
});
