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
        body: 'Lol I send only the body ;D',
      })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
  });

});
