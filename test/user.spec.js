const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
require('mocha'); // intellisense를 위함.

chai.should();
chai.use(chaiHttp);

describe('/user API 테스트', ()=>{
  describe('POST /user', ()=>{
    it('어떻게 해야 함.', (done)=>{
      chai.request(app)
        .post('/user')
        .send({'foo':'bar'})
        .end((err, res)=>{
          done();
        });
    });
  });
});
