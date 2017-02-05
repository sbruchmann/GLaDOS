"use strict";

const Plugin = require("../../Plugin");
const configureStore = require("./configureStore");
const checkGuess = require("./checkGuess");
const allQuestions = require("./questions.json");
const Question = require("./Question");
const {answerQuestion} = require("./actionCreators");
const {getAllScores, getScoreByUsername} = require("./reducers");

function getRandomQuestion() {
	const index = Math.round(Math.random() * allQuestions.length - 1);
	return new Question(allQuestions[index]);
}

let activeQuestion = getRandomQuestion();

function askQuestion(bot, channel) {
	if (activeQuestion._asked) {
		activeQuestion = getRandomQuestion();
	}

	bot.sendMessage(
		activeQuestion.getQuestion(),
		channel
	);
}

function showScore(store, bot, channel) {
	const members = channel.members;
	const score = getAllScores(store.getState());
	let highscore = [];
	let notification = "";

	members.forEach((member) => {
		const {user} = member;
		if (user.username in score) {
			highscore.push([user.username, user.id, score[user.username]]);
		}
	});

	highscore.sort((a, b) => {
		a = a[2];
		b = b[2];

		return a > b ? -1 : 1;
	});

	highscore.forEach((item, index) => {
		notification += `${index + 1}. <@${item[1]}> ${item[2]} points\n`;
	});

	bot.sendMessage(notification, channel);
}

function showHints(bot, channel) {
	const hints = "```" + activeQuestion.getHints().map((h) => (`- ${h}`)).join("\n") + "```";
	bot.sendMessage(hints, channel);
}

function play(message, bot, store) {
	const guess = message.cleanContent;

	if (guess.startsWith("/")) {
		return;
	}

	const answer = activeQuestion.getAnswer();
	const author = message.author;

	if (checkGuess(guess, answer)) {
		store.dispatch(answerQuestion(message.author.username, activeQuestion.points));
		const score = getScoreByUsername(store.getState(), author.username);
		const notification = `**${answer}** is correct. <@${author.id}> has **${score}** points.`;
		bot.sendMessage(notification, message.channel);
		askQuestion(bot, message.channel);
	}
}

class TriviaPlugin extends Plugin {
	constructor() {
		super("trivia");
		this.setProperty("store", configureStore());
	}

	configure(bot, options) {
		const rules = [
			(message) => message.author !== bot.user,
			(message) => message.channel.name === options.channel,
		];
		const store = this.getProperty("store");

		bot.on("message", (message) => {
			if (!rules.every((rule) => rule(message))) {
				return;
			}

			switch (message.cleanContent) {
				case "/hint":
				case "/hints": {
					showHints(bot, message.channel);
				}
				break;
				case "/score": {
					showScore(store, bot, message.channel);
				};
				break;
				case "/skip": {
					askQuestion(bot, message.channel);
				}
				break;
				default:
					play(message, bot, store);
			}
		});

		this.on("ready", () => {
			askQuestion(bot, bot.getChannelByName(options.channel));
		});
	}
}

module.exports = new TriviaPlugin();
