"use strict";

const checkRules = (rules, ...args) => {
	return rules.every((rule) => rule(...args));
};

function createMentionsTrigger(options) {
	const rules = [
		(message) => message.mentions.some((user) => options.users.includes(user)),
	];

	return function setup(context, plugin, config) {
		context.on("message", (message) => {
			if (checkRules(rules, message, options)) {
				options.execute.call(plugin, message, context, plugin, config);
			}
		});
	};
}

function createMessageTrigger(options) {
	return function setup(context, plugin, config) {
		context.on("message", (message) => {
			if (checkRules(options.rules, message, context, plugin, config)) {
				options.execute.call(plugin, message, context, plugin, config);
			}
		});
	};
}

function makeTrigger(type) {
	return function setup(options) {
		switch (type) {
			case "mention":
				return createMentionsTrigger(options);
			case "message":
				return createMessageTrigger(options);
			default:
				throw new Error(`Invalid trigger type "${type}"`);
		}
	};
}

module.exports = {
	message: makeTrigger("message"),
	mention: makeTrigger("mention"),
};
