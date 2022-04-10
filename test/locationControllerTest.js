const chai = require('chai')
const chaiHttp = require('chai-http')
const LocationModel = require('../models/location.model')
const TargetModel = require('../models/target.model')
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

describe('locationControllerTest', function () {
	before(function () {
		dbHandler.connect()
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
				location = new LocationModel({ locationName: 'Amsterdam', latitude: 10, longitude: 10, range: 20 })
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
        describe('update location', function () {
			it('should update a locations', function (done) {
				location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20 })
				location.save()
				chai.request(app)
					.put('/location/' + location._id)
					.send({ locationName: 'Utrecht' })
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.data.locationName.should.be.eql('Utrecht')
						done();
					});
			});
			it('should not update a not exisiting location', function (done) {
				chai.request(app)
					.put('/location/200')
					.send({ locationName: 'Utrecht' })
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(400)
						done();
					});
			});
		})
		describe('delete location', function () {
			it('should delete a locations', function (done) {
				location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20 })
				location.save()
				chai.request(app)
					.delete('/location/' + location._id)
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						done();
					});
			});
		})
		describe('get a location', function () {
			it('should get a location', function (done) {
				location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20 })
				location.save()
				chai.request(app)
					.get('/location/' + location._id)
					.send(location)
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.data.locationName.should.be.eql('Amsterdam')
						done();
					});
			});
			it('should not get a non existing location', function (done) {
				chai.request(app)
					.get('/location/' + 20)
					.send(location)
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(400)
						done();
					});
			});
		});
        describe('add target', function () {
			it('should add a target to location', function (done) {
				location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20 })
				location.save()
				newTarget = new TargetModel({ name: 'plaatje', description: 'test', picture: 'test' })
				newTarget.save()
				chai.request(app)
					.post('/location/' + location._id)
					.send({ target_id: newTarget._id })
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.data.locationName.should.be.eql('Amsterdam')
						res.body.data.targets.should.have.length(1)
						done();
					});
			});
			it('should not add a target to a not existing location', function (done) {
				newTarget = new TargetModel({ name: 'plaatje', description: 'test', picture: 'test' })
				newTarget.save()
				chai.request(app)
					.post('/location/200')
					.send({ target_id: newTarget._id })
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(400)
						done();
					});
			});
		});
        // describe('return target', function () {
		// 	it('should return a specific target inside a location', function (done) {
		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
		// 		target1.save()
		// 		target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
		// 		target2.save()
		// 		location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20, targets: [target1._id, target2._id] })
		// 		location.save()

		// 		chai.request(app)
		// 			.get('/location/' + location._id + '/target/' + target1._id)
		// 			.end((err, res) => {
		// 				if (err) { return done(err); }
		// 				res.should.have.status(200)
		// 				res.body.data.name.should.be.eql('plaatje1')
		// 				done();
        //             });
		
        //     });
        //     it('should not return a target inside a location that doesnt exist', function (done) {
		// 		location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20 })
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
		// 		location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20, targets: [target1._id, target2._id] })
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
//         // describe('return hint', function () {
// 		// 	it('should return specific hint inside a location', function (done) {
// 		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', hints: ['hint1', 'hint2'] })
// 		// 		target1.save()
// 		// 		location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20, targets: [target1._id] })
// 		// 		location.save()

// 		// 		chai.request(app)
// 		// 			.get('/location/' + location._id + '/target/' + target1._id + '/hints/' + 0)
// 		// 			.end((err, res) => {
// 		// 				if (err) { return done(err); }
// 		// 				res.should.have.status(200)
// 		// 				res.body.data.should.be.eql('hint1')
// 		// 				done();
// 		// 			});
// 			// it('should not return not existing hint inside a location', function (done) {
// 			// 	target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
// 			// 	target1.save()
// 			// 	location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20, targets: [target1._id] })
// 			// 	location.save()

// 			// 	chai.request(app)
// 			// 		.get('/location/' + location._id + '/target/' + target1._id + '/hints/' + 0)
// 			// 		.end((err, res) => {
// 			// 			if (err) { return done(err); }
// 			// 			res.should.have.status(400)
// 			// 			done();
// 			// 		});
// 			// });
// 		// });
// 		// describe('return score', function () {
// 		// 	it('should return specific score inside a location', function (done) {
// 		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200 }, { points: 100 }] })
// 		// 		target1.save()
// 		// 		location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20, targets: [target1._id] })
// 		// 		location.save()

// 		// 		chai.request(app)
// 		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/' + 0)
// 		// 			.end((err, res) => {
// 		// 				if (err) { return done(err); }
// 		// 				res.should.have.status(200)
// 		// 				res.body.data.points.should.be.eql(200)
// 		// 				done();
// 		// 			});
// 		// 	});
// 		// 	it('should not return not existing score inside a location', function (done) {
// 		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
// 		// 		target1.save()
// 		// 		location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20 })
// 		// 		location.save()

// 		// 		chai.request(app)
// 		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/' + 0)
// 		// 			.end((err, res) => {
// 		// 				if (err) { return done(err); }
// 		// 				res.should.have.status(400)
// 		// 				done();
// 		// 			});
// 		// 	});
// 		// });
// 		// describe('return scores', function () {
// 		// 	it('should return all scores inside a location', function (done) {
// 		// 		target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test', score: [{ points: 200 }, { points: 100 }] })
// 		// 		target1.save()
// 		// 		location = new LocationModel({ locationName: 'Amsterdam', latitude: 80, longitude: 80, range: 20, targets: [target1._id] })
// 		// 		location.save()

// 		// 		chai.request(app)
// 		// 			.get('/location/' + location._id + '/target/' + target1._id + '/score/')
// 		// 			.end((err, res) => {
// 		// 				if (err) { return done(err); }
// 		// 				res.should.have.status(200)
// 		// 				res.body.data.should.have.length(2)
// 		// 				done();
// 		// 			});
// 		// 	});
// 		// });
    });
});