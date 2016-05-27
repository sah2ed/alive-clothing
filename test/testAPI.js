var supertest = require('supertest');
var should = require('should');
var config = require('../config');

var server = supertest.agent('http://localhost:' + config.web.port);


describe('API', function() {

    describe('/user', function() {
        const path = '/api/user';

        describe('account creation', function() {
            describe('[accuracy]', function() {
                it('should create a user account when all required properties are present');
            });

            describe('[failure]', function() {
                it('should not create a user account for an existing username');
                it('should not create a user account for an invalid username');
                it('should not create a user account without a username');
                it('should not create a user account without a password');
                it('should not create a user account without an email address');
            });
        });

        describe('account view', function() {
            describe('[accuracy]', function() {
                it('should return the user account for a username');
            });

            describe('[failure]', function() {
                it('should return 400 for an invalid username');
                it('should return 404 for a non-existent username');
            });
        });
    });

    describe('/customer', function() {
        const path = '/api/customer';

        describe('account creation', function() {
            describe('[accuracy]', function() {
                it('should create a user account when all required properties are present');
            });

            describe('[failure]', function() {
                it('should not create a customer account for an existing username');
                it('should not create a user account for an invalid username');
                it('should not create a user account without a username');
                it('should not create a user account without a password');
                it('should not create a user account without an email address');
            });
        });

        describe('account view', function() {
            describe('[accuracy]', function() {
                it('should return the user account for a username');
            });

            describe('[failure]', function() {
                it('should return 400 for an invalid username');
                it('should return 404 for a non-existent username');
            });
        });
    });

    describe('/device', function() {
        const path = '/api/device';

        describe('creation', function() {
            describe('[accuracy]', function() {
                it('should create a user account when all required properties are present');
            });

            describe('[failure]', function() {
                it('should not create a user account for an existing username');
                it('should not create a user account for an invalid username');
                it('should not create a user account without a username');
                it('should not create a user account without a password');
                it('should not create a user account without an email address');
            });
        });

        describe('view', function() {
            describe('[accuracy]', function() {
                it('should return the dei for a username');
            });

            describe('[failure]', function() {
                it('should return 400 for an invalid username');
                it('should return 404 for a non-existent username');
            });
        });
    });


});

