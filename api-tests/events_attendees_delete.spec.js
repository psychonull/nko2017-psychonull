const initTest = require('./index');
const { expect } = require('chai');
const db = require('../models');

let agent = null;
describe('DELETE /events/:id/attendees', () => {
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
      .delete('/api/events/LOLNOTFOUND/attendees')
      .set('Authorization', attendees[0].token)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        done();
      });
  });

  it('Should return 401 unauthorized if no token provided', (done) => {
    agent
      .delete(`/api/events/${event.code}/attendees`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(401);
        done();
      });
  });

  it('Should mark the attendee as "DELETED"', (done) => {
    agent
      .delete(`/api/events/${event.code}/attendees`)
      .set('Authorization', attendees[0].token)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(204);
        db.Attendee.findOne({
          where: {
            UserId: attendees[0].UserId,
            EventId: event.id,
          },
        })
          .then((att) => {
            expect(att.status).to.equal('DELETED');
            done();
          })
          .catch(done);
      });
  });
});
