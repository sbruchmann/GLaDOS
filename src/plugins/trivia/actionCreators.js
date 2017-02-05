"use strict";

const ANSWER_QUESTION = "ANSWER_QUESTION";
function answerQuestion(username, points) {
	return {
		type: ANSWER_QUESTION,
		payload: {
			username,
			points,
		},
	};
}

module.exports = {
	ANSWER_QUESTION,
	answerQuestion,
};
