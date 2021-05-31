const req = require("supertest");
const { sequelize, Result, User } = require("../models");
const app = require("../app");
const util = require("../modules/util");
const resMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

const expectedDatas = [];
for (let i = 1; i <= 4; i++) {
    expectedDatas.push({
        id: i,
        imageUrl: `sampleImageUrl${i}`,
        videoUrl: `sampleVideoUrl${i}`,
        title: `sampleTitle${i}`,
        guide: `sampleGuide${i}`,
    });
}

beforeAll(async () => {
    await sequelize.sync();
    for (let data of expectedDatas) {
        await Result.create(data);
    }
});

describe("POST /user", () => {
    test("정상적인 body가 주어질 경우 유저 잘 만들기", async () => {
        await req(app)
            .post("/user")
            .send({
                birthYear: 1998,
                answers: [1, 4, 2, 3, 2, 2, 3, 4, 1, 4],
            })
            .expect(
                // QUESTION : 왜 100 100 4 대신 expect.anything() 혹은 expect.any(Number) 하면 안될까?
                statusCode.CREATED,
                util.success(statusCode.CREATED, resMessage.SUCCESS, {
                    score: 100,
                    scoreRate: 100,
                    levelNum: 4,
                }),
            );
    });
});

afterAll(async () => {
    await sequelize.sync({ force: true });
});
