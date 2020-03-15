process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = require('chai').expect;

chai.use(chaiHttp);

describe('/POST init', () => {
	var requester;
	var app;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		app = require('../app');
		requester = chai.request(app).keepOpen();
	});

	afterEach((done) => {
		app.stop(done);
	});

	it('should be able to "start a new game with either 1 or 2 players"', (done) => {
		let request = {
			'players': 2
		};

		requester
			.post('/init')
			.send(request)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('gameID');
				expect(res.body).to.have.property('message').equal('success');
				expect(res.body).to.have.property('players').equal(2);
				done();
			});
	});

	it('should init a new game with max 2 players', (done) => {
		let request = {
			'players': 3
		};

		requester
			.post('/init')
			.send(request)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('gameID');
				expect(res.body).to.have.property('message').equal('not all users were initiated');
				expect(res.body).to.have.property('players').equal(2);
				done();
			});
	});

	it('should fail if invalid data is provided', (done) => {
		let request = {};

		requester
			.post('/init')
			.send(request)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('message').equal('invalid number of players');
				done();
			});
	});
});

describe('/GET availableGames', () => {
	var requester;
	var app;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		app = require('../app');
		requester = chai.request(app).keepOpen();
	});

	afterEach((done) => {
		app.stop(done);
	});

	it('should retrieve 0 availble games', (done) => {
		requester
			.get('/availableGames')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message').equal('success');
				expect(res.body).to.have.property('availableGames').equal(0);
				done();
			});
	});

	it('should retrieve 1 availble game', (done) => {
		let request = {
			'players': 2
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				requester
					.get('/availableGames')
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.have.property('message').equal('success');
						expect(res.body).to.have.property('availableGames').equal(1);
						done();
					});
			});

	});
});

describe('/POST roll', () => {
	var requester;
	var app;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		app = require('../app');
		requester = chai.request(app).keepOpen();
	});

	afterEach((done) => {
		app.stop(done);
	});

	it('should be able to "input a user\'s results frame by frame" and "see an end to end test that simulates a real game"', (done) => {
		let request = {
			'players': 2
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				let requestRoll = {
					'gameID': 0,
					'playerID': 1,
					'newKnocks': 2
				}

				requester
					.post('/roll')
					.send(requestRoll)
					.end((err, res) => {
						expect(res).to.have.status('200');
						expect(res.body).to.have.property('message').equal('success');
						done();
					});
			});
	});

	it('should fail if there is no such game', (done) => {
		let requestRoll = {
			'gameID': 0,
			'playerID': 1,
			'newKnocks': 2
		}

		requester
			.post('/roll')
			.send(requestRoll)
			.end((err, res) => {
				expect(res).to.have.status('400');
				expect(res.body).to.have.property('message').equal('there is no such game');
				done();
			});
	});

	it('should fail if there is no such player', (done) => {
		let request = {
			'players': 1
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				let requestRoll = {
					'gameID': 0,
					'playerID': 1,
					'newKnocks': 2
				}

				requester
					.post('/roll')
					.send(requestRoll)
					.end((err, res) => {
						expect(res).to.have.status('400');
						expect(res.body).to.have.property('message').equal('there is no such player');
						done();
					});
			});
	});

	it('should fail if the number of knocked pins is invalid', (done) => {
		let request = {
			'players': 1
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				let requestRoll = {
					'gameID': 0,
					'playerID': 0,
					'newKnocks': 11
				}

				requester
					.post('/roll')
					.send(requestRoll)
					.end((err, res) => {
						expect(res).to.have.status('400');
						expect(res.body).to.have.property('message').equal('invalid number of knocked pins');
						done();
					});
			});
	});
});

describe('/GET rollingScore/:gameID/:playerID', () => {
	var requester;
	var app;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		app = require('../app');
		requester = chai.request(app).keepOpen();
	});

	afterEach((done) => {
		app.stop(done);
	});

	it('should be able to "retrieve my current score"', (done) => {
		let request = {
			'players': 2
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				let requestRoll = {
					'gameID': 0,
					'playerID': 1,
					'newKnocks': 2
				}

				requester
					.post('/roll')
					.send(requestRoll)
					.end(() => {
						requester
							.get('/rollingScore/0/1')
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body).to.have.property('message').equal('success');
								expect(res.body).to.have.property('rollingScore').equal(2);
								done();
							});
					});
			});
	});

	it('should fail if there is no such player', (done) => {
		let request = {
			'players': 1
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				requester
					.get('/rollingScore/0/1')
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.body).to.have.property('message').equal('there is no such player');
						done();
					});
			});
	});

	it('should fail if there is no such game', (done) => {
		requester
			.get('/rollingScore/0/1')
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('message').equal('there is no such game');
				done();
			});
	});
});

describe('/GET frame/:gameID/:playerID/:frameID', () => {
	var requester;
	var app;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		app = require('../app');
		requester = chai.request(app).keepOpen();
	});

	afterEach((done) => {
		app.stop(done);
	});

	it('should be able to "retrieve frame by frame history"', (done) => {
		let request = {
			'players': 2
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				let requestRoll = {
					'gameID': 0,
					'playerID': 1,
					'newKnocks': 2
				}

				requester
					.post('/roll')
					.send(requestRoll)
					.end(() => {
						requester
							.get('/frame/0/1/0')
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body).to.have.property('message').equal('success');
								expect(res.body).to.have.property('frame').eql([2, null]);
								done();
							});
					});
			});
	});

	it('should fail if there is no such frame', (done) => {
		let request = {
			'players': 2
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				requester
					.get('/frame/0/1/0')
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.body).to.have.property('message').equal('there is no such frame');
						done();
					});
			});
	});

	it('should fail if there is no such player', (done) => {
		let request = {
			'players': 1
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				requester
					.get('/frame/0/1/0')
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.body).to.have.property('message').equal('there is no such player');
						done();
					});
			});
	});

	it('should fail if there is no such game', (done) => {
		let request = {
			'players': 1
		};

		requester
			.post('/init')
			.send(request)
			.end(() => {
				requester
					.get('/frame/1/0/0')
					.end((err, res) => {
						expect(res).to.have.status(400);
						expect(res.body).to.have.property('message').equal('there is no such game');
						done();
					});
			});
	});
});

describe('/GET calculateScore', () => {
	var requester;
	var app;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		app = require('../app');
		requester = chai.request(app).keepOpen();
	});

	afterEach((done) => {
		app.stop(done);
	});

	it('should be able to "specify a historic game and retrieve the results"', (done) => {
		let request = {
			'rolls' : [10, 7, 3, 7, 2, 9, 1, 10, 10, 10, 2, 3, 6, 4, 7, 3, 3]
		};

		requester
			.get('/calculateScore')
			.send(request)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message').equal('success');
				expect(res.body).to.have.property('score').equal(168);
				done();
			});
	});

	it('should fail if there is an invalid roll', (done) => {
		let request = {
			'rolls' : [11]
		};

		requester
			.get('/calculateScore')
			.send(request)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.property('message').equal('invalid number of knocked pins (11)');
				done();
			});
	});
});
