var supertest = require('supertest');
var should = require('should');
var io = require('socket.io-client');
var config = require('../config');

var server = supertest.agent('http://localhost:' + config.web.port);


describe('API', function() {

	const path = '/api/auth/login';
	it('should return 200 for any login with correct credentials', function(done) {
		var cred = {
			username: 'user1',
		    password: 'user1'
      	};

		server
			.post(path)
			.send(cred)
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				should.exist(res);
				should.not.exist(err);

				res.status.should.equal(200);
				res.body.should.have.property('message');
				res.body.should.have.property('jwt');
			  	res.body.message.should.equal('Login successful.');
			  	res.body.jwt.should.not.equal(null);

				if (err) return done(err);
			  	else done();
		});
	});

	it('should return 400 for any login with missing credentials', function(done) {
		server
			.post(path)
			.expect('Content-Type', /json/)
			.expect(400, done);
	});

	it('should return 400 for any login with incomplete credentials', function(done) {
		var cred = {
			username: 'user1'
		};

		server
			.post(path)
			.send(cred)
			.expect('Content-Type', /json/)
			.expect(400, done);
	});

	it('should return 401 for any login with incorrect credentials', function(done) {
		var cred = {
			username: 'user1',
			password: 'user2'
		};

		server
			.post(path)
			.send(cred)
			.expect('Content-Type', /json/)
			.expect(401, done);
	});

    it('should return 403 for any customer route that requires authentication', function(done) {
        server
            .get('/api/customer')
            .expect('Content-Type', /json/)
            .expect(403, done);
    });

    it('should return 403 for any device route that requires authentication', function(done) {
        server
            .get('/api/device')
            .expect('Content-Type', /json/)
            .expect(403, done);
    });

    it('should return 403 for any store route that requires authentication', function(done) {
        server
            .get('/api/store/surge')
            .expect('Content-Type', /json/)
            .expect(403, done);
    });

    it('should return 403 for any user route that requires authentication', function(done) {
        server
            .get('/api/user/user1')
            .expect('Content-Type', /json/)
            .expect(403, done);
    });

    it('should return 404 for any route that does not exist', function(done) {
        server
            .post(path + '/test')
            .expect('Content-Type', /text\/html/)
            .expect(404, done);
    });

    it('should return 405 for any login that does not use POST', function(done) {
		server
			.get(path)
			.query({})
			.expect('Content-Type', /json/)
			.expect(405, done);
	});

    it('should return 200 for POSTs to the presence route that contains valid authorization', function(done) {
        server
            .post('/api/store/presence')
            .set('Authorization', 'Bearer ' + config.aerohive.accessToken)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should return 400 for POSTs to the presence route that do not contain valid authorization', function(done) {
        server
            .post('/api/store/presence')
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return 403 for POSTs to the presence route that contains invalid authorization', function(done) {
        server
            .post('/api/store/presence')
            .set('Authorization', 'Bearer ' + config.aerohive.accessToken + 'test')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
});


describe('Websocket', function() {
    var socket;

    before(function (done) {
        socket = io.connect('http://localhost:' + config.web.port, {
            'reconnection delay': 0
            , 'reopen delay': 0
            , 'force new connection': true
        });
        socket.on('connect', function () {
            console.log('Connected.');
            socket.on('eventStart', function(data) {
                console.log('Websocket received data from server (initial): ' + data);
            });
            socket.on('eventVIP', function(data) {
                console.log('Websocket received data from server (presence): ' + data);
            });
            done();
        });

        socket.on('disconnect', function () {
            console.log('Disconnected.');
        });
    });

    it('should return 200 for POSTs to the presence route that contains valid authorization', function(done) {
            server
                .post('/api/store/presence')
                .set('Authorization', 'Bearer ' + config.aerohive.accessToken)
                .set('Content-Type', 'application/json')
                .send({test:'data'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    should.exist(res);
                    should.not.exist(err);

                    res.status.should.equal(200);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('OK');

                    done();
                });
    });

    it('should return 400 for POSTs to the presence route that do not contain valid authorization', function(done) {
        server
            .post('/api/store/presence')
            .set('Content-Type', 'application/json')
            .send({test:'data'})
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(err, res) {
                should.not.exist(err);
                should.exist(res);

                done();
            });
    });

    after(function (done) {
        if (socket.connected) {
            console.log('Disconnecting...');
            socket.disconnect();
        } else {
            console.log('No open connection to disconnect.');
        }
        done();
    });
});

