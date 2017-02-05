"use strict";

const checkGuess = require("./checkGuess");

class Question {
	constructor(data) {
		this._asked = false;
		this._hintsUsed = false;
		this.answer = data[2];
		this.hints = data[1];
		this.question = data[0];

		Object.defineProperty(this, "points", {
			enumerable: true,
			get() {
				return this._hintsUsed ? 50 : 100;
			},
		});
	}

	checkAnswer(guess) {
		return checkGuess(guess, this.getAnswer());
	}

	getAnswer() {
		return this.hints[this.answer];
	}

	getHints() {
		this._hintsUsed = true;
		return this.hints;
	}

	getQuestion() {
		this._asked = true;
		return this.question;
	}
}

module.exports = Question;
