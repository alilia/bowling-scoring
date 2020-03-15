// Based on https://www.liveabout.com/bowling-scoring-420895

const Player = require('../src/player');
const expect = require('chai').expect;

describe('Scoring', () => {
	it('should be 0 if nothing was knocked off', () => {
		const player = new Player();

		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].forEach(item => {
			player.roll(item)
		})

		expect(player.rollingScore).to.be.equal(0);
	});

	it('rolls should contain 0s if nothing was knocked off', () => {
		const player = new Player();

		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].forEach(item => {
			player.roll(item);
		})

		expect(player.rolls).to.eql([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	});

	it('frames should contain -s if nothing was knocked off', () => {
		const player = new Player();

		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].forEach(item => {
			player.roll(item);
		})

		expect(player.frames).to.eql([['-', '-'], ['-', '-'], ['-', '-'], ['-', '-'], ['-', '-'], ['-', '-'], ['-', '-'], ['-', '-'], ['-', '-'], ['-', '-']]);
	});

	it('rolls should contain 10s if all rolls were strikes', () => {
		const player = new Player();

		[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10].forEach(item => { // 12 rolls, yes
			player.roll(item);
		})

		expect(player.rolls).to.eql([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
	});

	it('frames should contain Xs if all rolls were strikes', () => {
		const player = new Player();

		[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10].forEach(item => {
			player.roll(item);
		})

		expect(player.frames).to.eql([[null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X'], [null, 'X']]);
	});

	it('rolls should contain 5s if every second roll was a spare (5, 5, 5 etc.)', () => {
		const player = new Player();

		[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5].forEach(item => {
			player.roll(item);
		})

		expect(player.rolls).to.eql([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
	});

	it('frames should contain 5s and /s if every second roll was a spare (5, 5, 5 etc.)', () => {
		const player = new Player();

		[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5].forEach(item => {
			player.roll(item);
		})
		expect(player.frames).to.eql([[5, '/'], [5, '/'], [5, '/'], [5, '/'], [5, '/'], [5, '/'], [5, '/'], [5, '/'], [5, '/'], [5, '/']]);
	});
	
	it('should be 300 if every roll is strike', () => {
		const player = new Player();
		
		[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10].forEach(item => {
			player.roll(item);
		})

		expect(player.rollingScore).to.be.equal(300);
	});

	it('should except not more than 10 frames if 10th frame is neither strike nor spare', () => {
		const player = new Player();

		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].forEach(item => {
			player.roll(item);
		})

		let cought = false;

		try {
			player.roll(0);
		} catch {
			cought = true;
		}

		if (!cought) {
			throw 'test fails';
		}
	});

	it('should except two extra rolls if 10th frame is strike', () => {
		const player = new Player();

		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10].forEach(item => {
			player.roll(item);
		})

		player.roll(0);
		player.roll(0);

		let cought = false;

		try {
			player.roll(0);
		} catch {
			cought = true;
		}

		if (!cought) {
			throw 'test fails';
		}
	});

	it('should except two extra rolls if 10th frame is strike', () => {
		const player = new Player();

		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5].forEach(item => {
			player.roll(item);
		})

		player.roll(0);

		let cought = false;

		try {
			player.roll(0);
		} catch {
			cought = true;
		}

		if (!cought) {
			throw 'test fails';
		}
	});
});

describe('Sample games', () => {
	it('no. 1', () => {
		const player = new Player();
		[10, 7, 3, 7, 2, 9, 1, 10, 10, 10, 2, 3, 6, 4, 7, 3, 3].forEach(item => {
			player.roll(item);
		})

		expect(player.rollingScore).to.be.equal(168);
	});

	it('no. 2', () => {
		const player = new Player();
		[8, 1, 10, 6, 2, 10, 8, 2, 10, 9, 1, 9, 0, 9, 1, 10, 10, 10].forEach(item => {
			player.roll(item);
		})

		expect(player.rollingScore).to.be.equal(173);
	});

	it('no. 3', () => {
		const player = new Player();
		[10, 9, 0, 9, 1, 8, 1, 6, 4, 6, 3, 8, 2, 7, 3, 6, 4, 10, 6, 1].forEach(item => {
			player.roll(item);
		})

		expect(player.rollingScore).to.be.equal(150);
	});

	it('no. 4', () => {
		const player = new Player();
		[9, 1, 6, 3, 10, 8, 2, 6, 3, 10, 10, 10, 8, 2, 9, 1, 5].forEach(item => {
			player.roll(item);
		})

		expect(player.rollingScore).to.be.equal(182);
	});
});
