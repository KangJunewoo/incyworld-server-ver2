const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
require('mocha'); // intellisense를 위함.

chai.should();
chai.use(chaiHttp);

describe('/result API 테스트', ()=>{
  describe('GET /result/:levelNum', ()=>{
    it('어떻게 해야 함.', (done)=>{
      for(let i=1;i<=4;i++){
        chai.request(app)
        .get(`/result/${i}`)
        .end((err, res)=>{
          res.should.have.status(200);
        });
      }
      done();
    });
  });
});
