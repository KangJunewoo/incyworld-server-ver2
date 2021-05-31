/**
 * 15 : sequelize.sync시 에러떴을때
 * 38, 44~ : 쌩뚱맞은 url에 요청날릴 경우
 */

const req = require("supertest");
const app = require("../app");
const statusCode = require("../modules/statusCode");

// Q : DB에 접속 자체가 안 될때의 테스트는 어떻게 짤까?

describe("예외상황 테스트", () => {
    test("엉뚱한 요청이 주어졌을 경우 404 리턴하기", async () => {
        await req(app).get("/merong").expect(statusCode.NOT_FOUND);
    });
});

describe;
