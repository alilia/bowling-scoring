const express = require('express');
const bodyParser = require('body-parser');
const Game = require('./src/game');
const Player = require('./src/player');

const app = express();

app.use(bodyParser.json());

app.get('/', (_, res) => res.send('Hi there! Did you check the README.md?'));

/**
 * Initialises a game with N players.
 * @param {number} players - Number of players
 */
app.post('/init', (req, res, next) => {
	const requestedPlayers = req.body.players;
	if (!requestedPlayers) {
		next(new Error('invalid number of players'));
		return;
	}

	let message = 'success';
	let gameID = app.locals.games.length;

	app.locals.games.push(new Game);

	for (let i = 0; i < requestedPlayers; i++) {
		try {
			app.locals.games[gameID].addPlayer(new Player);
		} catch {
			message = 'not all users were initiated';
		}
	}

	const resJSON = {
		'message' : message,
		'gameID' : gameID,
		'players' : app.locals.games[gameID].players.length
	};

	res
		.status(200)
		.json(resJSON)
		.end();
});

/**
 * Retrieves how many games were initiated (should be indexed from 0)
 */
app.get('/availableGames', (req, res, next) => {
	const resJSON = {
		'message' : 'success',
		'availableGames' : app.locals.games.length
	};

	res
		.status(200)
		.json(resJSON)
		.end();
});

/**
 * Performs a roll in a specific game for a specific user
 * @param {number} gameID - ID of game
 * @param {number} playerID - ID of player
 * @param {number} newKnocks - how many new pins got knocked off
 */
app.post('/roll', (req, res, next) => {
	const game = app.locals.games[req.body.gameID];
	if (!game) {
		next(new Error('there is no such game'));
		return;
	}

	const player = game.players[req.body.playerID];
	if (!player) {
		next(new Error('there is no such player'));
		return;
	}

	try {
		player.roll(req.body.newKnocks);
	} catch {
		next(new Error('invalid number of knocked pins'));
		return;
	}

	const resJSON = {
		'message' : 'success'
	};
	
	res
		.status(200)
		.json(resJSON)
		.end();
});

/**
 * Retrieves rolling score in a specified game for a specified player
 */
app.get('/rollingScore/:gameID/:playerID', (req, res, next) => {
	const game = app.locals.games[req.params.gameID];
	if (!game) {
		next(new Error('there is no such game'));
		return;
	}

	const player = game.players[req.params.playerID];
	if (!player) {
		next(new Error('there is no such player'));
		return;
	}
	
	const resJSON = {
		'message' : 'success',
		'rollingScore' : player.rollingScore
	};

	res
		.status(200)
		.json(resJSON)
		.end();
});

/**
 * Retrieves a specified frame in a specified game for a specified player
 */
app.get('/frame/:gameID/:playerID/:frameID', (req, res, next) => {
	const game = app.locals.games[req.params.gameID];
	if (!game) {
		next(new Error('there is no such game'));
		return;
	}

	const player = game.players[req.params.playerID];
	if (!player) {
		next(new Error('there is no such player'));
		return;
	}

	const frame = player.frames[req.params.frameID];
	if (!frame) {
		next(new Error('there is no such frame'));
		return;
	}
	
	const resJSON = {
		'message' : 'success',
		'frame' : frame
	};

	res
		.status(200)
		.json(resJSON)
		.end();
});

/**
 * Calculates score for a given array of (historic) rolls.
 * @param rolls - An array of ints
 */
app.get('/calculateScore', (req, res, next) => {
	const player = new Player;

	req.body.rolls.forEach(item => {
		try {
			player.roll(item);
		} catch {
			next(new Error('invalid number of knocked pins (' + item + ')'));
			return;
		}
	});

	const resJSON = {
		'message' : 'success',
		'score' : player.rollingScore
	};

	res
		.status(200)
		.json(resJSON)
		.end();
});

app.use((error, req, res, next) => {
	if (!error.statusCode) {
		error.statusCode = 400;
	}

	res.status(error.statusCode).json({'message' : error.message}).end();
});

const port = process.env.PORT || 3000;
let server = app.listen(port, function () {
	console.log('API is listening on port %s', port);
	app.locals.games = [];
});

function stop(done) {
	server.close(done)
}

module.exports = app;
module.exports.stop = stop;
