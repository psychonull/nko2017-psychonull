const initTest = require('./index');
const { expect } = require('chai');
const db = require('../models');

let agent = null;
describe.skip('(not_api) GET /events/:id/:token', () => {
  let users = null;
  let event = null;

  before(() => initTest
    .then((a) => {
      agent = a;
      return Promise.all([
        db.Event.truncate({ cascade: true, force: true }),
        db.User.truncate({ cascade: true, force: true }),
        db.Attendee.truncate({ cascade: true, force: true }),
      ]);
    })
    .then(() => db.User.create({ email: 'm@m.com' }))
    .then((newUsers) => {
      users = newUsers;
      return db.Event.create({
        title: 'new event',
        when: (new Date()).toJSON(),
        createdById: users[0].id,
      });
    })
    .then((newEvent) => {
      event = newEvent;
    }));

  it('Should return 404 error if the event is not found', (done) => {
    agent
      .get('/events/LOLNOTFOUND/fakekey')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        done();
      });
  });

  it('Should return 401 if event found but invalid token', (done) => {
    agent
      .get(`/events/${event.code}/hackerman`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(401);
        done();
      });
  });

  it('Should mark the event as CONFIRMED if token belongs to owner');

  it('Should not mark the event as CONFIRMED if token belongs to owner but it is CANCELLED');

  it('Should mark the attendee as ACTIVE if token belongs to regular attendee');

  it('Should not mark the attendee as ACTIVE if token belongs to regular attendee but it is DELETED');
});
