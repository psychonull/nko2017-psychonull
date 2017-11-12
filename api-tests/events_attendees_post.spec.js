const initTest = require('./index');
const { expect } = require('chai');
const db = require('../models');

let agent = null;
describe('POST /events/:id/attendees', () => {
  let users = null;
  let event = null;
  let attendees = null; // eslint-disable-line
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
        when: (new Date(2020, 10, 10)).toJSON(),
        createdById: users[0].id,
        maxAttendees: 4,
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
      .post('/api/events/LOLNOTFOUND/attendees')
      .send({
        name: 'test',
        email: 'm@s.com',
      })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        done();
      });
  });

  it('Should return 400 if email not provided', (done) => {
    agent
      .post(`/api/events/${event.code}/attendees`)
      .send({
        name: 'lol no email',
      })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
  });

  it('Should create a new user and add it to the event', (done) => {
    const email = 'b@s.com';
    agent
      .post(`/api/events/${event.code}/attendees`)
      .send({ name: 'a', email })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(204);
        db.User.findOne({ where: { email } })
          .then((u) => {
            expect(u).to.exist;
            return db.Event.findOne({
              where: { id: event.id },
              include: [
                { model: db.User, as: 'attendees', through: db.Attendee },
              ],
            });
          })
          .then((e) => {
            expect(e.attendees).to.have.lengthOf(4);
            done();
          })
          .catch(done);
      });
  });

  it('Cannot add attendee if the event is in the past', (done) => {
    db.Event.update({ when: new Date(2008, 10, 1), maxAttendance: 10 }, { where: { id: event.id } })
      .then(() => {
        agent
          .post(`/api/events/${event.code}/attendees`)
          .send({ name: 'a', email: 'm@a.cam' })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(400);
            expect(res.body.message).to.match(/past/);
            done();
          });
      })
      .catch(done);
  });

  it('Cannot add attendee if the event is at the attendees cap', (done) => {
    db.Event.update({ when: new Date(2048, 10, 1), maxAttendance: 4 }, { where: { id: event.id } })
      .then(() => {
        agent
          .post(`/api/events/${event.code}/attendees`)
          .send({ name: 'asdasda', email: 'asdasdm@avava.cam' })
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(400);
            expect(res.body.message).to.match(/maxAttendance/);
            done();
          });
      })
      .catch(done);
  });

  it('Should reuse a existing user and add it to the event');

  it('Should reuse a existing user and resend notification if already in event');
});
