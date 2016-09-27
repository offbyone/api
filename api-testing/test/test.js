var host = "https://localhost:4430";
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');
var cert = fs.readFileSync('../nginx/ssl/localhost.cert','utf8');
// For now test data is empty.
var memberlist = [];
var memberstats = {"":{"total":0}};
// Create agent for unlogged and admin sessions
var unlogged=request.agent(host,{ca:cert});
var admin=request.agent(host,{ca:cert});
var loginparams={email:"admin@example.com",key:"key"}

describe("Check that API services are up",function () {
    this.retries(5);
    afterEach(function (done) {
        if (this.currentTest.state !== 'passed') {
            setTimeout(done,1000);        
        } else {
            done();
        }
    })
    it("Should have web server running",function (done) {
        unlogged.get('/')
            .expect("Content-Type",/html/)
            .expect(200)
        .end(done);
    });
    it("Should respond with json on api/kansa/", function (done) {
        unlogged.get("/api/kansa/")
            .expect("Content-Type",/json/)
        .end(done);
    })
    it("Should respond with json on api/hugo/", function (done) {
        unlogged.get("/api/hugo/")
            .expect("Content-Type",/json/)
        .end(done);
    })
})

describe("Member list",function () {
    it ("Returns 'success' as status and test data member list.", function (done) {
        unlogged.get("/api/kansa/public/people")
        .expect(200,{status: 'success', data: memberlist})
            .end(done);
        })
})

describe("Country statistics", function () {
    it("Returns country statistics", function (done) {
        unlogged.get("/api/kansa/public/stats").expect(200,{status:'success', members: memberstats}).end(done)
    })
})

describe("Login",function () {
    it("gets a session cookie or it gets the hose again.",function (done) {
        admin.get("/api/kansa/login").query(loginparams).expect(200,{status:'success', email:loginparams["email"]}).end(done)        
    })
    
})