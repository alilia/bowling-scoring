class Player {
	constructor() {
		this._lastKnocks = -1;
		this._rolls = []; // possible values: 0-10, '/'
		this._frameCount = 0; // should be part of the game, not a player?
		this._extraRolls = 0;
	}

	/**
	 * Performs a roll for the player
	 * @param {number} newKnocks 
	 */
	roll(newKnocks) {
		if (newKnocks < 0 || 10 < newKnocks) {
			throw new RangeError('invalid knocked pins number');
		}

		if (this.isGameFinished) {
			throw 'Game already ended.';
		} else if (this._extraRolls > 0) {
			this._extraRolls--;
		}

		if (this._lastKnocks > -1) {
			if (newKnocks + this._lastKnocks == 10) { // spare
				this._rolls.push('/');
				this._extraRolls = 1;
			} else {
				this._rolls.push(newKnocks);
			}

			this._lastKnocks = -1;
			this._frameCount++;
		} else {
			this._rolls.push(newKnocks);

			if (newKnocks == 10) { // strike
				this._frameCount++;

				if (this._frameCount == 10) {
					this._extraRolls = 2;
				}
			} else {
				this._lastKnocks = newKnocks;
			}
		}
	}

	/**
	 * Calculates player's score based on already performed rolls.
	 * @returns {number} score
	 */
	get rollingScore() {
		let retVal = 0;
		let rolls = this._rolls;
		let rollsCount = rolls.length;

		rolls.forEach((item, idx) => {
			if (idx >= rollsCount - 3) {
				if (item == '/') {
					retVal += 10 - rolls[idx - 1];
				} else {
					retVal += item;
				}
			} else if (item == 10) {
				retVal += 10;
				retVal += rolls[idx + 1];

				if (rolls[idx + 2] == '/') {
					retVal += 10 - rolls[idx + 1];
				} else {
					retVal += rolls[idx + 2];
				}
			} else if (item == '/') {
				retVal += 10 - rolls[idx - 1];
				retVal += rolls[idx + 1];
			} else {
				retVal += item;
			}
		});

		return retVal;
	}

	/**
	 * @returns {object} - Array of ints, of performed rolls
	 */
	get rolls() {
		return this._rolls.map((item, idx) => {
			if (item == '/') {
				return 10 - this._rolls[idx - 1];
			} else {
				return item;
			}
		});	
	}

	/**
	 * @returns {object} - Object with tuples of ints
	 */
	get frames() {
		let frames = [];
		let tempFrame = [];

		this.rolls.forEach((item) => {
			if (item == 10) {
				tempFrame.push(null);
				tempFrame.push('X');
			} else if (tempFrame.length == 1 && item + tempFrame[0] == 10) {
				tempFrame.push('/');
			} else {
				if (item == 0) {
					tempFrame.push('-');
				} else {
					tempFrame.push(item);
				}
			}

			if (tempFrame.length == 2) {
				frames.push(tempFrame);
				tempFrame = [];
			}
		})

		if (tempFrame.length == 1) {
			tempFrame.push(null);
			frames.push(tempFrame);
		}

		return frames;
	}

	/**
	 * @returns {boolean} - Whether the game is finished or not (based on the rolls preformed)
	 */
	get isGameFinished() {
		return this._frameCount >= 10 && this._extraRolls == 0;
	}
}

module.exports = Player;
