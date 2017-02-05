"use strict";

class Rule {
	constructor(id, rule, meta) {
		this.id = id;
		this.rule = rule;
		this.meta = meta;
	}

	check(...args) {
		return this.rule(...args);
	}

	toJSON() {
		return {
			id: this.id,
			meta: this.meta,
		};
	}
}

module.exports = Rule;
