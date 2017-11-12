const initTest = require('./index');
const { expect } = require('chai');
const db = require('../models');

let agent = null;
describe('POST /events', () => {
  before(() => initTest
    .then((a) => {
      agent = a;
      return Promise.all([
        db.Event.truncate({ cascade: true, force: true }),
        db.User.truncate({ cascade: true, force: true }),
        db.Attendee.truncate({ cascade: true, force: true }),
      ]);
    }));

  it('Should return 400 error if the body is empty', (done) => {
    agent
      .post('/api/events')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
  });

  it('Should return 400 error if required params not supplied', (done) => {
    agent
      .post('/api/events')
      .send({
        body: 'Lol I sent the body only ;D',
      })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
  });

  it('Should return 204 response with empty body if everything is ok', (done) => {
    agent
      .post('/api/events')
      .send({
        title: 'Mondays soccer',
        body: 'Like every other monday we congregate to play soccer',
        when: (new Date()).toJSON(),
        email: 'nko-2017@mailinator.com',
      })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(204);
        done();
      });
  });

  it('Should create the User and the Event in the database', (done) => {
    const email = 'morty@tv.space';
    const requestBody = {
      title: 'Mondays soccer',
      body: 'Like every other monday we congregate to play soccer',
      name: 'Morty',
      when: (new Date()).toJSON(),
      email,
    };
    agent
      .post('/api/events')
      .send(requestBody)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(204);
        db.User.findOne({
          where: { email },
        })
          .then((user) => {
            expect(user).to.exist;
            expect(user.name).to.equal('Morty');
            expect(user.status).to.equal('PENDING');
            return db.Event.findOne({
              where: { createdById: user.id },
            });
          })
          .then((event) => {
            expect(event).to.exist;
            expect(event.title).to.equal(requestBody.title);
            expect(event.body).to.equal(requestBody.body);
            expect(event.when.toJSON()).to.equal(requestBody.when);
            done();
          })
          .catch(done);
      });
  });

  it('Should reuse existing user', (done) => {
    const email = 'a@a.pw';
    db.User.create({
      email,
      status: 'ACTIVE',
    })
      .then(() => {
        agent
          .post('/api/events')
          .send({
            title: 'BBQ',
            body: 'Bring some drinks',
            name: 'Morty',
            when: (new Date()).toJSON(),
            email,
          })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(204);
            db.User.findAll({
              where: { email },
            })
              .then((users) => {
                expect(users).to.exist;
                expect(users).to.have.lengthOf(1);
                expect(users[0].status).to.equal(
                  'ACTIVE',
                  'Should remain active because it was active from before event creation',
                );
                done();
              })
              .catch(done);
          });
      })
      .catch(done);
  });

});
