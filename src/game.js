class Game {
	constructor() {
		this._players = [];
	}

	/**
	 * Adds players to the game
	 * @param {Player} player 
	 */
	addPlayer(player) {
		if (this._players.length < 2) {
			this._players.push(player);
		} else {
			throw new RangeError('max player count exceeded');
		}
	}

	/**
	 * Returns players of the game
	 * @returns {object} - Array of Player obejcts
	 */
	get players() {
		return this._players;
	}
}

module.exports = Game;
