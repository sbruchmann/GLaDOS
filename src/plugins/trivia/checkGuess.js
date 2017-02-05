"use strict";

const FuzzySet = require("fuzzyset.js");

const goodConfidence = 0.6;

const keymax = (set, keyfunc) => {
	let maxElement = null;
	let maxScore = 0;

	for (let idx in set) {
		let element = set[idx];
		let score = keyfunc(element);

		if (score > maxScore) {
			maxElement = element;
			maxScore = score;
		}
	}

	return {
		maxElement,
		maxScore,
	};
};

const pseudoPowerSet = function(words) {
	const set = [];
	let len = 1;

	while (len <= words.length) {
		let start = 0;
		while (start <= words.length - len) {
			set.push(words.slice(start, start + len).join(" "));
			start += 1;
		}
		len += 1;
	}
	return set;
};


function checkGuess(guess, answer) {
	guess = guess.toLowerCase();
	answer = answer.toLowerCase();

	const result = keymax(pseudoPowerSet(guess.split(" ")), (element) => {
		const match = FuzzySet([answer]).get(element);
		if (match !== null) {
			return match[0][0];
		}
		return 0;
	});
	return result.maxScore >= goodConfidence;
}

module.exports = checkGuess;
