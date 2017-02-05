"use strict";

const {ANSWER_QUESTION} = require("./actionCreators");

function score(state = {}, action) {
	switch (action.type) {
		case ANSWER_QUESTION: {
			const {points, username} = action.payload;
			return Object.assign({}, state, {
				[username]: (state[username] || 0) + points,
			});
		}
		default:
			return state;
	}
}

function getAllScores(state) {
	return state.score;
}

function getScoreByUsername(state, username) {
	return state.score[username];
}

module.exports = {
	score,

	getScoreByUsername,
	getAllScores,
};
