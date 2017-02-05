"use strict";

const {join} = require("path");
const {readJSONSync, writeJSONSync} = require("fs-promise");
const {createStore, combineReducers} = require("redux");
const {score} = require("./reducers");

const STORE_FILE_PATH = join(__dirname, "state.json");

const rootReducer = combineReducers({
	score,
});

function loadState() {
	let state;

	try {
		state = readJSONSync(STORE_FILE_PATH);
	} catch (err) {
		state = {};
	}

	return state;
}

function writeState(state) {
	writeJSONSync(STORE_FILE_PATH, state);
}

function configureStore() {
	const store = createStore(rootReducer, loadState());

	store.subscribe(() => writeState(store.getState()));

	return store;
}

module.exports = configureStore;
