"use strict";

const Rule = require("./Rule");

class RuleSet {
	constructor(rules = []) {
		this.rules = rules;
	}

	add(rule) {
		this.rules.push(rule);
		return this;
	}

	removeRuleById(id) {
		this.rules.splice(
			this.rules.findIndex((rule) => rule.id === id),
			1
		);
		return this;
	}

	validate(...args) {
		for (let rule of this.rules) {
			console.log("Checking", rule.id);
			if (!rule.check(...args)) {
				console.log("%s failed", rule.id);
				return false;
			}
			console.log("%s passed", rule.id);
		}
		return true;
	}

	toJSON() {
		return this.rules.map((rule) => rule.toJSON());
	}
}

module.exports = RuleSet;
