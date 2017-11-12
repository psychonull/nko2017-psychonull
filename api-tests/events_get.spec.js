const initTest = require('./index');
const { expect } = require('chai');
const db = require('../models');

let agent = null;
describe('GET /events/:id', () => {
  let users = null;
  let event = null;
  let attendees = null;
  before(() => initTest
    .then((a) => {
      agent = a;
      return Promise.all([
        db.Event.truncate({ cascade: true, force: true }),
        db.User.truncate({ cascade: true, force: true }),
        db.Attendee.truncate({ cascade: true, force: true }),
      ]);
    })
    .then(() => Promise.all([
      db.User.create({ email: 'm@m.com' }),
      db.User.create({ email: 'n@m.com' }),
      db.User.create({ email: 'o@m.com' }),
    ]))
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
      return Promise.all(users.map(u => db.Attendee.create({
        UserId: u.id,
        EventId: event.id,
        token: `${Math.random() * 10000}faketoken`,
      })));
    })
    .then((newAttendees) => {
      attendees = newAttendees;
    }));

  it('Should return 404 error if the event is not found', (done) => {
    agent
      .get('/api/events/LOLNOTFOUND')
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        done();
      });
  });

  it('Should return 200 with full info if found', (done) => {
    agent
      .get(`/api/events/${event.code}`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.title).to.equal(event.title);
        expect(res.body.attendees).to.be.an('array');
        expect(res.body.attendees).to.have.lengthOf(3);
        expect(res.body.createdBy).to.be.an('object');
        done();
      });
  });

  it('Should not include attendee tokens', (done) => {
    agent
      .get(`/api/events/${event.code}`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        res.body.attendees.forEach(att => expect(att.token).to.be.undefined);
        done();
      });
  });

  it('Should not include hidden properties', (done) => {
    const checkUserProps = (u) => {
      expect(u.id).to.be.undefined;
      expect(u.email).to.be.undefined;
      expect(u.createdAt).to.be.undefined;
      expect(u.updatedAt).to.be.undefined;
      expect(u.deletedAt).to.be.undefined;
    };

    agent
      .get(`/api/events/${event.code}`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.be.undefined;
        expect(res.body.deletedAt).to.be.undefined;
        expect(res.body.createdById).to.be.undefined;
        checkUserProps(res.body.createdBy);
        res.body.attendees.forEach(a => checkUserProps(a));
        done();
      });
  });

  it('Should include the "me" flag if authorized and present in the event as creator or attendee', (done) => {
    agent
      .get(`/api/events/${event.code}`)
      .set('Authorization', attendees[0].token)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.createdBy.me).to.be.true;
        expect(res.body.attendees.filter(att => att.me)).to.have.lengthOf(1);
        done();
      });
  });
});
