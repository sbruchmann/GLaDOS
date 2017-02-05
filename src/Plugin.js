"use strict";

const {EventEmitter} = require("events");
const dotprop = require("dot-prop");

class Plugin extends EventEmitter {
	constructor(id) {
		super();
		this.properties = {};
		this.id = id;
	}

	configure() {}

	getProperty(name) {
		return dotprop.get(this.properties, name);
	}

	hasProperty(name) {
		return dotprop.has(this.properties, name);
	}

	removeProperty(name) {
		return dotprop.remove(this.properties, name);
	}

	setProperty(name, value) {
		return dotprop.set(this.properties, name, value);
	}

	setProperties(properties) {
		Object.keys((properties)).forEach((name) => {
			this.setProperty(name, properties[name]);
		});
		return this;
	}
}

module.exports = Plugin;
