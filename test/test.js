const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect;
const should = require('chai').should();
const LocationModel = require('../models/location.model')
const TargetModel = require('../models/target.model')
const PlayedTarget = require('../models/playedTarget.model')
const UserModel = require('../models/user.model')
const bodyParser = require('body-parser')

const app = require('express')();
chai.use(chaiHttp);

// require('../services/authentication/authentication');

const dbHandler = require('./db-handler');
app.use(function (req, res, next) {
	res.sendData = function (obj) { sendData(obj, req, res) };
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('../routes/authorization'));
app.use(require('../routes/locationRoutes'));
app.use(require('../routes/playedTargetRoutes'));
app.use(require('../routes/routes'));
app.use(require('../routes/targetRoutes'));
app.use(require('../routes/userRoutes'));

function sendData(obj, req, res) {
	if (req.accepts('json') || req.accepts('text/html')) {
		res.header('Content-Type', 'application/json');
		res.send(obj);
	} else
		if (req.accepts('application/xml')) {
			res.header('Content-Type', 'text/xml');
			const xmlOptions = {
				header: true,
				indent: '   '
			};
			let parsedResponse = { response: JSON.parse(obj) };
			var xml = toXML(parsedResponse, xmlOptions);
			res.send(xml);
		} else {
			res.send(406);
		}
};

describe('tests', function () {
	before(function () {
		dbHandler.connect()
	});

	after(function () {
		dbHandler.closeDatabase()
	});

	afterEach(function () {
		dbHandler.clearDatabase()
	});
	beforeEach(function () {
		location1 = new LocationModel({ locationName: 'Eindhoven', latitude: 80, longitude: 80, range: 20 });
		location2 = new LocationModel({ locationName: 'Den Bosch', latitude: 80, longitude: 80, range: 20 });
		location1.save();
		location2.save();
	});

	describe('location', function () {
		describe('return locations', function () {
			it('should return all locations', function (done) {
				chai.request(app)
					.get('/location')
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.data.should.have.length(2)
						done();
					});
			});
		})

		describe('create new location', function () {
			it('should create a new location', function (done) {
				location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20 })
				const request = chai.request(app)
					.post('/location')
					.send(location)
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(201)
						res.body.data.locationName.should.be.eql('Amsterdam')
						done();
					});
			});
			it('should validate latitude', function (done) {
				location = new LocationModel({ locationName: 'Amsterdam', latitude: 91, longitude: 80, range: 20 })
				const request = chai.request(app)
					.post('/location')
					.send(location)
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(400)
						res.body.error.message.should.be.eql('location validation failed: latitude: 91 is not a valid latitude!')
						done();
					});
			});
		});

		// describe('update location', function () {
		// 	it('should update a locations', function (done) {
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20 })
		// 		location.save()
		// 		chai.request(app)
		// 			.put('/location/' + location._id)
		// 			.send({ locationName: 'Utrecht' })
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.locationName.should.be.eql('Utrecht')
		// 				done();
		// 			});
		// 	});
		// 	it('should not update a not exisiting location', function (done) {
		// 		chai.request(app)
		// 			.put('/location/200')
		// 			.send({ locationName: 'Utrecht' })
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(400)
		// 				done();
		// 			});
		// 	});
		// })
		// describe('delete location', function () {
		// 	it('should delete a locations', function (done) {
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20 })
		// 		location.save()
		// 		chai.request(app)
		// 			.delete('/location/' + location._id)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				done();
		// 			});
		// 	});
		// })
		// describe('get a location', function () {
		// 	it('should get a location', function (done) {
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20 })
		// 		location.save()
		// 		chai.request(app)
		// 			.get('/location/' + location._id)
		// 			.send(location)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.locationName.should.be.eql('Amsterdam')
		// 				done();
		// 			});
		// 	});
		// 	it('should not get a non existing location', function (done) {
		// 		chai.request(app)
		// 			.get('/location/' + 20)
		// 			.send(location)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(400)
		// 				done();
		// 			});
		// 	});
		// });

		// describe('add target', function () {
		// 	it('should add a target to location', function (done) {
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20 })
		// 		location.save()
		// 		newTarget = new TargetModel({ name: 'plaatje', description: 'test', picture: 'test' })
		// 		newTarget.save()
		// 		chai.request(app)
		// 			.post('/location/' + location._id)
		// 			.send({ target_id: newTarget._id })
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.locationName.should.be.eql('Amsterdam')
		// 				res.body.data.targets.should.have.length(1)
		// 				done();
		// 			});
		// 	});
		// 	it('should no add a target to a not existing location', function (done) {
		// 		newTarget = new TargetModel({ name: 'plaatje', description: 'test', picture: 'test' })
		// 		newTarget.save()
		// 		chai.request(app)
		// 			.post('/location/200')
		// 			.send({ target_id: newTarget._id })
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(400)
		// 				done();
		// 			});
		// 	});
		// })


		// describe('return target', function () {
		// 	it('should return a specific target inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
		// 		target1.save()
		// 		target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
		// 		target2.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id, target2._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.name.should.be.eql('plaatje1')
		// 				done();
		// 			});
		// 	});
		// 	it('should not return a target inside a location that doesnt exist', function (done) {
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20 })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/20')
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(400)
		// 				done();
		// 			});
		// 	});
		// });
		// describe('return targets', function () {
		// 	it('should return all targets inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
		// 		target1.save()
		// 		target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
		// 		target2.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id, target2._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/')
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.should.have.length(2)
		// 				done();
		// 			});
		// 	});
		// });
		// describe('return hint', function () {
		// 	it('should return specific hint inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', hints: ['hint1', 'hint2'] })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id, target2._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/hints/' + 0)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.should.be.eql('hint1')
		// 				done();
		// 			});
		// 	});
		// 	it('should not return not existing hint inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/hints/' + 0)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(400)
		// 				done();
		// 			});
		// 	});
		// });
		// describe('return score', function () {
		// 	it('should return specific score inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200 }, { points: 100 }] })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/' + 0)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.points.should.be.eql(200)
		// 				done();
		// 			});
		// 	});
		// 	it('should not return not existing score inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20 })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/' + 0)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(400)
		// 				done();
		// 			});
		// 	});
		// });
		// describe('return scores', function () {
		// 	it('should return all scores inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200 }, { points: 100 }] })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/')
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.should.have.length(2)
		// 				done();
		// 			});
		// 	});
		// });
		// describe('return scoretags', function () {
		// 	it('should return all tags inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200, tag: [20, 15] }] })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/' + 0 + '/tag')
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.should.have.length(2)
		// 				done();
		// 			});
		// 	});
		// });
		// describe('return scoretag', function () {
		// 	it('should return specific tag inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200, tag: [20, 15] }] })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/' + 0 + '/tag/' + 0)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.should.be.eql(20)
		// 				done();
		// 			});
		// 	});
		// 	it('should return specific tag inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200, tag: [] }] })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/' + 0 + '/tag/' + 0)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(400)
		// 				done();
		// 			});
		// 	});
		// });
		// describe('returns location from target', function () {
		// 	it('should return location from target', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200, tag: [20, 15] }] })
		// 		target1.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', lat: 80, long: 80, range: 20, targets: [target1._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/target/' + target1._id)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data[0].locationName.should.be.eql('Amsterdam')
		// 				done();
		// 			});
		// 	});
		// });
	});

	// describe('auth', function () {
	// 	describe('sign up', function () {
	// 		it('should sign up user', function (done) {
	// 			chai.request(app)
	// 				.post('/signup?email=example@example.com&password=password&role=admn')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.message.should.be.eql('Signup successful')
	// 					done();
	// 				});
	// 		});
	// 	})
	// 	describe('sign up', function () {
	// 		it('should sign up user', function (done) {
	// 			chai.request(app)
	// 				.post('/signup?email=example@example.com&password=password&role=admin')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.message.should.be.eql('Signup successful')
	// 					done();
	// 				});
	// 		});
	// 	})
	// });
	// describe('target', function () {
	// 	describe('get targets', function () {
	// 		it('should return all targets', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			target2.save()
	// 			chai.request(app)
	// 				.get('/target')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.have.length(2)
	// 					done();
	// 				});
	// 		});
	// 	})
	// 	describe('get specific target', function () {
	// 		it('should return a target', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			target2.save()
	// 			chai.request(app)
	// 				.get('/target/' + target1._id)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.name.should.be.eql('plaatje1')
	// 					done();
	// 				});
	// 		});
	// 		it('should not return not existing target', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			target2.save()
	// 			chai.request(app)
	// 				.get('/target/20')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	})
	// 	describe('get specific target', function () {
	// 		it('should make a target', function (done) {
	// 			chai.request(app)
	// 				.post('/target/')
	// 				.send({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(201)
	// 					res.body.data.name.should.be.eql('plaatje1')
	// 					done();
	// 				});
	// 		});
	// 	})
	// 	describe('update target', function () {
	// 		it('should update a target', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save();
	// 			chai.request(app)
	// 				.put('/target/' + target1._id)
	// 				.send({ name: 'plaatje' })
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.name.should.be.eql('plaatje')
	// 					done();
	// 				});
	// 		});
	// 		it('should not update not existing target', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			chai.request(app)
	// 				.put('/target/9')
	// 				.send({ name: 'plaatje' })
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	})
	// 	describe('delete target', function () {
	// 		it('should delete a target', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save();
	// 			chai.request(app)
	// 				.delete('/target/' + target1._id)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.message.should.be.eql('Target deleted')
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('target scores', function () {
	// 		it('should get a target scores', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [20, 40] })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/score')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.have.length(2)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('target score', function () {
	// 		it('should get a specific target scores', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [20, 40] })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/score/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.be.eql(20)
	// 					done();
	// 				});
	// 		});
	// 		it('should not get a specific target scores if it doesnt exist', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/score/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('target score tag', function () {
	// 		it('should get a specific target score tag', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200, tag: [30, 15] }] })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/score/' + 0 + '/tag/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.be.eql(30)
	// 					done();
	// 				});
	// 		});
	// 		it('should not get a specific target score tag if it doesnt exist', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/score/' + 0 + '/tag/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('target score tags', function () {
	// 		it('should get all target score tags', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200, tag: [30, 15] }] })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/score/' + 0 + '/tag')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.have.length(2)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('target score hints', function () {
	// 		it('should get a target score hint', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', hints: ['hint1', 'hint2'] })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/hints/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.be.eql('hint1')
	// 					done();
	// 				});
	// 		});
	// 		it('should not get a target score hint if it doesnt exist', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save();
	// 			chai.request(app)
	// 				.get('/target/' + target1._id + '/hints/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	});
	// });
	// describe('playedTarget', function () {
	// 	describe('get playedTargets', function () {
	// 		it('should return all playedtargets per page', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget2 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget3 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();
	// 			playedTarget2.save();
	// 			playedTarget3.save();

	// 			chai.request(app)
	// 				.get('/playedTarget')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.have.length(2)
	// 					done();
	// 				});
	// 		});
	// 		it('should return all playedtargets per page 2', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget2 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget3 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();
	// 			playedTarget2.save();
	// 			playedTarget3.save();

	// 			chai.request(app)
	// 				.get('/playedTarget?page=2')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.have.length(1)
	// 					done();
	// 				});
	// 		});
	// 	})
	// 	describe('get playedTarget', function () {
	// 		it('should return a playedtarget', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.get('/playedTarget/' + playedTarget1._id)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.picture.should.be.eql('test')
	// 					done();
	// 				});
	// 		});
	// 		it('should not return a playedtarget that doesnt exist', function (done) {
	// 			chai.request(app)
	// 				.get('/playedTarget/20')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('update playedTarget', function () {
	// 		it('should update a playedtarget', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.put('/playedTarget/' + playedTarget1._id)
	// 				.send({ picture: 'test2' })
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.picture.should.be.eql('test2')
	// 					done();
	// 				});
	// 		});
	// 		it('should not update a playedtarget that doesnt exist', function (done) {
	// 			chai.request(app)
	// 				.put('/playedTarget/20')
	// 				.send({ picture: 'test2' })
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('delete playedTarget', function () {
	// 		it('should delete a playedtarget', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.delete('/playedTarget/' + playedTarget1._id)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.message.should.be.eql('PlayedTarget deleted')
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('target', function () {
	// 		it('should get a targets playedtarget', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.get('/playedTarget/target/' + target1._id)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data[0].picture.should.be.eql('test')
	// 					res.body.data.should.have.length(1)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('score', function () {
	// 		it('should get a playedtargets score', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id, score: [{ points: 200 }, { points: 100 }] })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.get('/playedTarget/' + playedTarget1._id + '/score/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.be.eql({ points: 200 })
	// 					done();
	// 				});
	// 		});
	// 		it('should not get a playedtargets score if it doesnt exist', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.get('/playedTarget/' + playedTarget1._id + '/score/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('scores', function () {
	// 		it('should get a playedtargets scores', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id, score: [{ points: 200 }, { points: 100 }] })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.get('/playedTarget/' + playedTarget1._id + '/score/')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.have.length(2)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('tag', function () {
	// 		it('should get a playedtargets tag', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id, score: [{ points: 200, tag: [20, 15] }] })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.get('/playedTarget/' + playedTarget1._id + '/score/' + 0 + '/tag/' + 0)
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.be.eql(20)
	// 					done();
	// 				});
	// 		});
	// 		it('should not get a playedtargets tag if it doesnt exist', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 			.get('/playedTarget/' + playedTarget1._id + '/score/' + 0 + '/tag/' + 0)
	// 			.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(400)
	// 					done();
	// 				});
	// 		});
	// 	});
	// 	describe('scores', function () {
	// 		it('should get a playedtargets tags', function (done) {
	// 			target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
	// 			target1.save()
	// 			playedTarget1 = new PlayedTarget({ picture: 'test', target: target1._id, score: [{ points: 200, tag: [20, 15] }] })
	// 			playedTarget1.save();

	// 			chai.request(app)
	// 				.get('/playedTarget/' + playedTarget1._id + '/score/' + 0 + '/tag')
	// 				.end((err, res) => {
	// 					if (err) { return done(err); }
	// 					res.should.have.status(200)
	// 					res.body.data.should.have.length(2)
	// 					done();
	// 				});
	// 		});
	// 	});
	// });
});
