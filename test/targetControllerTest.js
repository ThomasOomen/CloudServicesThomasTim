const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect;
const should = require('chai').should();
const LocationModel = require('../models/location.model')
const TargetModel = require('../models/target.model')
const bodyParser = require('body-parser')
const dbHandler = require('./db-handler');
const app = require('express')();
chai.use(chaiHttp);

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

describe('tests', function () {
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

	
	describe('target', function () {
		describe('get targets', function () {
			it('should return all targets', function (done) {
				target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
				target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
				target1.save()
				target2.save()
				chai.request(app)
					.get('/target')
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.data.should.have.length(2)
						done();
					});
			});
		})
		describe('get specific target', function () {
			it('should return a target', function (done) {
				target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
				target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
				target1.save()
				target2.save()
				chai.request(app)
					.get('/target/' + target1._id)
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.data.name.should.be.eql('plaatje1')
						done();
					});
			});
			it('should not return not existing target', function (done) {
				target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
				target2 = new TargetModel({ name: 'plaatje2', description: 'test', picture: 'test' })
				target1.save()
				target2.save()
				chai.request(app)
					.get('/target/20')
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(400)
						done();
					});
			});
		})
		describe('get specific target', function () {
			it('should make a target', function (done) {
				chai.request(app)
					.post('/target/')
					.send({ name: 'plaatje1', description: 'test', picture: 'test' })
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(201)
						res.body.data.name.should.be.eql('plaatje1')
						done();
					});
			});
		})
		describe('update target', function () {
			it('should update a target', function (done) {
				target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
				target1.save();
				chai.request(app)
					.put('/target/' + target1._id)
					.send({ name: 'plaatje' })
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.data.name.should.be.eql('plaatje')
						done();
					});
			});
			it('should not update not existing target', function (done) {
				target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
				chai.request(app)
					.put('/target/9')
					.send({ name: 'plaatje' })
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(400)
						done();
					});
			});
		})
		describe('delete target', function () {
			it('should delete a target', function (done) {
				target1 = new TargetModel({ name: 'plaatje1', description: 'test', picture: 'test' })
				target1.save();
				chai.request(app)
					.delete('/target/' + target1._id)
					.end((err, res) => {
						if (err) { return done(err); }
						res.should.have.status(200)
						res.body.message.should.be.eql('Target deleted')
						done();
					});
			});
		});
	});
});
