const initTest = require('./index');
const { expect } = require('chai');

let agent = null;
describe('POST /events', () => {
  before(() => initTest
    .then((a) => {
      agent = a;
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

});
