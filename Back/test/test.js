process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
let db = require('../firebase.config');


chai.use(chaiHttp);
describe('Authentification', () => {

    describe('/POST create an account', () => {
        before((done) => {
            db.collection('users').where('email', '==', 'john.doe@gmail.com').get().then(account => {
                if (!account.empty) {
                    account.docs[0].ref.delete();
                }
                done();
            })
        });

        it('It should create an account', (done) => {
            let account = {
                email: "john.doe@gmail.com",
                password: "1234567",
                firstName: "John",
                lastName: "Doe"
            }
            chai.request(server)
                .post('/api/v1/authentification/register')
                .send(account)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });


    describe('/POST login account', () => {

        it('It should login in an account', (done) => {
            let account = {
                email: "john.doe@gmail.com",
                password: "1234567"
            }
            chai.request(server)
                .post('/api/v1/authentification/login')
                .send(account)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });


    describe('/DELETE delete account', () => {
        
        it('It should delete an account', () => {
            return new Promise(async function (resolve) {
                let account = {
                    email: "john.doe@gmail.com",
                    password: "1234567"
                }
                let request = await chai.request(server)
                    .post('/api/v1/authentification/login')
                    .send(account);

                let token = {token: request.body['token']};

                chai.request(server)
                    .delete('/api/v1/authentification/delete')
                    .send(token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('UserDeleted');
                        resolve();
                    });
            });
        });
    });


});
