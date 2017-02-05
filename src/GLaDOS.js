"use strict";

const {EventEmitter} = require("events");
const Discord = require("discord.js");

const CLIENT_EVENTS = [
	"message",
];

function mirrorEvent(origin, target, event) {
	origin.on(event, (...args) => target.emit(event, ...args));
}

class GlaDOS extends EventEmitter {
	constructor() {
		super();

		this.client = new Discord.Client();
		this.plugins = [];
		this.user = null;

		this.client.once("ready", () => {
			this.user = this.client.user;
			this.emit("ready");
		});
	}

	broadcast(message) {
		let promises = [];
		this.client.channels.forEach((channel) => {
			if (channel.type === "text") {
				promises.push(this.sendMessage(message, channel));
			}
		});
		return Promise.all(promises);
	}

	getChannelByName(name) {
		return this.client.channels.find("name", name);
	}

	login(token) {
		CLIENT_EVENTS.forEach((event) => mirrorEvent(this.client, this, event));
		this.client.login(token);
		return this;
	}

	install(plugin, options) {
		try {
			plugin.configure(this, options);
			this.plugins.push(plugin);
		} catch (err) {
			this.emit("error", err);
		}

		return this;
	}

	reply(message, response) {
		return new Promise((resolve, reject) => {
			message.channel.startTyping();
			message.reply(response).
					then(() => {
						message.channel.stopTyping();
						resolve();
					}).
					catch(reject);
		});
	}

	sendEmbed(embed, channel) {
		return new Promise((resolve, reject) => {
			channel.startTyping();
			channel.sendEmbed(embed).
				then(() => {
					channel.stopTyping();
					resolve();
				}).
				catch(reject);
		});
	}

	sendMessage(message, channel) {
		return new Promise((resolve, reject) => {
			channel.startTyping();
			channel.sendMessage(message).
					then(() => {
						channel.stopTyping();
						resolve(null);
					}).
					catch(reject);
		});
	}
}

module.exports = GlaDOS;
