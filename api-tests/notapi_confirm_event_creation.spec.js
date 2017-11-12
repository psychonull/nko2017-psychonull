const initTest = require('./index');
const { expect } = require('chai');
const db = require('../models');

let agent = null;
describe('(not_api) GET /events/:id/:token', () => {
  let user = null;
  let event = null;
  let attendeeUser = null;
  const creatorAttendeeToken = 'lolfaketoken';
  const attendeeUserToken = 'x_x_x';
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
      db.User.create({ email: 'other@x.xxx' }),
    ]))
    .then(([newUser, newAttendeeUser]) => {
      user = newUser;
      attendeeUser = newAttendeeUser;
      return db.Event.create({
        title: 'new event',
        when: (new Date()).toJSON(),
        createdById: user.id,
        status: 'PENDING',
      });
    })
    .then((newEvent) => {
      event = newEvent;
      return event.addAttendee(user, { through: { token: creatorAttendeeToken, status: 'PENDING' } });
    })
    .then(() => event.addAttendee(attendeeUser, { through: { token: attendeeUserToken, status: 'PENDING' } })));

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

  it('Should mark the event as CONFIRMED if token belongs to owner', (done) => {
    agent
      .get(`/events/${event.code}/${creatorAttendeeToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        db.Event.findOne({ where: { id: event.id } })
          .then((e) => {
            expect(e.status).to.equal('CONFIRMED');
            done();
          })
          .catch(done);
      });
  });

  it('Should not mark the event as CONFIRMED if token belongs to owner but it is CANCELLED', (done) => {
    db.Event.update({
      status: 'CANCELLED',
    }, {
      where: { id: event.id },
    })
      .then(() => {
        agent
          .get(`/events/${event.code}/${creatorAttendeeToken}`)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(200);
            db.Event.findOne({ where: { id: event.id } })
              .then((e) => {
                expect(e.status).to.equal('CANCELLED');
                done();
              })
              .catch(done);
          });
      })
      .catch(done);
  });

  it('Should mark the attendee as ACTIVE as well', (done) => {
    db.Event.update({
      status: 'PENDING',
    }, {
      where: { id: event.id },
    })
      .then(() => {
        agent
          .get(`/events/${event.code}/${creatorAttendeeToken}`)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(200);
            db.Event.findOne({ where: { id: event.id } })
              .then((e) => {
                expect(e.status).to.equal('CONFIRMED');
                return db.Attendee.findOne({ where: { token: creatorAttendeeToken } });
              })
              .then((att) => {
                expect(att.status).to.equal('ACTIVE');
                done();
              })
              .catch(done);
          });
      })
      .catch(done);
  });

  it('Should only mark the attendee as ACTIVE (and not the event) if token belongs to regular attendee', (done) => {
    db.Event.update({
      status: 'PENDING',
    }, {
      where: { id: event.id },
    })
      .then(() => {
        agent
          .get(`/events/${event.code}/${attendeeUserToken}`)
          .end((err, res) => {
            expect(res.statusCode).to.be.equal(200);
            db.Event.findOne({ where: { id: event.id } })
              .then((e) => {
                expect(e.status).to.equal('PENDING');
                return db.Attendee.findOne({ where: { token: attendeeUserToken } });
              })
              .then((att) => {
                expect(att.status).to.equal('ACTIVE');
                done();
              })
              .catch(done);
          });
      })
      .catch(done);
  });
});
